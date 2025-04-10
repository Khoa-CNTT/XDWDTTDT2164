const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const CategoryController = require("../controllers/categories.controller");
const { upload } = require("../config/cloudinary.config");
const {
  validateCreateCategory,
} = require("../validations/validateCategory.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const router = express.Router();

/**
 * @route   POST /categories
 * @desc    Tạo danh mục mới
 * @access  Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware upload.single("image"): Upload ảnh
 * @middleware validateCreateCategory: Validate request tạo danh mục
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller CategoryController.createCategory: Xử lý tạo danh mục mới
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  upload.single("image"),
  validateCreateCategory,
  handleValidationErrors,
  CategoryController.createCategory
);

/**
 * @route   GET /categories
 * @desc    Lấy danh sách danh mục
 * @access  Public
 * @controller CategoryController.getCategories: Xử lý lấy danh sách danh mục
 */
router.get("/", CategoryController.getCategories);

/**
 * @route   PUT /categories/:id
 * @desc    Cập nhật danh mục
 * @access  Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware upload.single("image"): Upload ảnh
 * @controller CategoryController.updateCategory: Xử lý cập nhật danh mục
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  upload.single("image"),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /categories/:id
 * @desc    Xóa danh mục
 * @access  Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller CategoryController.deleteCategory: Xử lý xóa danh mục
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  CategoryController.deleteCategory
);

module.exports = router;
