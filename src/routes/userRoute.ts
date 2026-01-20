import express from 'express'
import AuthController from '../controller/userController.js'
const router = express.Router()

router.route("/register").post(AuthController.registerUser)
router.route("/login").post(AuthController.loginUser)

router.route("/forgot-password").post(AuthController.forgotPassword)

router.route("/verifyOtp").post(AuthController.verifyOtp)


router.route("/resetpassword").post(AuthController.resetpassword)
export default router