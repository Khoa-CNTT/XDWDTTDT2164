const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const ranksController = require("../controllers/ranks.controller");
const {
  validationCreateRank,
} = require("../validations/validateRank.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * @route POST /ranks
 * @desc Tạo cấp bậc mới
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller RanksController.createRank: Xử lý tạo cấp bậc mới
 */
router.post(
  "/",
  protectedRoute,
  authorizedRoute("admin"),
  validationCreateRank,
  handleValidationErrors,
  ranksController.createRank
);

/**
 * @route GET /ranks
 * @desc Lấy danh sách cấp bậc
 * @access Public
 * @controller RankController.getRanks: Xử lý lấy danh sách cấp bậc
 */
router.get("/", ranksController.getRanks);

/**
 * @route PUT /ranks/:id
 * @desc Cập nhật cấp bậc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller RankController.updateRank: Xử lý cập nhật cấp bậc
 */
router.put(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  ranksController.updateRank
);

/**
 * @route DELETE /salaries/:id
 * @desc Xóa cấp bậc
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @controller RankController.deleteRank: Xử lý xóa cấp bậc
 */
router.delete(
  "/:id",
  protectedRoute,
  authorizedRoute("admin"),
  ranksController.deleteRank
);

module.exports = router;
