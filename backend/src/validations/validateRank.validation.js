const { body } = require("express-validator");

/**
 * Validation request tạo cấp bậc mới
 */
const validationCreateRank = [
  body("rankName").notEmpty().withMessage("Tên cấp bậc không được để trống"),
  body("rankName")
    .isLength({ min: 3 })
    .withMessage("Tên cấp bậc phải có ít nhất 3 ký tự"),
  body("rankName")
    .isLength({ max: 255 })
    .withMessage("Tên cấp bậc không được vượt quá 255 ký tự"),
];

module.exports = {
  validationCreateRank,
};
