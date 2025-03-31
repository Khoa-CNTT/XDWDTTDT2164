const { body } = require("express-validator");

/**
 * Validation request tạo skill mới
 */
const validateCreateSkill = [
  body("skillName").notEmpty().withMessage("Tên skill không được để trống"),
  body("categoryId").notEmpty().withMessage("Danh mục không được để trống"),
];

module.exports = {
  validateCreateSkill,
};
