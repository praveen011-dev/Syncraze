import { ApiResponse } from "../utils/api.response"

const isLoggedIn=async(req,res,next)=>{
    const {accessToken,refreshToken}=req.cookies

    if(!accessToken && !refreshToken){
        res.status(400).json(new ApiResponse(400,"AcessToken/RefreshToken is missing"));
    }

    const decoded= jwt.verify(accessToken,ACCESS_TOKEN_SECRET)

    req.user=decoded
    next();
}