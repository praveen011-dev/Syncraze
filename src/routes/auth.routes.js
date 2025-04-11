import {Router} from "express";
import { forgotPasswordRequest, getCurrentUser, LoginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail } from "../controllers/authcontrollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator,userLoginValidator, userForgetPasswordValidator } from "../validators/index.js";
import isLoggedIn from "../middlewares/auth.middleware.js";
const router=Router()


router.route("/register")
.post(userRegistrationValidator(),validate,registerUser) //Factory pattern

router.get("/verify/:unHashedToken",verifyEmail)

router.get("/login",userLoginValidator(),validate,LoginUser)

router.get("/forget-password/:unHashedToken",userForgetPasswordValidator(),validate,forgotPasswordRequest)


//secured Routes

router.get("/logout",isLoggedIn,logoutUser)
router.get("/refresh-accessToken",refreshAccessToken) //generate new AT&RT
router.get("/get-profile",isLoggedIn,getCurrentUser)



export default router