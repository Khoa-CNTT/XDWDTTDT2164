const crypto = require("crypto");
const bcryptjs = require("bcryptjs");

/**
 * Tạo mã OTP ngẫu nhiên
 * @param {number} length - Độ dài của OTP (mặc định: 6, tối thiểu: 4)
 * @returns {string} - Mã OTP
 */
const generateOTP = (length = 6) => {
  if (length < 4 || length > 10) {
    throw new Error("Độ dài OTP phải từ 4 đến 10 ký tự.");
  }
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

/**
 * Mã hóa OTP bằng bcrypt trước khi lưu vào DB
 * @param {string} otp - Mã OTP cần mã hóa
 * @returns {Promise<string>} - Mã OTP đã mã hóa
 */
const hashOtp = async (otp) => {
  if (!otp) throw new Error("OTP không hợp lệ.");
  const saltRounds = 10;
  return await bcryptjs.hash(otp, saltRounds);
};

/**
 * Kiểm tra OTP người dùng nhập vào có khớp với OTP đã mã hóa không
 * @param {string} inputOtp - OTP người dùng nhập
 * @param {string} hashedOtp - OTP đã mã hóa từ database
 * @returns {Promise<boolean>} - True nếu OTP hợp lệ, ngược lại là false
 */
const verifyOtp = async (inputOtp, hashedOtp) => {
  if (!inputOtp || !hashedOtp) return false;
  return await bcryptjs.compare(inputOtp, hashedOtp);
};

module.exports = { generateOTP, hashOtp, verifyOtp };
