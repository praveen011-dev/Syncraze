import { body,oneOf } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be atleast 3 char")
      .isLength({ max: 13 })
      .withMessage("Username cannot exceed 13 char"),
    
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      
  ];
};


const userLoginValidator=()=>{
  return [
    oneOf([
      body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid'),
      body('username')
        .notEmpty().withMessage('Username is required'),
    ], 'Either email or username must be provided'),
      body('password')
          .notEmpty().withMessage("password cannot be empty"),

    ]
}

const userForgetPasswordValidator=()=>{
  return [
    oneOf([
      body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is not valid'),
      body('username')
        .notEmpty().withMessage('Username is required'),
    ], 'Either email or username must be provided')

    ]
}

const userResetPasswordValidator=()=>{
  return [
    body('password')
          .notEmpty().withMessage("password cannot be empty")

    ]
}

const userResendEmailVerificationValidator=()=>{
  return [
    body('email')
          .isEmail().withMessage("Enter a valid email")
          .notEmpty().withMessage("email is required")

    ]
}


export {userRegistrationValidator,userLoginValidator,userForgetPasswordValidator,userResetPasswordValidator,userResendEmailVerificationValidator}