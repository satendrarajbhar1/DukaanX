import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const removeLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error("Temp file delete failed:", e.message);
  }
};

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    return result.secure_url;
  } finally {
    // success ho ya fail, local file hamesha delete
    removeLocalFile(filePath);
  }
};

export default uploadOnCloudinary;