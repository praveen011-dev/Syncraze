import mongoose from "mongoose";

const connectDB= async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URL);
       console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDb connection faile",error)
        process.exit(1); //why we write it learn from your self
    } 
}



export default connectDB;