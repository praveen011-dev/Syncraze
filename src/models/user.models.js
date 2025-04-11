import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import crypto from "crypto";

const userSchema= new Schema({
    avatar:{
        type:{
            url:String,
            localpath:String,
        },
        default :{
             url:`http://placehold.co/600x400`,
             localpath:"",
        }

    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,

    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
       
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },

    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    
    forgetPasswordToken:{
        type:String,
    },

    forgetPasswordExpiry:{
        type:Date,
    },

    refreshToken:{
        type:String,
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpiry:{
        type:Date,
    },

},{timestamps:true})

//pre hook for encrypt the data before saving into MongoDB.

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})


//create self define methods 

 userSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken= async function (){
   return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY }

    )
}

userSchema.methods.generateRefreshToken= async function (){
    return  jwt.sign(
         {
             _id: this._id,
            
         },
         process.env.REFRESH_TOKEN_SECRET,
         {expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
 
     )
 }


 userSchema.methods.generateTemporaryToken=function(){
    const unHashedToken= crypto.randomBytes(20).toString("hex");
    const hashedToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")
    const tokenExpiry=new Date(Date.now() + 20 * 60 * 1000);
    
    return {hashedToken,unHashedToken,tokenExpiry}
}

const User =mongoose.model("User",userSchema)


export default User;
