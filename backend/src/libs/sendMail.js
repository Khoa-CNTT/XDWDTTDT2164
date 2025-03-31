const nodemailer = require("nodemailer");

// Cấu hình transporter với SMTP (có thể dùng Gmail, Mailgun, SendGrid...)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true cho SSL, false cho TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi Email OTP
 * @param {string} to - Địa chỉ email nhận OTP
 * @param {string} otp - Mã OTP để gửi
 * @returns {Promise<boolean>} - Trả về true nếu gửi thành công, false nếu thất bại
 */
const sendOtpEmail = async (to, otp) => {
  try {
    if (!to || !otp) throw new Error("Email hoặc OTP không hợp lệ.");

    const mailOptions = {
      from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Mã OTP của bạn",
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 15 phút.`,
      html: `<p>Mã OTP của bạn là: <strong>${otp}</strong>. Mã này sẽ hết hạn sau 15 phút.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP đã gửi đến: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi gửi email OTP:", error.message);
    return false;
  }
};

/**
 * Gửi Email token
 * @param {string} to - Địa chỉ email nhận token
 * @param {string} token - Token để gửi
 * @returns {Promise<boolean>} - Trả về true nếu gửi thành công, false nếu thất bại
 */
const sendTokenEmail = async (to, token) => {
  try {
    if (!to || !token) throw new Error("Email hoặc token không hợp lệ.");

    const mailOptions = {
      from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Token của bạn",
      text: `Token của bạn là: ${token}. Token này sẽ hết hạn sau 5 phút.`,
      html: `<p>Token của bạn là: <strong>${token}</strong>. Token này sẽ hết hạn sau 5 phút.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email token đã gửi đến: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi gửi email token:", error.message);
    return false;
  }
};

/**
 * Gửi Email tạo mật khẩu tạm thời
 * @param {string} to - Địa chỉ email nhận mật khẩu tạm thời
 * @param {string} password - Mật khẩu tạm thời để gửi
 * @returns {Promise<boolean>} - Trả về true nếu gửi thành công, false nếu thất bại
 */
const sendTemporaryPasswordEmail = async (to, password) => {
  try {
    if (!to || !password) throw new Error("Email hoặc mật khẩu không hợp lệ.");

    const mailOptions = {
      from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Mật khẩu tạm thời của bạn",
      text: `Mật khẩu tạm thời của bạn là: ${password}.`,
      html: `<p>Mật khẩu tạm thời của bạn là: <strong>${password}</strong>.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email mật khẩu tạm thời đã gửi đến: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi gửi email mật khẩu tạm thời:", error.message);
    return false;
  }
};

module.exports = { sendOtpEmail, sendTokenEmail, sendTemporaryPasswordEmail };
