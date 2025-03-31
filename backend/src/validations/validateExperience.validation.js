const { body } = require("express-validator");

/**
 * Validate request tạo mới kinh nghiệm
 */

const validateCreateExperience = [
  body("experienceName")
    .notEmpty()
    .withMessage("Tên kinh nghiệm không được để trống"),
];

module.exports = { validateCreateExperience };
