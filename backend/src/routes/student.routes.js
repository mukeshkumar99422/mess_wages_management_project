import { Router } from "express";
import { loginStudent, logoutStudent, refreshAccessToken, registerStudent, sendOTP, verifyStudent } from '../controllers/student.controller.js'
import verifyJWT from "../middlewares/auth.middleware.js";

const studentRouter = Router()

studentRouter.route('/register').post(registerStudent,sendOTP)
studentRouter.route('/verify-student').post(verifyStudent)
studentRouter.route('/login').post(loginStudent)
studentRouter.route('/logout').post(verifyJWT, logoutStudent)
studentRouter.route('/refresh-token').post(refreshAccessToken)

export {studentRouter}