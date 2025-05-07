const jwt = require("jsonwebtoken");
const { ResponseStatus } = require("../libs/enum");

/**
 * Middleware kiểm tra xác thực người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Response object
 */
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        statusCode: 401,
        status: ResponseStatus.ERROR,
        messsage: "Unauthorized",
      });
    }

    const tokenString = token.split(" ")[1];
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        statusCode: 401,
        status: ResponseStatus.ERROR,
        message: "Unauthorized",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

/**
 * Middleware kiểm tra quyền truy cập
 * @param {...string} roles - Danh sách các vai trò được phép truy cập
 * @returns {Function} - Middleware function
 */
const authorizedRoute = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        status: ResponseStatus.ERROR,
        message: "Bạn không có quyền truy cập vào trang này",
      });
    }
    next();
  };
};

module.exports = { protectedRoute, authorizedRoute };
