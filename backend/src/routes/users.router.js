const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const {
  validateChangePassword,
  validateCreateEmployerProfile,
  validateCreateCandidateProfile,
} = require("../validations/validateUser.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const { upload } = require("../config/cloudinary.config");
const { uploadPdf } = require("../config/uploadpdf.config");

/**
 * @route GET /api/user/info
 * @desc Lấy ra thông tin cá nhân
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @access Private
 * @controller UserController.getInfo
 */
router.get("/info", protectedRoute, userController.getInfo);

/**
 * @route POST /api/user/forgot-password
 * @desc Quên mật khẩu
 * @access Public
 * @controller UserController.forgotPassword
 */
router.post("/forgot-password", userController.forgotPassword);

/**
 * @route POST /api/user/reset-password
 * @desc Đặt lại mật khẩu
 * @access Public
 * @controller UserController.resetPassword
 */
router.post("/reset-password", userController.resetPassword);

/**
 * @route POST /api/user/change-password
 * @desc Thay đổi mật khẩu
 * @access Private
 * @middleware validateChangePassword: Validate request thay đổi mật khẩu
 * @middleware handleValidationErrors: Xử lý lỗi validation
 * @controller UserController.changePassword
 */
router.put(
  "/change-password",
  protectedRoute,
  validateChangePassword,
  handleValidationErrors,
  userController.changePassword
);

/**
 * @route POST /api/user/create-employer-profile
 * @desc Tạo mới thông tin nhà tuyển dụng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware upload.single("avatar"): Upload ảnh đại diện
 * @middleware authorizedRoute("employer"): Kiểm tra xem user có phải là nhà tuyển dụng không
 * @middleware validateCreateEmployerProfile: Validate request tạo mới thông tin nhà tuyển dụng
 * @middleware handleValidationErrors: Xử lý lỗi validation
 * @controller UserController.createEmployerProfile
 */
router.post(
  "/create-employer-profile",
  protectedRoute,
  authorizedRoute("employer"),
  upload.single("avatar"),
  validateCreateEmployerProfile,
  handleValidationErrors,
  userController.createEmployerProfile
);

/**
 * @route GET /api/user/employer/:employerId/approve
 * @desc Duyệt nhà tuyển dụng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("admin"): Kiểm tra xem user có phải là admin không
 * @controller UserController.approveEmployer
 */
router.put(
  "/employer/:employerId/approve",
  protectedRoute,
  authorizedRoute("admin"),
  userController.approveEmployer
);

/**
 * @route GET /api/user/employer/:employerId
 * @desc Lấy thông tin nhà tuyển dụng
 * @access Public
 * @controller UserController.getEmployerProfile
 */
router.get(
  "/employer/:employerId",
  protectedRoute,
  authorizedRoute("employer"),
  userController.getEmployerProfile
);

/**
 * @route GET /api/user/employer/:slug
 * @desc Lấy thông tin nhà tuyển dụng
 * @access Public
 * @controller UserController.getEmployerProfile
 */
router.get("/employer-detail/:slug", userController.getEmployerDetail);

/**
 * @route GET /api/user/employers
 * @desc Lấy danh sách nhà tuyển dụng
 * @access Public
 * @controller UserController.getEmployerList
 */
router.get("/employers", userController.getEmployerList);

/**
 * @route GET /api/user/employers-admin
 * @desc Lấy danh sách nhà tuyển dụng cho admin
 * @access Private
 * @controller UserController.getEmployerListForAdmin
 */
router.get(
  "/employers-admin",
  protectedRoute,
  authorizedRoute("admin"),
  userController.getEmployerListForAdmin
);

/**
 * @route GET /api/user/candidates
 * @desc Lấy danh sách ứng viên
 * @access Private
 * @controller UserController.getCandidates
 */
router.get(
  "/candidates",
  protectedRoute,
  authorizedRoute("admin"),
  userController.getCandidates
);

/**
 * @route POST /api/user/create-candidate-profile
 * @desc Tạo mới thông tin ứng viên
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware upload.single("cv"): Upload file CV
 * @middleware authorizedRoute("candidate"): Kiểm tra xem user có phải là ứng viên không
 * @controller UserController.createCandidateProfile
 */
router.post(
  "/create-candidate-profile",
  protectedRoute,
  authorizedRoute("candidate"),
  uploadPdf.single("cv"),
  validateCreateCandidateProfile,
  handleValidationErrors,
  userController.createCandidateProfile
);

/**
 * @route GET /api/users/get-users-admin
 * @desc Lấy danh sách người dùng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("admin"): Kiểm tra xem user có phải là admin không
 * @controller UserController.getUsers
 */
router.get(
  "/get-users-admin",
  protectedRoute,
  authorizedRoute("admin"),
  userController.getUsers
);

/**
 * @route GET /api/users/get-users-admin
 * @desc Lấy danh sách người dùng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("admin"): Kiểm tra xem user có phải là admin không
 * @controller UserController.getUsers
 */
router.put(
  "/update-user-admin/:userId",
  protectedRoute,
  authorizedRoute("admin"),
  userController.updateUserByAdmin
);

/**
 * @route PUT /api/users/employer-update-profile/:id
 * @desc Cập nhật hồ sơ công ty
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("employer"): Kiểm tra xem user có phải là employer không
 * @controller UserController.updateEmployerProfile
 */
router.put(
  "/employer-update-profile/:id",
  protectedRoute,
  authorizedRoute("employer"),
  upload.single("avatar"),
  userController.updateEmployerProfile
);

/**
 * @route PUT /api/users/candidate-update-profile/:id
 * @desc Cập nhận hồ sơ ứng viên
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("candidate"): Kiểm tra xem user có phải là candidate không
 * @controller UserController.updateCandidateProfile
 */
router.put(
  "/candidate-update-profile/:id",
  protectedRoute,
  authorizedRoute("candidate"),
  uploadPdf.single("cvUrl"),
  userController.updateCandidateProfile
);

/**
 * @route PUT /api/users/block-user/:id
 * @desc Cập nhật trạng thái khóa người dùng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("admin"): Kiểm tra xem user có phải là admin không
 * @controller UserController.setBlockStatus
 */
router.put(
  "/block-user/:id",
  protectedRoute,
  authorizedRoute("admin"),
  userController.setBlockStatus
);

module.exports = router;
