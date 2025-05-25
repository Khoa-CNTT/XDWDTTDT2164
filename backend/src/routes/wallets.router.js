const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
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

router.get(
  "/check-status-zalopay/:app_trans_id",
  walletsController.checkPaymentStatusZalopay
);

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

router.post(
  "/deposit-vnpay",
  protectedRoute,
  authorizedRoute("employer"),
  walletsController.depositToWalletWithVnpay
);

router.get("/callback-vnpay", walletsController.callbackVnpay);

/**
 * @route GET /get-wallet
 * @desc Lấy ra ví người dùng
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware authorizedEmployer: Kiểm tra quyền truy cập
 * @controller walletsController.getWallet: Lấy ra ví người dùng
 */
router.get(
  "/get-wallet",
  protectedRoute,
  authorizedRoute("employer"),
  walletsController.getWallet
);

/**
 * @route GET /get-wallet
 * @desc Lấy ra lịch sử nạp tiền
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware authorizedEmployer: Kiểm tra quyền truy cập
 * @controller walletsController.getHistoryDeposit: Lấy ra lịch sử nạp tiền
 */
router.get(
  "/get-history-deposit",
  protectedRoute,
  authorizedRoute("employer"),
  walletsController.getHistoryDeposit
);

/**
 * @route GET /get-wallet
 * @desc Lấy ra lịch sử thanh toán
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute: Kiểm tra quyền truy cập
 * @middleware authorizedEmployer: Kiểm tra quyền truy cập
 * @controller walletsController.getHistoryPayment: Lấy ra lịch sử thanh toán
 */
router.get(
  "/get-history-payment",
  protectedRoute,
  authorizedRoute("employer"),
  walletsController.getHistoryPayment
);

/**
 * @route GET/wallets/get-payments-time
 * @desc Lấy doanh thu theo thời gian
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("admin"): Kiểm tra quyền truy cập admin
 * @controller walletsController.getPaymentTime: Danh sách doanh thu theo thời gian
 */
router.get(
  "/get-payments-time",
  protectedRoute,
  authorizedRoute("admin"),
  walletsController.getPaymentTime
);

/**
 * @route GET/wallets/get-payments
 * @desc Lấy danh sách doanh thu
 * @access Private
 * @middleware protectedRoute: Kiểm tra xác thực người dùng
 * @middleware authorizedRoute("admin"): Kiểm tra quyền truy cập admin
 * @controller walletsController.getPayments: Danh sách doanh thu
 */
router.get(
  "/get-payments",
  protectedRoute,
  authorizedRoute("admin"),
  walletsController.getPayments
);

router.get(
  "/export-file",
  protectedRoute,
  authorizedRoute("admin"),
  walletsController.exportPaymentToCsv
);

router.get("/get-payments-chart", walletsController.getPaymentChart);

module.exports = router;
