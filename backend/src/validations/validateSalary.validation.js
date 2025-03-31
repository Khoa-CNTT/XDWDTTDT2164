const { body } = require("express-validator");

/**
 * Validation request tạo mức lương mới
 */
const validationCreateSalary = [
  body("salaryName")
    .notEmpty()
    .withMessage("Tên mức lương không được để trống"),
  body("salaryName")
    .isLength({ min: 3 })
    .withMessage("Tên mức lương phải có ít nhất 3 ký tự"),
  body("salaryName")
    .isLength({ max: 255 })
    .withMessage("Tên mức lương không được vượt quá 255 ký tự"),
];

module.exports = {
  validationCreateSalary,
};
