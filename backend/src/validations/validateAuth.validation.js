const { body } = require("express-validator");

/**
 * Validation request đăng ký
 */
const validateRegister = [
  body("fullName").notEmpty().withMessage("Tên không được để trống"),

  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("phoneNumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("Số điện thoại phải có 10 chữ số")
    .isNumeric()
    .withMessage("Số điện thoại chỉ chứa chữ số"),

  body("role").notEmpty().withMessage("Vai trò không được để trống"),
];

/**
 * Validation request đăng nhập
 */
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),

  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

module.exports = {
  validateRegister,
  validateLogin,
};
