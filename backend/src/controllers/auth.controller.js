const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
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
      return resSuccess(res, null, user);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, user);
    } catch (error) {
      return resError(res, error);
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

      return resSuccess(res, null, { accessToken, refreshToken });
    } catch (error) {
      return resError(res, error);
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

      return resSuccess(res, "Đăng xuất thành công");
    } catch (error) {
      return resError(res, error);
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
        return resSuccess(
          res,
          "Refresh token không tồn tại",
          {},
          StatusCode.UNAUTHORIZED
        );
      }

      const { accessToken } = await authService.refreshToken(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return resSuccess(res, "Refresh token thành công", { accessToken });
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new AuthController();
