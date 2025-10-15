import { OTP } from '../models/otp.model.js'
import Student from '../models/student.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendEmail } from '../utils/Email.js'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

const generateNumricOTP = function() {
    return crypto.randomInt(100000,1000000)
}
const generateHashedOTP = function(otp) {
    return crypto.createHmac('sha256', process.env.OTP_SECRET_KEY)
                 .update(String(otp))
                 .digest('hex')
}
const generateAccessAndRefreshToken = async(student) => {
    const accessToken = student.generateAccessToken()
    const refreshToken = student.generateRefreshToken()
    student.refreshToken = refreshToken
    await student.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
}
const registerStudent = asyncHandler(async (req, res, next) => {
    //get student details 
    //validate student
        // 1. empty/wrong details
        // 2. registered or not
        // 3. otp validation

    const {name, email, password} = req.body
    console.log(req.header("content-type"))

    if([name, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedStudent = await Student.findOne({email})
    if(existedStudent && existedStudent.verified){
        throw new ApiError(409, "Student already exist")
    }
    
    if(!existedStudent){
        await Student.create({
            name,
            email, 
            password
        })
    }
    else{
        existedStudent.name = name
        existedStudent.password = password
        await existedStudent.save()
    }

    const createdStudent = await Student.findOne({email}).select('-password -refreshToken')
    if(!createdStudent){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    
    req.student = createdStudent
    next()
})

const sendOTP = asyncHandler(async (req, res) => {
    const student = req.student
    //otp generation

    const otp = generateNumricOTP()
    const otpHashed = generateHashedOTP(otp)
    const expiresAt = new Date(Date.now()+5*60*1000)

    await OTP.create({
        studentId: student._id,
        otpHashed,
        expiresAt
    })

    const createdOTP = await OTP.findOne({studentId: student._id})
    if(!createdOTP){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //send mail to user

    const subject = 'Your Verification Code'
    const text = `Your Verification Code is ${otp}. It will expire in 5 minutes`

    try {
        await sendEmail(student.email, subject, text)
        return res.status(200).send("OTP sent")
    } catch (err) {
        console.log("mail error : ", err)
        throw new ApiError(500, 'failed to send mail')
    }
})

const verifyStudent = asyncHandler(async (req, res) => {
    const {email, otp} = req.body
    if(!email || !otp){
        throw new ApiError(400, 'email and otp both field is required')
    }

    const student = await Student.findOne({email})
    if(!student){
        throw new ApiError(400, 'user not found')
    }

    const otpRecord = await OTP.findOne(
        {
            studentId: student._id,
            used: false
        }
    ).sort({createdAt: -1})
    if(!otpRecord){
        throw new ApiError(400, 'no otp requested')
    }
    if(Date.now() > otpRecord.expiresAt){
        throw new ApiError(400, 'otp expired')
    }
    if(otpRecord.attempts>5){
        throw new ApiError(400, 'too many attempts')
    }

    //compare time safe
    const submittedHash = generateHashedOTP(otp);
    const a = Buffer.from(submittedHash, 'hex');
    const b = Buffer.from(otpRecord.otpHashed, 'hex');
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if(!match){
        otpRecord.attempts+=1
        await otpRecord.save()
        throw new ApiError(400, 'invalid OTP')
    }

    //success
    otpRecord.used = true
    await otpRecord.save()
    student.verified = true
    await student.save()
    return res.status(201).json(
        new ApiResponse(200, student, 'Student registered successfully')
    )
})

const loginStudent = asyncHandler(async (req, res) => {
    // 1. get email and password
    // 2. verify them
    // 3. set access and refresh token
    // 4. send token via cookie

    const {email, password} = req.body

    if([email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Invalid credentials")
    }

    const student = await Student.findOne({email})
    if(!student){
        throw new ApiError(400, "You are not registered")
    }

    if(!student.verified){
        throw new ApiError(400, "Please complete your registeration process")
    }

    const isPasswordValid = await student.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400, "Incorrect password")
    }  

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(student)


    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken")

    //send cookie
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res.status(201)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
        new ApiResponse(
            200,
            {
                student: loggedInStudent,
                accessToken,
                refreshToken
            },
            "Logged In successfully"
        )
    )

})

const logoutStudent = asyncHandler(async(req, res) => {
    const student = req.student
    console.log(student)
    await Student.findByIdAndUpdate(
        student._id,
        {
            $unset: {
                'refreshToken': ""
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res.status(200)
    .clearCookie('accessToken', option)
    .clearCookie('refreshToken', option)
    .json(
        new ApiResponse(
            200,
            {},
            "Logged Out successfully"
        )
    )

}) 

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken
    if(!token){
        throw new ApiError(401, "No refreshToken")
    } 
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    const student = await Student.findById(decodedToken._id)
    if(!student){
        throw new ApiError(401, "Invalid Refresh Token")
    }
   
    //if request is coming with used refresh token --> possible threat(refresh Token got stolen) --> end all session
    if(student.refreshToken !== token){
        student.refreshToken = undefined
        await student.save()
        throw new ApiError(401, "Bad Request")
    }
  
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(student)

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
    return res.status(201)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
        new ApiResponse(
            201,
            {
                accessToken,
                refreshToken
            },
            "Token refreshed successfully"
        )
    )
})
export {
    registerStudent,
    sendOTP, 
    verifyStudent,
    loginStudent,
    logoutStudent,
    refreshAccessToken
}
