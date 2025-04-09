import { body } from "express-validator";

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


// const userLoginValidator=()=>{
//   return [
//       body('email')
//           .isEmail().withMessage("Email is not valid"),
//       body('password')
//           .notEmpty().withMessage("password cannot be empty"),
//       body('username')


//     ]
// }


export {userRegistrationValidator}