const db = require("../models");

/**
 * Service xử lý nghiệp vụ liên quan đến thông báo
 */
class NotificationsService {
  /**
   * Lấy ra danh sách thông báo
   * @param {string} adminId
   * @returns {Promise<Notification>} - Trả về danh sách thông báo
   */
  async getNotifications(adminId) {
    // Lấy ra danh sách thông báo
    const notifications = await db.Notifications.findAll({
      where: { userId: adminId },
      order: [["createdAt", "DESC"]],
    });

    return notifications;
  }

  /**
   * Lấy ra danh sách thông báo của nhà tuyển dụng
   * @param {string} userId
   * @returns {Promise<Notification>} - Trả về danh sách thông báo
   */
  async getNotificationsForEmployer(userId) {
    const notifications = await db.Notifications.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return notifications;
  }
}

module.exports = new NotificationsService();
