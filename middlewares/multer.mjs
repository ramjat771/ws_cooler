import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRATE, CLOUD_NAME } from "../config/env.mjs";
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRATE,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
         public_id: (req, file)=> { 
      const name = file.originalname.split(".")[0];
      return `${name}_${Date.now()}`},             // unique name
  },
});
export const upload = multer({ storage });
