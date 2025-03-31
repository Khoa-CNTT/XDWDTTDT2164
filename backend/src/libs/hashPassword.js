const bcryptjs = require("bcryptjs");

/**
 * Hash mật khẩu với bcryptjs
 * @param {string} password - Mật khẩu cần hash
 * @returns {Promise<string>} - Mật khẩu đã hash
 */
const hashPassword = async (password) => {
  if (!password) throw new Error("Mật khẩu không hợp lệ.");
  const saltRounds = 10;
  const salt = await bcryptjs.genSalt(saltRounds);
  return await bcryptjs.hash(password, salt);
};

/**
 * Kiểm tra mật khẩu người dùng nhập vào với mật khẩu đã hash trong DB
 * @param {string} inputPassword - Mật khẩu người dùng nhập
 * @param {string} hashedPassword - Mật khẩu đã hash từ DB
 * @returns {Promise<boolean>} - True nếu mật khẩu hợp lệ, ngược lại là false
 */
const verifyPassword = async (inputPassword, hashedPassword) => {
  if (!inputPassword || !hashedPassword) return false;
  return await bcryptjs.compare(inputPassword, hashedPassword);
};

module.exports = { hashPassword, verifyPassword };
