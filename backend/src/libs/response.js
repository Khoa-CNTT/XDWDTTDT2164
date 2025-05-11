const { StatusCode, ResponseStatus } = require("./enum");

const resSuccess = (res, message, data = {}, statusCode = StatusCode.OK) => {
  const response = {
    statusCode,
    status: ResponseStatus.SUCCESS,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

const resError = (res, error) => {
  const statusCode = error.statusCode || StatusCode.SERVER_ERROR;
  return res.status(statusCode).json({
    statusCode,
    status: ResponseStatus.ERROR,
    message: error.message || "Lỗi hệ thống",
  });
};

module.exports = { resSuccess, resError };
