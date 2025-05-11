const { resSuccess, resError } = require("../libs/response");
const dashboardService = require("../services/dashboard.service");

class DashboardController {
  async getDashboardOverview(req, res) {
    try {
      const result = await dashboardService.getDashboardOverview();
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  async getPaymentOverview(req, res) {
    try {
      const result = await dashboardService.getPaymentOverview();
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new DashboardController();
