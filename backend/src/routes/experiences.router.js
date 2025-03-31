const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const {
  validateCreateExperience,
} = require("../validations/validateExperience.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");
const experiencesController = require("../controllers/experiences.controller");
const router = express.Router();

/**
 * @route POST /experiences
 * @desc Tạo mới kinh nghiệm
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware validateCreateExperience: Validate request tạo kinh nghiệm
 * @middleware handleValidationErrors: Xử lý lỗi validation nếu có
 * @controller ExperiencesController.createExperience: Xử lý tạo mới kinh nghiệm
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  validateCreateExperience,
  handleValidationErrors,
  experiencesController.createExperience
);

/**
 * @route GET /experiences
 * @desc Lấy danh sách kinh nghiệm
 * @access Public
 * @controller ExperiencesController.getExperiences: Xử lý lấy danh sách kinh nghiệm
 */
router.get("/", experiencesController.getExperiences);

/**
 * @route PUT /experiences/:id
 * @desc Cập nhật kinh nghiệm
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller ExperiencesController.updateExperience: Xử lý cập nhật kinh nghiệm
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  experiencesController.updateExperience
);

/**
 * @route DELETE /experiences/:id
 * @desc Xóa kinh nghiệm
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller ExperiencesController.deleteExperience: Xử lý xóa kinh nghiệm
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  experiencesController.deleteExperience
);

module.exports = router;
