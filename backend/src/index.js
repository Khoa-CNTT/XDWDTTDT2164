const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectionDatabase = require("./config/db.config");
const { connectRedis } = require("./config/redis.config");
const initialRoutes = require("./routes");

dotenv.config(); // Load biến môi trường từ .env

const app = express();
const port = process.env.PORT || 5000; // Cung cấp giá trị mặc định nếu PORT không được thiết lập

// Middleware xử lý JSON và form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Nếu CLIENT_URL không có, mặc định mở API cho mọi domain (không khuyến khích)
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true, // Cho phép gửi cookie qua CORS
  })
);

app.use(cookieParser());

// Kết nối cơ sở dữ liệu và Redis
connectionDatabase();
connectRedis();

// Khởi tạo routes
initialRoutes(app);

// Lắng nghe server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
