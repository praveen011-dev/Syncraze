import {body} from "express-validator" // directly req.body is accesible h

const userRegistrationValidator=()=>{
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('username')
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({min:3}).withMessage("username should atleast 3char")
            .isLength({max:13}).withMessage("username can't exceed 13char")
    ]
}

const userLoginValidator=()=>{
    return [
        body('email')
            .isEmail().withMessage("Email is not valid"),
        body('password')
            .notEmpty().withMessage("password cannot be empty")

    ]
}

export {userRegistrationValidator,userLoginValidator}