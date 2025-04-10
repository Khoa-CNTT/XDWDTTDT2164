const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
  authorizedEmployer,
} = require("../middlewares/auth.middleware");
const jobsController = require("../controllers/jobs.controller");
const { validateCreateJob } = require("../validations/validateJob.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * @route POST/jobs
 * @desc Tạo mới bài đăng công việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("employer"): Kiểm tra quyền truy cập nhà tuyển dụng
 * @middleware validateCreateJob: Validate request tạo bài đăng công việc
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller JobsController.createJob: Tạo mới bài đăng công việc
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("employer"),
  validateCreateJob,
  handleValidationErrors,
  jobsController.createJob
);

/**
 * @route POST/jobs/pay-job
 * @desc Thanh toán bài đăng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("employer"): Kiểm tra quyền truy cập nhà tuyển dụng
 * @controller JobsController.payJob: Thanh toán bài đăng công việc
 */
router.post(
  "/pay-job",
  protectedRoute,
  authorizedRoute("employer"),
  jobsController.payJob
);

/**
 * @route GET/jobs
 * @desc Lấy danh sách bài đăng công việc
 * @access Public
 * @controller JobsController.getJobs: Lấy danh sách bài đăng công việc
 */
router.get("/", jobsController.getJobs);

/**
 * @route GET jobs//jobs-employer/:id
 * @desc Lấy danh sách bài đăng công việc theo nhà tuyển dụng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("employer"): Kiểm tra quyền truy cập nhà tuyển dụng
 * @controller JobsController.getJobsForEmployer: Lấy danh sách bài đăng công việc theo nhà tuyển dụng
 */
router.get(
  "/jobs-employer/:id",
  protectedRoute,
  authorizedRoute("employer"),
  jobsController.getJobsForEmployer
);

/**
 * @route GET/jobs/:slug
 * @desc Lấy chi tiết bài đăng công việc
 * @access Public
 * @controller JobsController.getJobBySlug: Lấy chi tiết bài đăng công việc
 */
router.get("/:slug", jobsController.getJobBySlug);

/**
 * @route PUT/jobs/:id
 * @desc Cập nhật bài đăng công việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("employer"): Kiểm tra quyền truy cập nhà tuyển dụng
 * @middleware authorizedEmployer("owner", "recruiter"): Kiểm tra quyền truy cập công ty và hr
 * @controller JobsController.updateJob: Cập nhật bài đăng công việc
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner", "recruiter"),
  jobsController.updateJob
);

/**
 * @route DELETE/jobs/:id
 * @desc Xóa bài đăng công việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("employer"): Kiểm tra quyền truy cập nhà tuyển dụng
 * @middleware authorizedEmployer("owner", "recruiter"): Kiểm tra quyền truy cập công ty và hr
 * @controller JobsController.deleteJob: Xóa bài đăng công việc
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner", "recruiter"),
  jobsController.deleteJob
);

/**
 * @route PUT/jobs/:id/verify
 * @desc Kiểm duyệt bài đăng công việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("admin"): Kiểm tra quyền truy cập admin
 * @controller JobsController.verifyJob: Kiểm duyệt bài đăng công việc
 */
router.put(
  "/:id/verify",
  protectedRoute,
  authorizedRoute("admin"),
  jobsController.verifyJob
);

module.exports = router;
