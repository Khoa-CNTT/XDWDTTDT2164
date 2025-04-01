const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis.config");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { generateOTP, hashOtp, verifyOtp } = require("../libs/generateOtp");
const { hashPassword, verifyPassword } = require("../libs/hashPassword");
const { sendOtpEmail } = require("../libs/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt.middleware");
const db = require("../models");

/**
 * Service xử lý logic nghiệp vụ liên quan đến xác thực người dùng
 */
class AuthService {
  /**
   * Đăng ký người dùng mới.
   *
   * - Kiểm tra email hoặc số điện thoại đã tồn tại
   * - Mã hóa mật khẩu
   * - Tạo OTP và thời gian hết hạn
   * - Gửi OTP qua mail
   *
   * @param {Object} userData - Dữ liệu người dùng.
   * @returns {Promise<Object>} - Thông tin user đã lưu vào DB (ẩn mật khẩu)
   * @throws {ApiError} Nếu email hoặc số điện thoại đã tồn tại hoặc lỗi khác xảy ra
   */
  async registerUser(userData) {
    const { email, phoneNumber, fullName, password, role } = userData;

    // Kiểm tra email hoặc số điện thoại đã tồn tại chưa
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Email này đã tồn tại");
    }

    const existingPhone = await this.findByPhoneNumber(phoneNumber);

    if (existingPhone) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Số điện thoại này đã tồn tại"
      );
    }

    // Hash mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo OTP
    const otp = generateOTP(6);
    const hashedOtp = await hashOtp(otp);
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // OTP hết hạn sau 15 phút

    // Lưu thông tin người dùng vào DB
    const user = await db.Users.create({
      email,
      phoneNumber,
      fullName,
      password: hashedPassword,
      role,
      otp: hashedOtp,
      otpExpire,
    });

    // Gửi email/SMS chứa OTP cho user
    await sendOtpEmail(email, otp);

    return {
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
    };
  }

  /**
   * Xác minh OTP
   * - Kiểm tra email có tồn tại không
   * - Kiểm tra email đã xác minh chưa
   * - Kiểm tra OTP hợp lệ và còn hạn sử dụng
   * - Cập nhật trạng thái email verify thành true
   *
   * @param {Object} otpData - Dữ liệu xác minh OTP
   * @param {Promise<void>} - Thông tin user sau khi xác minh
   * @throws {ApiError} Nếu email không tồn tại, đã xác minh hoặc OTP sai/hết hạn
   */
  async verifyEmail(otpData) {
    const { otp, email } = otpData;

    // Kiểm tra user có tồn tại không
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new ApiError(StatusCode.NOT_FOUND, "Email này không tồn tại");
    }

    // Kiểm tra user đã xác minh chưa
    if (userExists.emailVerify) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Email này đã được xác minh");
    }

    // Xác minh OTP
    const compareOtp = await verifyOtp(otp, userExists.otp);
    if (!compareOtp || Date.now() > userExists.otpExpire) {
      throw new Error(StatusCode.BAD_REQUEST, "Mã OTP không đúng hoặc hết hạn");
    }

    // Cập nhật trạng thái emailVerify
    userExists.otp = null;
    userExists.otpExpire = null;
    userExists.emailVerify = true;

    await userExists.save();

    return {
      email: userExists.email,
      phoneNumber: userExists.phoneNumber,
      fullName: userExists.fullName,
    };
  }

  /**
   * Đăng nhập tài khoản
   * - Kiểm tra email có tồn tại không
   * - Kiểm tra mật khẩu có đúng không
   * - Kiểm tra email đã xác minh chưa
   * - Nếu chưa xác minh -> Gửi OTP xác minh email
   * - Tạo accessToken và refreshToken
   * - Lưu refreshToken vào database & Redis
   *
   * @param {Object} userData - Dữ liệu đăng nhập
   * @param {Promise<void>} - Trả về accessToken và refreshToken
   * @throws {ApiError} Nếu email không tồn tại, mật khẩu sai hoặc email chưa xác minh
   */
  async login(userData) {
    const { email, password } = userData;

    // Kiểm tra user có tồn tại không
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Email hoặc mật khẩu không đúng"
      );
    }

    // Xác thực mật khẩu
    const comparePassword = await verifyPassword(password, userExists.password);
    if (!comparePassword) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Email hoặc mật khẩu không đúng"
      );
    }

    // Kiểm tra email đã xác minh chưa
    if (!userExists.emailVerify) {
      const otp = generateOTP(6);
      userExists.otp = otp;
      userExists.otpExpire = new Date(Date.now() + 15 * 60 * 1000);
      await userExists.save();

      await sendOtpEmail(userExists.email, otp);

      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Email chưa được xác minh. Vui lòng kiểm tra email để xác nhận."
      );
    }

    // Tạo accessToken và refreshToken
    const accessToken = generateAccessToken(
      userExists.id,
      userExists.email,
      userExists.role,
      userExists?.EmployerRoles?.employerRole,
      userExists?.EmployerRoles?.employerId
    );
    const refreshToken = generateRefreshToken(
      userExists.id,
      userExists.email,
      userExists.role,
      userExists?.EmployerRoles?.employerRole,
      userExists?.EmployerRoles?.employerId
    );

    // Lưu refreshToken vào db và redis
    userExists.refreshToken = refreshToken;
    await userExists.save();

    await redisClient.setEx(
      `user:${userExists.id}`,
      30 * 24 * 60 * 60,
      userExists.refreshToken
    );

    return { accessToken, refreshToken };
  }

  /**
   * Đăng xuất tài khoản
   * - Xóa refreshToken khỏi DB và Redis
   * - Cập nhật refreshToken thành null trong DB
   *
   * @param {Object} userData - Dữ liệu đăng nhập
   * @param {Promise<void>} - Trả về accessToken và refreshToken
   * @throws {ApiError} Nếu email không tồn tại, mật khẩu sai hoặc email chưa xác minh
   */
  async logout(userId) {
    // Xóa refreshToken trong Redis
    await redisClient.del(`user:${userId}`);

    // Xóa refreshToken trong DB (nếu có lưu)
    await db.Users.update({ refreshToken: null }, { where: { id: userId } });

    return {
      message: "Đăng xuất thành công",
    };
  }

  /**
   * Tạo lại accessToken từ refreshToken
   * - Kiểm tra refreshToken có tồn tại trong Redis không
   * - Kiểm tra refreshToken có hợp lệ không
   * - Tạo accessToken mới
   *
   * @param {Object} refreshToken - Dữ liệu đăng nhập
   * @param {Promise<void>} - Trả về accessToken
   * @throws {ApiError} Nếu refreshToken không tồn tại hoặc hết hạn
   */
  async refreshToken(refreshToken) {
    try {
      // Giải mã refreshToken
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      // Lấy refreshToken từ trong redis theo userId
      const storedToken = await redisClient.get(`user:${decoded.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        const user = await db.Users.findOne({
          where: { id: decoded.id, refreshToken },
        });
        if (!user) {
          throw new ApiError(
            StatusCode.UNAUTHORIZED,
            "Refresh token không hợp lệ"
          );
        }
      }

      // Tạo accessToken mới
      const accessToken = generateAccessToken(
        decoded.id,
        decoded.email,
        decoded.role,
        userExists.EmployerRoles.employerRole,
        userExists.EmployerRoles.employerId
      );

      return { accessToken };
    } catch (error) {
      throw new ApiError(StatusCode.UNAUTHORIZED, "Refresh token không hợp lệ");
    }
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   * @param {string} email - Email đầu vào
   * @returns {Promise<Object|null>} - Trả về user nếu tồn tại, ngược lại null
   */
  async findByEmail(email) {
    return await db.Users.findOne({
      where: { email },
      include: [{ model: db.EmployerUsers, as: "EmployerUsers" }],
    });
  }

  /**
   * Kiểm tra phoneNumber đã tồn tại chưa
   * @param {string} phoneNumber - Số điện thoại đầu vào
   * @returns {Promise<Object|null>} - Trả về user nếu tồn tại, ngược lại null
   */
  async findByPhoneNumber(phoneNumber) {
    return await db.Users.findOne({ where: { phoneNumber } });
  }
}

module.exports = new AuthService();
