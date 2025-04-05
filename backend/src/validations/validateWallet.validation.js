const { body } = require("express-validator");

/**
 * Validate request nạp tiền vào ví
 */
const validateDepositToWallet = [
  body("amount").notEmpty().withMessage("Số tiền không được để trống"),
];

module.exports = { validateDepositToWallet };
