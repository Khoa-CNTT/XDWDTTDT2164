const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const {
  protectedRoute,
  authorizedRoute,
  authorizedEmployer,
} = require("../middlewares/auth.middleware");
const {
  validateChangePassword,
  validateCreateEmployerProfile,
  validateAddEmployeeToEmployer,
  validateCreateCandidateProfile,
} = require("../validations/validateUser.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const { upload } = require("../config/cloudinary.config");
const { uploadPdf } = require("../config/uploadpdf.config");

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
router.post(
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
router.get(
  "/employer/:employerId/approve",
  protectedRoute,
  authorizedRoute("admin"),
  userController.approveEmployer
);

/**
 * @route GET /api/user/employer/:companySlug
 * @desc Lấy thông tin nhà tuyển dụng
 * @access Public
 * @controller UserController.getEmployerProfile
 */
router.get("/employer/:companySlug", userController.getEmployerProfile);

/**
 * @route GET /api/user/employers
 * @desc Lấy danh sách nhà tuyển dụng
 * @access Public
 * @controller UserController.getEmployerList
 */
router.get("/employers", userController.getEmployerList);

/**
 * @route POST /api/user/employer/:employerId/add-employee
 * @desc Thêm nhân viên vào công ty
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("employer"): Kiểm tra xem user có phải là nhà tuyển dụng không
 * @middleware validateAddEmployeeToEmployer: Validate request thêm nhân viên vào công ty
 * @middleware handleValidationErrors: Xử lý lỗi validation
 * @controller UserController.addEmployeeToEmployer
 */
router.post(
  "/employer/:employerId/add-employee",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner"),
  validateAddEmployeeToEmployer,
  handleValidationErrors,
  userController.addEmployeeToEmployer
);

/**
 * @route GET /api/user/employer/:employerId/employees
 * @desc Lấy danh sách nhân viên của nhà tuyển dụng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xem user có đăng nhập không
 * @middleware authorizedRoute("employer"): Kiểm tra xem user có phải là nhà tuyển dụng không
 * @controller UserController.getEmployerEmployees
 */
router.get(
  "/employer/:employerId/employees",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner"),
  userController.getEmployerEmployees
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

module.exports = router;
