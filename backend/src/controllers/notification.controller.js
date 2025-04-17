const { StatusCode, ResponseStatus } = require("../libs/enum");
const notificationService = require("../services/notification.service");

/**
 * Controller xử lý logic liên quan đến thông báo
 */
class NotificationController {
  /**
   * Lấy ra danh sách thông báo của admin
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách thông báo
   */
  async getNotifications(req, res) {
    try {
      const { id } = req.user;
      const result = await notificationService.getNotifications(id);
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

module.exports = new NotificationController();
