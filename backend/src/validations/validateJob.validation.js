const { body } = require("express-validator");

/**
 * Validate request tạo bài đăng công việc
 */

const validateCreateJob = [
  body("jobName")
    .notEmpty()
    .withMessage("Tên bài đăng công việc không được để trống"),
  body("description")
    .notEmpty()
    .withMessage("Mô tả bài đăng công việc không được để trống"),
  body("categoryId")
    .notEmpty()
    .withMessage("Danh mục bài đăng công việc không được để trống"),
  body("jobTypeId")
    .notEmpty()
    .withMessage("Hình thức làm việc không được để trống"),
  body("salaryId").notEmpty().withMessage("Mức lương không được để trống"),
  body("experienceId")
    .notEmpty()
    .withMessage("Kinh nghiệm không được để trống"),
  body("employerId").notEmpty().withMessage("Công ty không được để trống"),
  body("numberOfRecruits")
    .notEmpty()
    .withMessage("Số lượng tuyển dụng không được để trống"),
  body("rank").notEmpty().withMessage("Cấp bậc không được để trống"),
  body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
];

module.exports = { validateCreateJob };
