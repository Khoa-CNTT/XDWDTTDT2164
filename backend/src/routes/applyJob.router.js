const express = require("express");
const { protectedRoute } = require("../middlewares/auth.middleware");
const applyJobsController = require("../controllers/applyJobs.controller");

const router = express.Router();

/**
 * @route   POST /apply-jobs/apply
 * @desc    Ứng tuyển một công việc
 * @access  Private
 * @middleware protectedRoute
 * @middleware validateRegister: Kiểm tra dữ liệu đầu vào hợp lệ
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller AuthController.registerUser: Xử lý đăng ký tài khoản
 */
router.post("/apply", protectedRoute, applyJobsController.applyJob);

module.exports = router;
