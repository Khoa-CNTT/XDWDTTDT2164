const express = require("express");
const JobTypesController = require("../controllers/jobTypes.controller");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const {
  validateCreateJobType,
} = require("../validations/validateJobtype.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * @route POST /job-types
 * @desc Tạo mới hình thức làm việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware validateCreateJobType: Validate request tạo hình thức làm việc
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller JobTypesController.createJobType: Tạo mới hình thức làm việc
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  validateCreateJobType,
  handleValidationErrors,
  JobTypesController.createJobType
);

/**
 * @route GET /job-types
 * @desc Lấy danh sách hình thức làm việc
 * @access Public
 * @controller JobTypesController.getJobTypes: Lấy danh sách hình thức làm việc
 */
router.get("/", JobTypesController.getJobTypes);

/**
 * @route PUT /job-types/:id
 * @desc Cập nhật hình thức làm việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller JobTypesController.updateJobType: Cập nhật hình thức làm việc
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  JobTypesController.updateJobType
);

/**
 * @route DELETE /job-types/:id
 * @desc Xóa hình thức làm việc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller JobTypesController.deleteJobType: Xóa hình thức làm việc
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  JobTypesController.deleteJobType
);

module.exports = router;
