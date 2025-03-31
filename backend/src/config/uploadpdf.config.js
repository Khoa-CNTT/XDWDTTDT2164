const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Tạo thư mục `uploads` nếu không tồn tại
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu trữ file vào thư mục `uploads`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Lưu file vào thư mục uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Đặt tên file duy nhất
  },
});

// Bộ lọc chỉ cho phép upload file PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file PDF"), false);
  }
};

// Cấu hình Multer
const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
});

module.exports = { uploadPdf };
