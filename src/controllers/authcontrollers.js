import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {User} from "../models/user.models.js"
import crypto from "crypto"
import { emailVerificationMailGenContent, SendMail } from "../utils/mail.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, { message: "User already exists" }));
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  // create verification token

  const {hasedToken,unHashedToken,tokenExpiry}= user.generateTemporaryToken();

//   console.log(token);
  user.emailVerificationToken =hasedToken
  user.emailVerficationExpiry=tokenExpiry

  await user.save();

  // send verification email
  
  await SendMail({
    email: user.email,
    subject: "Verify Your Email",
    mailGenContent: emailVerificationMailGenContent(
      user.username,
      `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    ),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { message: "User registered. Please verify your email." }));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {unHashedToken}=req.params;
    console.log(unHashedToken);

    if(!unHashedToken) {
      res.status(400).json(new ApiResponse(401,{message:"Token is Missing"}))
    } 

    const userHashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")


    const user= await User.findOne({
      emailVerificationToken:userHashedToken
     })

     if(user){
      res.status(200).json(new ApiResponse(200,{message:"Verify Successfull"}))
     }

      return res.status(400).json(new ApiResponse(400,{message:"Try again! not Verfied"}))

      
  });





export { registerUser,verifyEmail };
