const { validationResult } = require("express-validator");

/**
 * Middleware kiểm tra lỗi validation từ express-validator
 * @param {Object} req - Đối tượng request từ client
 * @param {Object} res - Đối tượng response để gửi phản hồi
 * @param {Function} next - Hàm next middleware
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Dữ liệu không hợp lệ",
      data: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = { handleValidationErrors };
