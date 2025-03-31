const {
  StatusCode,
  Message,
  ErrorCode,
  ResponseStatus,
} = require("../libs/enum");

/**
 * Middleware xử lý lỗi chung
 * @param {Object} error - Đối tượng lỗi
 * @param {Object} req - Đối tượng request từ client
 * @param {Object} res - Đối tượng response để gửi phản hồi
 * @param {Function} next - Hàm next middleware
 */
const errorHandler = (error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, error.stack);

  // Lấy status code từ error nếu có, nếu không mặc định là lỗi server (500)
  const statusCode = error.statusCode || StatusCode.SERVER_ERROR;

  // Lấy message từ error nếu có, nếu không thì dùng message mặc định
  const message = error.message || Message.SERVER_ERROR;

  return res.status(statusCode).json({
    statusCode: statusCode,
    status: ResponseStatus.ERROR,
    message,
  });
};

/**
 * Middleware xử lý khi route không được tìm thấy
 * @param {Object} req - Đối tượng request từ client
 * @param {Object} res - Đối tượng response để gửi phản hồi
 * @param {Function} next - Hàm next middleware
 */
const notFound = (req, res, next) => {
  next({
    statusCode: StatusCode.NOT_FOUND,
    message: `Route ${req.method} ${req.originalUrl} không tìm thấy`,
    errorCode: ErrorCode.NOT_FOUND,
  });
};

module.exports = { errorHandler, notFound };
