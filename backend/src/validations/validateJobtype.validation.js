const { body } = require("express-validator");

/**
 * Validation request tạo mới hình thức làm việc
 */
const validateCreateJobType = [
  body("jobTypeName")
    .notEmpty()
    .withMessage("Tên hình thức làm việc không được để trống")
    .isLength({ min: 3 })
    .withMessage("Tên hình thức làm việc phải có ít nhất 3 ký tự")
    .isString()
    .withMessage("Tên hình thức làm việc phải là chuỗi"),
];

module.exports = { validateCreateJobType };
