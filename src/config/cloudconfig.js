import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  
  params: {
    folder: "syncraze", 
    allowed_formats: ["png", "jpg", "jpeg", "webp"], 
    public_id: (req, _file) => {
      return `${req.body.username}-${Date.now()}`; 
    },
  },
});

export { storage };