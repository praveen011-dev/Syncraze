import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.models.js"
import crypto from "crypto"
import { emailVerificationMailGenContent,forgetPasswordMailGenContent, SendMail } from "../utils/mail.js";
import { ApiError } from "../utils/api.error.js";
import jwt from "jsonwebtoken"


//Generate Access And Refresh Token
const generateAccessTokenAndRefreshToken=async(id)=>{

try {
    const user=await User.findById(id)

    const accessToken=await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    user.refreshToken=refreshToken
  
    await user.save();
  
    return {accessToken,refreshToken}
}catch (error) {
  return next(new ApiError(500, "Token generation failed"));
}
}

//Register User


const RegisterUser=asyncHandler(async(req,res,next)=>{
  const {email,username,password,role}=req.body

  const existinguser=await User.findOne({email})

  if(existinguser){
    return next(new ApiError(400,"User Already Exist!"))
  }

  const user= await User.create({
    email,
    username,
    password,
    role
  })


  // create verification token

  const {hashedToken,unHashedToken,tokenExpiry}= user.generateTemporaryToken();

  user.emailVerificationToken =hashedToken
  user.emailVerificationExpiry=tokenExpiry

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
const verifyEmail = asyncHandler(async (req, res,next) => {
    const {unHashedToken}=req.params;

    if(!unHashedToken) {
    return next(new ApiError(400, "Token Missing !"));
    } 

    const userHashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")


    const user= await User.findOne({
      emailVerficationToken:userHashedToken,
      emailVerficationExpiry:{$gt:Date.now()}
     })

     if(!user){
      return next(new ApiError(400, "User Not Found !"));
     }

     user.isEmailVerified=true
     user.emailVerficationToken=undefined
     user.emailVerficationExpiry=undefined
     
     await user.save();

     res.status(200).json(new ApiResponse(200,{message:"Verify Successfull"}))

     
  });

//LoginUser
const LoginUser=asyncHandler(async(req,res,next)=>{

  const {username,email,password}=req.body

  const user=await User.findOne({$or:[{username},{email}]})

  if(!user){
    return next(new ApiError(400, "User Not Found !"));
  }

  //password check by isPassword method

  const passwordcheck=await user.isPasswordCorrect(password)

  if(!passwordcheck){
    return next(new ApiError(400, "User Creditials is incorrect"));
  }

  //generate Acess token and refresh token.

const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)

  //cokie options

  const options={
    httpOnly:true, // by default koi bhi modify kar sakta h cookie ko frontend pr (localStorage mei) isliye httpOnly ka use hota h taki modification only server par ho sake . 
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
      "User Logged In Successfully",
      {
        user:accessToken,refreshToken // it is for if user want to save in localstorage or want to make the mobile application.
      },
      
    )
  )
}
)


//Refresh-AccessToken
const refreshAccessToken = asyncHandler(async (req, res,next) => {

    const incomeRToken=req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomeRToken){
      return next(new ApiError(400, "IncomingRToken is missing"));
    }

   try {
     const decodedRToken =jwt.verify(incomeRToken,process.env.REFRESH_TOKEN_SECRET)

     const user=await User.findById(decodedRToken?._id)

       if(!user){
        return next(new ApiError(400, "Invalid Refresh Token"));
       }
 
       if(incomeRToken !==user?.refreshToken){
        return next(new ApiError(400, "Refresh Token is expired or used"));

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
            "Acess Token SuccessFully Refreshed",
           {
             user:accessToken,refreshToken:newRefreshToken 
           },
          
         )
       )
   } catch (error) {
      return next(new ApiError(400, "Invalid Refresh Token"));

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
       .json(new ApiResponse(200,"User logout SuccessFully",{})
      )
  });

//Forget Password

const forgotPasswordRequest = asyncHandler(async (req, res,_next) => {
  const { email, username} = req.body;

  const user=await User.findOne({$or:[{username},{email}]})

  // create forget Password TOken

  const {hashedToken,unHashedToken,tokenExpiry}= user.generateTemporaryToken();

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

const resetForgottenPassword = asyncHandler(async (req, res,next) => {

  const {unHashedToken} =req.params
  const {password :newPassword}=req.body

  if(!unHashedToken) {
    return next(new ApiError(400, "UHToken is missing"));
  } 

  const userHashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")


  const user= await User.findOne({
    forgetPasswordToken:userHashedToken,
    forgetPasswordExpiry:{$gt:Date.now()}
   })
   

   if(!user){
    return next(new ApiError(400, "User Not Found!"));
   }

   user.password=newPassword
   user.forgetPasswordToken=undefined
   user.forgetPasswordExpiry=undefined

   await user.save();

   return res
   .json(new ApiResponse(200,"Password Reset Successfull"));

});


// ChangeCurrentPassword

const changeCurrentPassword = asyncHandler(async (req, res,next) => {
    const user=req.user
    const {password:newPassword}=req.body

   if(!user){
    return next(new ApiError(400, "User Not Found !"));
  }

   user.password=newPassword

   await user.save();

   return res
   .json(new ApiResponse(200,"Password Modify successfull"));

});

//Resend Email Verification 

const resendEmailVerification = asyncHandler(async (req, res,next) => {

  const user=req.user

  if(!user){
    return next(new ApiError(400, "Unauthorised Access!"));
  }

    
  // create resend verification token

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
    .json(new ApiResponse(201, "Resend Email Successfully. Please verify your email." ));

});

//getCurrent User

const getCurrentUser = asyncHandler(async (req, res,next) => {
  
  const user=await User.findById(req.user._id).select("-password -refreshToken");

  if(!user){
    return next(new ApiError(400, "User Not Found!"));
  }
  
  return res
  .json(
    new ApiResponse(200,user,"User Profile fetched Successfully"
    )
  )
});


console.log("Defined RegisterUser:", RegisterUser);
console.log("Defined LoginUser:", LoginUser);


export { 
  verifyEmail,
  RegisterUser,
  LoginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  forgotPasswordRequest,
  resetForgottenPassword,
  resendEmailVerification,
  changeCurrentPassword
};
