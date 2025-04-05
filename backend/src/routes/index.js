const {
  notFound,
  errorHandler,
} = require("../middlewares/errorHandler.middleware");
const authRoutes = require("./auth.router");
const userRoutes = require("./users.router");
const categoryRoutes = require("./categories.router");
const skillRoutes = require("./skills.router");
const salaryRoutes = require("./salaries.router");
const experienceRoutes = require("./experiences.router");
const jobTypeRoutes = require("./jobTypes.router");
const jobsRoutes = require("./jobs.router");
const saveJobsRoutes = require("./saveJobs.router");
const rankRoutes = require("./ranks.router");
const walletRoutes = require("./wallets.router");

/**
 * Khởi tạo các tuyến đường chính cho ứng dụng
 * @param {Object} app - Ứng dụng Express
 */
const initialRoutes = (app) => {
  // Định tuyến cho xác thực người dùng
  app.use("/api/auth", authRoutes);

  // Định tuyến cho user
  app.use("/api/users", userRoutes);

  // Định tuyến cho danh mục
  app.use("/api/categories", categoryRoutes);

  // Định tuyến cho kỹ năng
  app.use("/api/skills", skillRoutes);

  // Định tuyến cho mức lương
  app.use("/api/salaries", salaryRoutes);

  // Định tuyến cho kinh nghiệm
  app.use("/api/experiences", experienceRoutes);

  // Định tuyến cho hình thức làm việc
  app.use("/api/job-types", jobTypeRoutes);

  // Định tuyến cho bài đăng công việc
  app.use("/api/jobs", jobsRoutes);

  // Định tuyến cho lưu job vào danh sách
  app.use("/api/save-job", saveJobsRoutes);

  //Định tuyến cho cấp bậc
  app.use("/api/ranks", rankRoutes);

  // Định tuyến cho ví
  app.use("/api/wallets", walletRoutes);

  // Middleware xử lý khi không tìm thấy route
  app.use(notFound);

  // Middleware xử lý lỗi chung
  app.use(errorHandler);
};

module.exports = initialRoutes;
