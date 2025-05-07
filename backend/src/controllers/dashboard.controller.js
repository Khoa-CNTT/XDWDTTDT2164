const { StatusCode, ResponseStatus } = require("../libs/enum");
const dashboardService = require("../services/dashboard.service");

class DashboardController {
  async getDashboardOverview(req, res) {
    try {
      const result = await dashboardService.getDashboardOverview();
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  async getPaymentOverview(req, res) {
    try {
      const result = await dashboardService.getPaymentOverview();
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
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

module.exports = new DashboardController();
