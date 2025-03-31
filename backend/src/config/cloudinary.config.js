const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "KLTN", // Thư mục lưu ảnh trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Định dạng ảnh cho phép
    public_id: (req, file) => {
      console.log("Uploading file:", file.originalname);
      return file.originalname.split(".")[0];
    }, // Đặt tên file
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
