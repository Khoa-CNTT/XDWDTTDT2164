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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Mã OTP của bạn</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Vui lòng sử dụng mã OTP dưới đây để xác thực:
            </p>
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 5px; padding: 15px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 24px; color: #007bff;">${otp}</strong>
            </div>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Mã này sẽ hết hạn sau <strong>15 phút</strong>. Nếu bạn không yêu cầu mã OTP, vui lòng bỏ qua email này.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="color: #888888; font-size: 14px; line-height: 1.5;">
              Trân trọng,<br />
              Đội ngũ Hệ thống
            </p>
          </div>
          <div style="text-align: center; padding: 10px; color: #888888; font-size: 12px;">
            © ${new Date().getFullYear()} Hệ thống. All rights reserved.
          </div>
        </div>
      `,
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

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Đặt lại mật khẩu",
      text: `Nhấn vào liên kết sau để đặt lại mật khẩu: ${resetLink}\nLiên kết này sẽ hết hạn sau 5 phút.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Đặt lại mật khẩu</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút dưới đây để tiếp tục:
            </p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; font-weight: bold; margin: 20px 0;">
              Đặt lại mật khẩu
            </a>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Liên kết này sẽ hết hạn sau <strong>5 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="color: #888888; font-size: 14px; line-height: 1.5;">
              Trân trọng,<br />
              Đội ngũ Hệ thống
            </p>
          </div>
          <div style="text-align: center; padding: 10px; color: #888888; font-size: 12px;">
            © ${new Date().getFullYear()} Hệ thống. All rights reserved.
          </div>
        </div>
      `,
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
      text: `Mật khẩu tạm thời của bạn là: ${password}. Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333333; font-size: 24px; margin-top: 0;">Mật khẩu tạm thời của bạn</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Bạn đã được cấp một mật khẩu tạm thời để đăng nhập. Vui lòng sử dụng mật khẩu dưới đây:
            </p>
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 5px; padding: 15px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 24px; color: #007bff;">${password}</strong>
            </div>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Vui lòng đăng nhập với mật khẩu này và <strong>đổi mật khẩu ngay</strong> trong phần cài đặt tài khoản để đảm bảo an toàn.
            </p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
              Nếu bạn không yêu cầu mật khẩu tạm thời, vui lòng liên hệ với chúng tôi ngay lập tức.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="color: #888888; font-size: 14px; line-height: 1.5;">
              Trân trọng,<br />
              Đội ngũ Hệ thống
            </p>
          </div>
          <div style="text-align: center; padding: 10px; color: #888888; font-size: 12px;">
            © ${new Date().getFullYear()} Hệ thống. All rights reserved.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email mật khẩu tạm thời đã gửi đến: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi gửi email mật khẩu tạm thời:", error.message);
    return false;
  }
};

/**
 * Gửi mail thông báo khi ứng viên ứng tuyển
 * @param {string} email - Email ứng viên
 * @param {Object} jobData - bài đăng công việc
 * @returns {Promise<boolean>} - Trả về true nếu gửi thành công, false nếu thất bại
 */
const sendMailToCandidate = async (email, fullName, jobData) => {
  try {
    if (!email || !fullName || !jobData?.Employers?.companyName) {
      throw new Error("Thiếu thông tin cần thiết để gửi email");
    }

    // Calculate days left
    const expireDate = new Date(jobData.expire);
    const now = new Date();
    const daysLeft = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
    const daysLeftText = daysLeft > 0 ? `${daysLeft} ngày` : "Hết hạn";

    const mailOptions = {
      from: `"Hệ thống Tuyển dụng" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Ứng tuyển thành công",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="text-align: center; padding: 20px; background-color: #007bff; color: #ffffff; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Ứng tuyển thành công</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              Xin chào <strong>${fullName}</strong>,
            </p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
              Hồ sơ của bạn đã được gửi đến công ty <strong>${
                jobData.Employers.companyName
              }</strong> cho vị trí:
            </p>
            <h2 style="font-size: 20px; color: #007bff; margin: 20px 0 10px;">${
              jobData.jobName || "N/A"
            }</h2>
            <ul style="list-style: none; padding: 0; font-size: 14px; color: #555555; line-height: 1.8;">
              <li style="margin-bottom: 10px;">
                <strong>Địa điểm:</strong> ${jobData.address || "N/A"}
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Thời hạn ứng tuyển:</strong> ${daysLeftText}
              </li>
            </ul>
            <div style="text-align: center; margin: 20px 0;">
              <a
                href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/candidate-dashboard/candidate-apply"
                style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;"
              >
                Xem việc làm đã ứng tuyển
              </a>
            </div>
            <p style="font-size: 14px; color: #555555; line-height: 1.6; text-align: center; margin-top: 20px;">
              Cảm ơn bạn đã sử dụng Hệ thống Tuyển dụng. Chúc bạn thành công!
            </p>
          </div>
          <div style="text-align: center; padding: 10px; font-size: 12px; color: #999999;">
            <p>© 2025 Hệ thống Tuyển dụng. All rights reserved.</p>
            <p>Liên hệ: <a href="mailto:support@recruitment.com" style="color: #007bff; text-decoration: none;">support@recruitment.com</a></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for job ${jobData.jobName}`);
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi mail: ", error.message);
    return false;
  }
};

/**
 * Gửi Email thông báo bài đăng đã hết hạn
 * @param {string} to - Địa chỉ email nhận mật khẩu tạm thời
 * @param {string} job - Bài đăng
 * @returns {Promise<boolean>} - Trả về true nếu gửi thành công, false nếu thất bại
 */

const sendMailToEmployer = async (to, job) => {
  try {
    const mailOptions = {
      from: `"Hệ thống Tuyển dụng" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Bài đăng công việc đã hết hạn",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="text-align: center; padding: 20px; background-color: #dc3545; color: #ffffff; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Bài đăng đã hết hạn</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333333;">
              Xin chào, <strong>${
                job.Employers?.companyName || "Nhà tuyển dụng"
              }</strong>,
            </p>
            <p style="font-size: 16px; color: #333333;">
              Bài đăng công việc <strong>${
                job.jobName
              }</strong> đã hết hạn vào ngày <strong>${new Date(
        job.expire
      ).toLocaleDateString()}</strong>.
            </p>
            <p style="font-size: 16px; color: #333333;">
              Nếu bạn muốn tiếp tục hiển thị bài đăng này, vui lòng đăng lại bài viết và thực hiện thanh toán.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a
                href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/employer-dashboard/jobs"
                style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px;"
              >
                Đăng lại bài viết
              </a>
            </div>
          </div>
          <div style="text-align: center; padding: 10px; font-size: 12px; color: #999999;">
            <p>© 2025 Hệ thống Tuyển dụng. All rights reserved.</p>
            <p>Liên hệ: <a href="mailto:support@recruitment.com" style="color: #007bff;">support@recruitment.com</a></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Đã gửi mail thông báo hết hạn cho nhà tuyển dụng");
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi mail: ", error.message);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendTokenEmail,
  sendTemporaryPasswordEmail,
  sendMailToCandidate,
  sendMailToEmployer,
};
