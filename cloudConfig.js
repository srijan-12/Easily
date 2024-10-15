const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Define storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderPath;
    if (file.fieldname === "profileUrl") {
      folderPath = "profilePics";
    } else if (file.fieldname === "resumeLink") {
      folderPath = "resumes";
    }

    return {
      folder: folderPath,
      allowedFormats: ["jpeg","png","jpg","pdf"],
      public_id: Date.now() + '-' + file.originalname,
    };
  },
});

// Initialize Multer with Cloudinary storage
const uploadFiles = multer({ storage: storage });

module.exports = uploadFiles;
