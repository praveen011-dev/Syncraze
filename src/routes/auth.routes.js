import {Router} from "express";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, LoginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgottenPassword, verifyEmail } from "../controllers/authcontrollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator,userLoginValidator, userForgetPasswordValidator,userResetPasswordValidator, userResendEmailVerificationValidator } from "../validators/index.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
const router=Router()


router.route("/register")
.post(userRegistrationValidator(),validate,registerUser) //Factory pattern

router.get("/verify/:unHashedToken",verifyEmail)

router.post("/login",userLoginValidator(),validate,LoginUser)

router.post("/forget-password",userForgetPasswordValidator(),validate,forgotPasswordRequest)

router.post("/reset-password/:unHashedToken",userResetPasswordValidator(),validate,resetForgottenPassword)

router.post("/resendemailverify",userResendEmailVerificationValidator(),validate,resendEmailVerification)

//secured Routes

router.post("/logout",isLoggedIn,logoutUser)
router.get("/refresh-accessToken",refreshAccessToken) //generate new AT&RT
router.get("/get-profile",isLoggedIn,getCurrentUser)
router.post("/change-password",isLoggedIn,changeCurrentPassword) 




export default router