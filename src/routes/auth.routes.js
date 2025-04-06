import {Router} from "express";
import { registerUser } from "../controllers/authcontrollers";
import { validate } from "../middlewares/validator.middleware";
import { userRegistrationValidator } from "../validators";
const router=Router()


router.route("/register")
.post(userRegistrationValidator(),validate,registerUser) //Factory pattern



export default router