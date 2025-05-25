const { resSuccess, resError } = require("../libs/response");
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
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  async checkPaymentStatusZalopay(req, res) {
    try {
      const { app_trans_id } = req.params;
      const data = await walletsService.checkPaymentStatusZalopay(app_trans_id);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Nạp tiền vào tài khoản với Vnpay
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async depositToWalletWithVnpay(req, res) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      const result = await walletsService.depositToWalleWithVnPay(amount, id);
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Callback khi thanh toán thành công Vnpay
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async callbackVnpay(req, res) {
    try {
      const result = await walletsService.callbackVnpay(req.query, res);
      if (result.status === "Thành công") {
        return res.redirect(
          "http://localhost:5173/employer-dashboard/employer-recharge"
        );
      }
    } catch (error) {
      return resError(res, error);
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

      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
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

      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy ra doanh thu theo thời gian
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getPaymentTime(req, res) {
    try {
      const { period, startDate, endDate } = req.query;
      const data = await walletsService.getPaymentTime({
        period,
        startDate,
        endDate,
      });
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lây ra biểu đồ phân bổ doanh thu
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getPaymentChart(req, res) {
    try {
      const { period } = req.query;
      const data = await walletsService.getPaymentChart(period);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy ra danh sách giao dịch
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getPayments(req, res) {
    try {
      const data = await walletsService.getPayments(req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xuất giao dịch sang file csv
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async exportPaymentToCsv(req, res) {
    try {
      const data = await walletsService.exportPaymentsToCsv();
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("danh-sach-thanh-toan.csv");
      res.send("\uFEFF" + data);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new WalletsController();
