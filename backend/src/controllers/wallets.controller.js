const { StatusCode, ResponseStatus } = require("../libs/enum");
const walletsService = require("../services/wallets.service");

/**
 * Controller xử lý logic liên quan đến wallet
 */
class WalletsController {
  /**
   * Nạp tiền vào tài khoản
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async depositToWallet(req, res) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      const result = await walletsService.depositToWallet(amount, id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.OK,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Callback khi thanh toán thành công zalopay
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async callbackZalopay(req, res) {
    try {
      const result = await walletsService.callbackZalopay(req.body);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.OK,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Nạp tiền vào tài khoản với MoMo
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async depositToWalletWithMoMo(req, res) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      const result = await walletsService.depositToWalletWithMoMo(amount, id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.OK,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Callback khi thanh toán thành công MoMo
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async callbackMoMo(req, res) {
    try {
      const result = await walletsService.callbackMoMo(req.body);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.OK,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Lấy ra ví người dùng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getWallet(req, res) {
    try {
      const { id } = req.user;
      const data = await walletsService.getWallet(id);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.StatusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Lấy ra lịch sử nạp tiền
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getHistoryDeposit(req, res) {
    try {
      const { id } = req.user;
      const data = await walletsService.getHistoryDeposit(id, req.query);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
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
   * Lấy ra lịch sử thanh toán
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getHistoryPayment(req, res) {
    try {
      const { id } = req.user;
      const data = await walletsService.getHistoryPayment(id, req.query);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }
}

module.exports = new WalletsController();
