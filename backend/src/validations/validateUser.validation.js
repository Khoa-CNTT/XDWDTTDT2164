const { body } = require("express-validator");

/**
 * Validate request thay đổi mật khẩu
 */
const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Mật khẩu cũ không được để trống"),
  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu tối đa phải 6 ký tự"),
];

/**
 * Validate request tạo mới thông tin nhà tuyển dụng
 */
const validateCreateEmployerProfile = [
  body("companyName").notEmpty().withMessage("Tên công ty không được để trống"),
  body("companyAddress")
    .notEmpty()
    .withMessage("Địa chỉ công ty không được để trống"),
  body("companyWebsite")
    .notEmpty()
    .withMessage("Website công ty không được để trống"),
  body("companyDescription")
    .notEmpty()
    .withMessage("Mô tả công ty không được để trống"),
  body("companySize")
    .notEmpty()
    .withMessage("Số lượng nhân viên không được để trống"),
  body("companyTaxCode")
    .notEmpty()
    .withMessage("Mã số thuế không được để trống"),
];

/**
 * Validate request thêm nhân viên vào công ty
 */
const validateAddEmployeeToEmployer = [
  body("email").notEmpty().withMessage("Email không được để trống"),
  body("fullName").notEmpty().withMessage("Tên không được để trống"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Số điện thoại không được để trống"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
];

/**
 * Validate request tạo mới thông tin ứng viên
 */
const validateCreateCandidateProfile = [
  body("gender").notEmpty().withMessage("Giới tính không được để trống"),
  body("dateOfBirth").notEmpty().withMessage("Ngày sinh không được để trống"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
  body("workExperience")
    .notEmpty()
    .withMessage("Kinh nghiệm làm việc không được để trống"),
  body("salary").notEmpty().withMessage("Mức lương không được để trống"),
  body("skillIds").notEmpty().withMessage("Skill không được để trống"),
];

module.exports = {
  validateChangePassword,
  validateCreateEmployerProfile,
  validateAddEmployeeToEmployer,
  validateCreateCandidateProfile,
};
