import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/db.js";

dotenv.config({
    path:"./.env"  //verbo code is always good always define path in dotenv config 
})

const PORT=process.env.PORT || 3000;


connectDB()
    .then(()=>{
        app.listen(PORT,()=> console.log("Server is running on port ",PORT))
    })
    .catch((err)=>{
        console.error("Mongodb connection error",err)
        process.exit(1)
    })

