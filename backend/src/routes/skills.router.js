const express = require("express");
const {
  authorizedRoute,
  protectedRoute,
} = require("../middlewares/auth.middleware");
const skillsController = require("../controllers/skills.controller");
const {
  validateCreateSkill,
} = require("../validations/validateSkill.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * @route POST/skills
 * @desc Tạo skill mới
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SkillsController.createSkill: Xử lý tạo skill mới
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  validateCreateSkill,
  handleValidationErrors,
  skillsController.createSkill
);

/**
 * @route GET/skills/
 * @desc Lấy danh sách skill
 * @access Public
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller SkillsController.getSkills: Xử lý lấy danh sách skill theo categoryId
 */
router.get(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  skillsController.getSkills
);

/**
 * @route GET/skills/:categoryId
 * @desc Lấy danh sách skill theo categoryId
 * @access Public
 * @controller SkillsController.getSkills: Xử lý lấy danh sách skill theo categoryId
 */
router.get("/:categoryId", skillsController.getSkillsByCategory);

/**
 * @route PUT/skills/:id
 * @desc Cập nhật skill
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểmt tra quyền truy cập
 * @controller SkillsController.updateSkill: Xử lý cập nhật skill
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  skillsController.updateSkill
);

/**
 * @route DELETE/skills/:id
 * @desc Xóa skill
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểmt tra quyền truy cập
 * @controller SkillsController.deleteSkill: Xử lý xóa skill
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  skillsController.deleteSkill
);

module.exports = router;
