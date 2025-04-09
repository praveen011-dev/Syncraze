import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {User} from "../models/user.models.js"
import crypto from "crypto"
import { emailVerificationMailGenContent, SendMail } from "../utils/mail.js";


const generateAccessTokenAndRefreshToken=async(email)=>{

try {
    const user=await User.findById({email})
  
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
  
    user.refreshToken=refreshToken
  
    await user.save();
  
    return {accessToken,refreshToken}
} catch (error) {
  //err will be here!
}
}




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

  user.emailVerficationToken =hasedToken
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

    if(!unHashedToken) {
      res.status(400).json(new ApiResponse(401,{message:"Token is Missing"}))
    } 

    const userHashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")


    const user= await User.findOne({
      emailVerficationToken:userHashedToken,
      emailVerficationExpiry:{$gt:Date.now()}
     })

     if(!user){
      res.status(400).json(new ApiResponse(400,{message:"Try again! not Verfied"}))
     }

     user.isEmailVerified=true
     user.emailVerficationToken=undefined
     user.emailVerficationExpiry=undefined
     
     await user.save();

     res.status(200).json(new ApiResponse(200,{message:"Verify Successfull"}))

     
  });


  const LoginUser=async(req,res)=>{

    const {username,email,password}=req.body
    //validate email and username or password
    if(!(username || email)){
      throw new ApiError(400,"username or email is required");
    }
    
    const user=await User.findById({email})

    if(!user){
      res.status(400).json(new ApiResponse(400,{message:"User not found "}))
    }

    //password check by isPassword method

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

    const options={
      httpOnly:true, // by default koi bhi modify kar sakta h cookie ko frontend pr isliye httpOnly ka use hota h taki modification only server par ho sake . 
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
        200,
        {
          user:accessToken,refreshToken // it is for if user want to save in localstorage or want to make the mobile application.
        },
        "User Logged In Successfully"
      )
    )
  }


export { registerUser,verifyEmail };
