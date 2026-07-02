import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Api to upload file in cloudinary
export const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "fitflick/categories",
    });
    return result;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw new Error("Error while uploading image to the server!");
  }
};

// To delete uploaded image from cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export default cloudinary;
