const { StatusCode, ResponseStatus } = require("../libs/enum");
const authService = require("../services/auth.service");

/**
 * Controller xử lý logic xác thực người dùng
 */
class AuthController {
  /**
   * Đăng ký người dùng mới
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async registerUser(req, res) {
    try {
      const user = await authService.registerUser(req.body);
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Đăng ký thành công, hãy kiểm tra email",
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Xác minh Email
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async verifyEmail(req, res) {
    try {
      const user = await authService.verifyEmail(req.body);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xác minh email thành công.",
        data: user,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Đăng nhập tài khoản
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async loginUser(req, res) {
    try {
      const { accessToken, refreshToken } = await authService.login(req.body);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Đăng nhập thành công.",
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Đăng xuất tài khoản
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async logoutUser(req, res) {
    try {
      const { id } = req.user;

      await authService.logout(id);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Tạo lại accessToken từ refreshToken
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          statusCode: StatusCode.UNAUTHORIZED,
          status: ResponseStatus.ERROR,
          message: "Refresh token không tồn tại",
        });
      }

      const { accessToken } = await authService.refreshToken(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Refresh token thành công",
        data: { accessToken },
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
      });
    }
  }
}

module.exports = new AuthController();
