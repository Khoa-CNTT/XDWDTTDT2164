const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

/**
 * @route GET /notifications/admin
 * @desc Lấy ra danh sách thông báo
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller notificationController.getNotifications: Lấy ra danh sách thông báo
 */
router.get(
  "/admin",
  protectedRoute,
  authorizedRoute("admin"),
  notificationController.getNotifications
);

module.exports = router;
