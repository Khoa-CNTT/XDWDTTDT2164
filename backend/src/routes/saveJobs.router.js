const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const saveJobsController = require("../controllers/saveJobs.controller");

const router = express.Router();

/**
 * @route POST /save-job
 * @desc Lưu job vào danh sách
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SaveJobsController.saveJob: xử lý lưu job vào danh sách
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("candidate"),
  saveJobsController.saveJob
);

/**
 * @route GET /
 * @desc Lấy ra danh sách Jobs đã lưu
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SaveJobsController.getJobs: xử lý lấy ra danh sách job đã lưu
 */
router.get(
  "/",
  protectedRoute,
  authorizedRoute("candidate", saveJobsController.getJobs)
);

/**
 * @route DELETE /:jobId
 * @desc Xóa một job trong danh sách
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SaveJobsController.delJob: xử lý xóa một job trong danh sách
 */
router.delete(
  "/:jobId",
  protectedRoute,
  authorizedRoute("candidate", saveJobsController.delJob)
);

module.exports = router;
