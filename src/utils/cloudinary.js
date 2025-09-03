import {v2 as cloudinary} from cloudinary;
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File does not exist");
    }
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Clean up the locally saved temporary file as the upload operation got failed
    throw new Error("Error uploading image");
  }
};

