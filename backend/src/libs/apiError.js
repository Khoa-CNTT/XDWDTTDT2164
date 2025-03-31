class ApiError extends Error {
  constructor(statusCode, message, errorCode = "UNKNOWN_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // Giữ lại stack trace (chỉ áp dụng với Error)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
