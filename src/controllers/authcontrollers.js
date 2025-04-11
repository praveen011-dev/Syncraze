import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.models.js"
import crypto from "crypto"
import { emailVerificationMailGenContent,forgetPasswordMailGenContent, SendMail } from "../utils/mail.js";
import { ApiError } from "../utils/api.error.js";
import jwt from "jsonwebtoken"


const generateAccessTokenAndRefreshToken=async(id)=>{

try {
    const user=await User.findById(id)

    console.log(`Access and refresh token User ${user}`);

    const accessToken=await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()

    console.log(accessToken);
  
    user.refreshToken=refreshToken
  
    await user.save();
  
    return {accessToken,refreshToken}
} catch (error) {
  //err will be here!
}
}

//Register User
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

  const {hashedToken,unHashedToken,tokenExpiry}= user.generateTemporaryToken();

  user.emailVerficationToken =hashedToken
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

//Verify Email
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

//LoginUser
const LoginUser=asyncHandler(async(req,res)=>{

  const {username,email,password}=req.body
  //validate email and username or password

  const user=await User.findOne({$or:[{username},{email}]})

  console.log(user);

  if(!user){
    res.status(400).json(new ApiResponse(400,{message:"User not found "}))
  }

  //password check by isPassword method

  const passwordcheck=user.isPasswordCorrect(password)

  if(!passwordcheck){
    throw new ApiError(401,"User Creditials is incorrect")
  }

  //generate Acess token and refresh token.

const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

  //cokie options

  const options={
    httpOnly:true, // by default koi bhi modify kar sakta h cookie ko frontend pr isliye httpOnly ka use hota h taki modification only server par ho sake . 
    secure:true
  }


  //setting cookie

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
)

//Refresh-AccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomeRToken=req.cookies.refreshToken || req.body.refreshToken
    
    console.log(incomeRToken)
    if(!incomeRToken){
        throw new ApiError(401,"IncomingRToken is missing")
    }

   try {
     const decodedRToken =jwt.verify(incomeRToken,process.env.REFRESH_TOKEN_SECRET)

     console.log(decodedRToken);
 
     const user=await User.findById(decodedRToken?._id)

     console.log(user);
   
       if(!user){
           throw new ApiError(401,"Invalid Refresh Token")
       }
 
       if(incomeRToken !==user?.refreshToken){
         throw new ApiError(401,"Refresh Token is expire or used")
       }
 
       const options={
         httpOnly:true,  
         secure:true
       }
   
       const {accessToken,newRefreshToken}= await generateAccessTokenAndRefreshToken(user._id)
 
       //setting cookie
   
       return res
       .status(200)
       .cookie("accessToken", accessToken,options)
       .cookie("refreshToken",newRefreshToken,options)
       .json(
         new ApiResponse(
           200,
           {
             user:accessToken,refreshToken:newRefreshToken 
           },
           "Acess Token SuccessFully Refreshed"
         )
       )
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid Refresh Token")

   }

  });

//Logout User

  const logoutUser = asyncHandler(async (req, res) => {
      await User.findByIdAndUpdate(req.user._id,
        {
            $set:{refreshToken:undefined}
        },

        {
            new:true
        })


        const options={
          httpOnly:true,  
          secure:true
        }

        return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200,{},"User logout SuccessFully"
        )
      )
    //validation
  });


//Forget Password

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username} = req.body;

  const user=await User.findOne({$or:[{username},{email}]})

  console.log(user);
  // create forget Password TOken

  const {hashedToken,unHashedToken,tokenExpiry}= user.generateTemporaryToken();

  // console.log(hashedToken)
  // console.log(unHashedToken)
  // console.log(tokenExpiry)

  user.forgetPasswordToken =hashedToken
  user.forgetPasswordExpiry=tokenExpiry

  await user.save();

  await SendMail({
    email: user.email,
    subject: "Forget Password Request",
    mailGenContent: forgetPasswordMailGenContent(
      user.username,
      `${process.env.BASE_URL}/api/v1/users/reset-password/${unHashedToken}`,
    ),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { message: "Please Check your email. password forget link has been sent to your email" }));

  //validation
});


//Reset forgotten Password

const resetForgottenPassword = asyncHandler(async (req, res) => {

  const {unHashedToken} =req.params
  const {password}=req.body

  if(!unHashedToken) {
    res.status(400).json(new ApiError(401,{message:"Token is Missing"}))
  } 

  const userHashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")


  const user= await User.findOne({
    forgetPasswordToken:userHashedToken,
    forgetPasswordExpiry:{$gt:Date.now()}
   })
   

   if(!user){
    res.status(400).json(new ApiError(400,{message:"Try again! User not Found"}))
   }

   user.password=password
   user.forgetPasswordToken=undefined
   user.forgetPasswordExpiry=undefined

   await user.save();

   return res
   .json(new ApiResponse(200,"Password Reset Successfull"));

  //validation
});


//getCurrent User

const getCurrentUser = asyncHandler(async (req, res) => {
  
  const user=await User.findById(req.user._id).select("-password -refreshToken");
  
  return res
  .json(
    new ApiResponse(200,user,"User Profile fetched Successfully"
    )
  )
});


export { registerUser,verifyEmail,LoginUser ,refreshAccessToken,logoutUser,getCurrentUser,forgotPasswordRequest,resetForgottenPassword};
