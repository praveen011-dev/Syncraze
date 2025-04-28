import {Router} from "express";
const router=Router()

import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, LoginUser, logoutUser, refreshAccessToken, resendEmailVerification, resetForgottenPassword, verifyEmail, RegisterUser } from "../controllers/auth.controller.js";

import validate  from "../middlewares/validator.middleware.js";

import { userRegistrationValidator,userLoginValidator, userForgetPasswordValidator,userResetPasswordValidator, userResendEmailVerificationValidator } from "../validators/user.validator.js";

import isLoggedIn from "../middlewares/auth.middleware.js";


console.log("userRegistrationValidator:", userRegistrationValidator);
console.log("validate:", validate);





router.post("/register",RegisterUser );
 //Factory pattern

router.get("/verify/:unHashedToken",verifyEmail)

router.post("/login",userLoginValidator(),validate,LoginUser)

router.post("/forget-password",userForgetPasswordValidator(),validate,forgotPasswordRequest)

router.post("/reset-password/:unHashedToken",userResetPasswordValidator(),validate,resetForgottenPassword)

router.post("/resendemailverify",userResendEmailVerificationValidator(),validate,isLoggedIn,resendEmailVerification)

//secured Routes

router.post("/logout",isLoggedIn,logoutUser)
router.get("/refresh-accessToken",refreshAccessToken) //generate new AT&RT
router.get("/get-profile",isLoggedIn,getCurrentUser)
router.post("/change-password",isLoggedIn,changeCurrentPassword) 




export default router;