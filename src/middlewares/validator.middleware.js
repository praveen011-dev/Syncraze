import { validationResult } from "express-validator";
import { ApiError } from "../utils/api.error.js";

    const validate=(req,res,next)=>{
    const errors=validationResult(req);

    console.log(errors.array());


    if(errors.isEmpty()){
        return next()
    }
    
    const extractedError=[]
    errors.array().map((err)=>extractedError.push({
        [err.path]:err.msg
    }))


    return next(new ApiError(400,extractedError,"Error while updating role"));
}


export {validate}