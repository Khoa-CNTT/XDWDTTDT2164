const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const {
  validationCreateSalary,
} = require("../validations/validateSalary.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const salariesController = require("../controllers/salaries.controller");

const router = express.Router();

/**
 * @route POST /salaries
 * @desc Tạo mức lương mới
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SalariesController.createSalary: Xử lý tạo mức lương mới
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  validationCreateSalary,
  handleValidationErrors,
  salariesController.createSalary
);

/**
 * @route GET /salaries
 * @desc Lấy danh sách mức lương
 * @access Public
 * @controller SalariesController.getSalaries: Xử lý lấy danh sách mức lương
 */
router.get("/", salariesController.getSalaries);

/**
 * @route PUT /salaries/:id
 * @desc Cập nhật mức lương
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SalariesController.updateSalary: Xử lý cập nhật mức lương
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  salariesController.updateSalary
);

/**
 * @route DELETE /salaries/:id
 * @desc Xóa mức lương
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SalariesController.deleteSalary: Xử lý xóa mức lương
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  salariesController.deleteSalary
);

module.exports = router;
