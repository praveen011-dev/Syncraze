import { validationResult } from "express-validator";
import { ApiError } from "../utils/api.error.js";

    const validate=(req,_res,next)=>{
    const errors=validationResult(req);

    console.log(errors.array());


    if(errors.isEmpty()){
        return next()
    }
    
    const extractedError=[]
    
    errors.array().map((err)=>extractedError.push({
        [err.path]:err.msg
    }))


    return next(new ApiError(400,extractedError,"Recieved Data is not valid"));
}


export default validate