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
}

module.exports = new WalletsController();
