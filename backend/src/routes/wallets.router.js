const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
  authorizedEmployer,
} = require("../middlewares/auth.middleware");
const walletsController = require("../controllers/wallets.controller");
const {
  validateDepositToWallet,
} = require("../validations/validateWallet.validation");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * @route POST /deposit-zalopay
 * @desc Nạp tiền vào ví bằng zalopay
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware authorizedEmployer: Kiểm tra quyền truy cập
 * @controller walletsController.depositToWallet: xử lý nạp tiền vào ví bằng zalopay
 */
router.post(
  "/deposit-zalopay",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner"),
  validateDepositToWallet,
  handleValidationErrors,
  walletsController.depositToWallet
);

/**
 * @route GET /callback-zalopay
 * @desc Callback khi thanh toán thành công zalopay
 * @access Public
 * @controller walletsController.callbackZalopay: xử lý callback khi thanh toán thành công zalopay
 */
router.post("/callback-zalopay", walletsController.callbackZalopay);

/**
 * @route POST /deposit-momo
 * @desc Nạp tiền vào tài khoản với MoMo
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware authorizedEmployer: Kiểm tra quyền truy cập
 * @controller walletsController.depositToWalletWithMoMo: xử lý nạp tiền vào tài khoản với MoMo
 */
router.post(
  "/deposit-momo",
  protectedRoute,
  authorizedRoute("employer"),
  authorizedEmployer("owner"),
  validateDepositToWallet,
  handleValidationErrors,
  walletsController.depositToWalletWithMoMo
);

/**
 * @route POST /callback-momo
 * @desc Callback khi thanh toán thành công MoMo
 * @access Public
 * @controller walletsController.callbackMoMo: xử lý callback khi thanh toán thành công MoMo
 */
router.post("/callback-momo", walletsController.callbackMoMo);

module.exports = router;
