const { resSuccess, resError } = require("../libs/response");
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
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new NotificationController();
