import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Student from "../models/student.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
    
    if(!accessToken){
        throw new ApiError(401, "Unauthorised Access")
    }

    //jwt.verify()
    //  1.if all correct-->return decoded payload
    //  2.wrong sign+exp+invalid structure-->instantly throws corresponding error
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    const student = await Student.findById(decodedToken._id).select("-password -refreshToken")
    if(!student){
        throw new ApiError(401, "Invalid Access Token")
    }

    req.student = student
    next()
})

export default verifyJWT