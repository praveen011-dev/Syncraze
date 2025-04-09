import {Router} from "express";
import { LoginUser, registerUser, verifyEmail } from "../controllers/authcontrollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";
const router=Router()


router.route("/register")
.post(userRegistrationValidator(),validate,registerUser) //Factory pattern

router.route("/verify")
.get("/:unHashedToken",verifyEmail)

router.route("/login")
.get(LoginUser)

export default router