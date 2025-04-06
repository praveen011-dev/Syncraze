import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";
import {User} from "../models/user.models.js"
import { emailVerificationMailGenContent, SendMail } from "../utils/mail.js";

const registerUser=asyncHandler(async(req,res)=>{
    const {email,username,password,role}=req.body

        const existingUser=await User.findOne({email});
        
        if(existingUser){
            return res.status(200).json(new ApiResponse(200,{message:"Success"}))
        }

        const user=User.create({
            username:username,
            email:email,
            password:password,
            role:role,
        })

        //create verification Token

        const token=crypto.randomBytes(32).toString("hex");

        user.emailVerficationToken=token

        await user.save();

    
        SendMail({
            email:user.email,
            subject:"Verify Your Email",
            mailGencontent:emailVerificationMailGenContent({
                Username:user.username,
                VerificationUrl:`Verify Your Email By Click folowwing link
            ${process.env.BASE_URL}/api/v1/users/verify/${Token}`
            })

        })


    

    
    //validation
    
})

export {registerUser}