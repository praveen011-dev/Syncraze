import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api.error.js"

const isLoggedIn=async(req,res,next)=>{
  try {
      const accessToken=req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer","")

      // console.log("cookies:", req.cookies);
      // console.log("authorization Header:", req.header("Authorization"));
      // console.log("access Token:", accessToken);

  
      if(!accessToken){
          res.status(400).json(new ApiError(400,"AcessToken is missing"));
      }
  
      const decodedAToken= jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
  

      const user=await User.findById(decodedAToken?._id).select("-password -refreshToken")
  
      if(!user){
          throw new ApiError(401,"Invalid Access Token")
      }
      req.user=user
      next();
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")


  }
}

export default isLoggedIn;