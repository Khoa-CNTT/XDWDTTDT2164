const { body } = require("express-validator");

/**
 * Validation request tạo danh mục
 */
const validateCreateCategory = [
  body("categoryName")
    .notEmpty()
    .withMessage("Tên danh mục không được để trống"),
];

module.exports = { validateCreateCategory };
