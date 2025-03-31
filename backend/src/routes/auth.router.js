const express = require("express");
const {
  validateRegister,
  validateLogin,
} = require("../validations/validateAuth.validation");
const AuthController = require("../controllers/auth.controller");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const { protectedRoute } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Đăng ký tài khoản người dùng mới
 * @access  Public
 * @middleware validateRegister: Kiểm tra dữ liệu đầu vào hợp lệ
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller AuthController.registerUser: Xử lý đăng ký tài khoản
 */
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  AuthController.registerUser
);

/**
 * @route   POST /auth/verify-otp
 * @desc    Xác minh OTP để kích hoạt tài khoản
 * @access  Public
 * @controller AuthController.verifyEmail: Xử lý xác minh OTP
 */
router.post("/verify-otp", AuthController.verifyEmail);

/**
 * @route   POST /auth/login
 * @desc    Đăng nhập vào hệ thống
 * @access  Public
 * @middleware validateLogin: Kiểm tra dữ liệu đầu vào hợp lệ
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller AuthController.loginUser: Xử lý đăng nhập
 */
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  AuthController.loginUser
);

/**
 * @route   POST /auth/logout
 * @desc    Đăng xuất tài khoản
 * @access  Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller AuthController.logoutUser: Xử lý đăng xuất
 */
router.post("/logout", protectedRoute, AuthController.logoutUser);

/**
 * @route   POST /auth/refresh-token
 * @desc    Tạo lại accessToken từ refreshToken
 * @access  Public
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @controller AuthController.refreshToken: Xử lý tạo lại accessToken
 */
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
