import {Router} from "express";
import { LoginUser, registerUser, verifyEmail } from "../controllers/authcontrollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator,userLoginValidator } from "../validators/index.js";
const router=Router()


router.route("/register")
.post(userRegistrationValidator(),validate,registerUser) //Factory pattern

router.get("/verify/:unHashedToken",verifyEmail)

router.get("/login",userLoginValidator(),validate,LoginUser)


export default router