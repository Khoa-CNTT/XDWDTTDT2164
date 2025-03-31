const jwt = require("jsonwebtoken");

/**
 * Hàm tạo mới accessToken
 * @param {string} id - ID của người dùng
 * @param {string} email - Email của người dùng
 * @param {string} role - Vai trò của người dùng
 * @returns {string} - Access token đã được ký
 */
const generateAccessToken = (id, email, role, employerRole, employerId) => {
  return jwt.sign(
    { id, email, role, employerRole, employerId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "1d",
    }
  );
};

/**
 * Hàm tạo mới refreshToken
 * @param {string} id - ID của người dùng
 * @param {string} email - Email của người dùng
 * @param {string} role - Vai trò của người dùng
 * @returns {string} - Refresh token đã được ký
 */
const generateRefreshToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
