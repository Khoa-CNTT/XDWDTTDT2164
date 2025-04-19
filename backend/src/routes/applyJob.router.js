const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
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

/**
 * @route GET /applay-jobs/get-candidates/:jobId
 * @desc Lấy ra danh sách ứng tuyển
 * @access Private
 * @middleware protectedRoute
 * @middleware authorizeRoute
 * @controller AuthController.registerUser: Xử lý đăng ký tài khoản
 */
router.get(
  "/get-candidates/:jodId",
  protectedRoute,
  authorizedRoute("employer"),
  applyJobsController.getCandidates
);

/**
 * @route GET /applay-jobs/get-candidate-id/:jobId/:candidateId
 * @desc Lấy ra danh sách ứng tuyển
 * @access Private
 * @middleware protectedRoute
 * @middleware authorizeRoute
 * @controller AuthController.registerUser: Xử lý đăng ký tài khoản
 */
router.get(
  "/get-candidate/:jodId/:candidateId",
  protectedRoute,
  authorizedRoute("employer"),
  applyJobsController.getCandidates
);

module.exports = router;
