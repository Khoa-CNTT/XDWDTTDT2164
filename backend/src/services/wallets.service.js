const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const moment = require("moment");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const db = require("../models");
const { caculatePromotionAmount } = require("../libs/helper");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  endpointCheckStatus: "https://sb-openapi.zalopay.vn/v2/query",
};
/**
 * Service xử lý logic nghiệp vụ liên quan đến wallet
 */
class WalletsService {
  /**
   * Nạp tiền vào tài khoản với zalopay
   * @param {number} amount - Số tiền cần nạp
   * @param {string} userId - Id của người dùng
   */
  async depositToWallet(amount, userId) {
    const embed_data = {
      redirecturl: "https://facebook.com",
    };

    // Tính số tiền khuyến mãi
    const promotionAmount = caculatePromotionAmount(amount);

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: userId,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount + promotionAmount,
      description: `Superio - Nạp tiền vào tài khoản #${transID}`,
      bank_code: "",
      callback_url:
        "https://a06b-116-110-240-94.ngrok-free.app/api/wallets/callback-zalopay",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });

      if (!result.data) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          result?.data?.message || "Lỗi kết nối ZaloPay",
          result?.data?.return_code || "UNKNOWN_ERROR"
        );
      }

      // Tạo mới payment - type là nạp tiền
      const payment = await db.Payments.create({
        userId,
        amount: amount + promotionAmount,
        promotionAmount,
        transactionType: "Nạp tiền",
        currency: "VND",
        paymentMethod: "ZALOPAY",
        status: "Đang chờ",
        transactionId: `${moment().format("YYMMDD")}_${transID}`,
        paymentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Callbacks khi thanh toán thành công zalopay
   * @param {string} data - Dữ liệu callback
   * @param {string} mac - Mã MAC
   * @returns {Promise<void>} - Trả về dữ liệu callback
   */
  async callbackZalopay(callBackdata) {
    let result = {};
    const transaction = await db.sequelize.transaction();

    try {
      let dataStr = callBackdata.data;
      let reqMac = callBackdata.mac;

      // Tính toán mac để kiểm tra callback hợp lệ
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

      // Parse data JSON, tránh lỗi
      let dataJson;
      try {
        dataJson = JSON.parse(dataStr);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON data");
      }

      // Kiểm tra callback hợp lệ
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";

        // Cập nhật trạng thái thất bại cho giao dịch
        const payment = await db.Payments.findOne({
          where: { transactionId: dataJson["app_trans_id"] },
          transaction,
        });

        if (payment) {
          payment.status = "Thất bại";
          await payment.save({ transaction });
        }

        await transaction.commit();
        return result;
      }

      // Truy vấn payment từ DB
      const payment = await db.Payments.findOne({
        where: { transactionId: dataJson["app_trans_id"] },
        transaction,
      });

      if (!payment) {
        throw new Error(
          `Payment not found for transactionId ${dataJson["app_trans_id"]}`
        );
      }

      // Kiểm tra trạng thái đã thành công hay chưa
      if (payment.status === "Thành công") {
        await transaction.commit();
        return { return_code: 1, return_message: "success" };
      }

      // Kiểm tra số tiền từ ZaloPay có khớp không
      const zalopayAmount = parseFloat(dataJson["amount"]);
      if (zalopayAmount !== parseFloat(payment.amount)) {
        throw new Error(
          `Amount mismatch: Expected ${payment.amount}, received ${zalopayAmount}`
        );
      }

      // Cập nhật trạng thái giao dịch
      payment.status = "Thành công";
      await payment.save({ transaction });

      console.log(`Updated payment ${payment.id} to "Thành công"`);

      // Cập nhật số dư cho ví
      const wallet = await db.Wallets.findOne({
        where: { userId: payment.userId },
        transaction,
      });

      if (wallet) {
        wallet.balance += payment.amount;
        await wallet.save({ transaction });
      } else {
        await db.Wallets.create(
          { userId: payment.userId, balance: payment.amount, currently: "VND" },
          { transaction }
        );
      }

      // Hoàn tất giao dịch
      await transaction.commit();
      return { return_code: 1, return_message: "success" };
    } catch (ex) {
      await transaction.rollback();
      console.error("Error in callbackZalopay:", ex);
      return {
        return_code: 0,
        return_message: ex.message || "Internal server error",
      };
    }
  }

  // async checkPaymentStatusZalopay(appTransId) {
  //   let postData = {
  //     app_id: config.app_id,
  //     app_trans_id: appTransId, // Input your app_trans_id
  //   };

  //   let data =
  //     postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  //   postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  //   let postConfig = {
  //     method: "post",
  //     url: config.endpointCheckStatus,
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     data: qs.stringify(postData),
  //   };

  //   try {
  //     const result = await axios(postConfig);
  //     return result.data;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  /**
   * Nạp tiền vào tài khoản với MoMo
   * @param {number} amount - Số tiền cần nạp
   * @param {string} userId - Id của người dùng
   */
  async depositToWalletWithMoMo(amount, userId) {
    // Tính số tiền khuyến mãi
    const promotionAmount = caculatePromotionAmount(amount);
    const totalAmount = amount + promotionAmount;

    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "Nạp tiền vào tài khoản";
    var redirectUrl = "https://momo.vn/return";
    var ipnUrl =
      "https://a06b-116-110-240-94.ngrok-free.app/api/wallets/callback-momo";
    var requestType = "payWithMethod";
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      totalAmount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    //signature
    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: totalAmount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "vi",
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      let result = response.data;
      console.log(result);
      if (result.resultCode !== 0) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          result.message || "Lỗi kết nối MoMo"
        );
      }

      // Tạo mới payment - type là nạp tiền
      const payment = await db.Payments.create({
        userId,
        amount: amount + promotionAmount,
        promotionAmount,
        transactionType: "Nạp tiền",
        currency: "VND",
        paymentMethod: "MOMO",
        status: "Đang chờ",
        transactionId: result.orderId,
        paymentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      return result;
    } catch (error) {
      console.log(error.message);
      // Consider adding more detailed error logging
      console.log(error.response?.data || "No detailed error data");
      throw error; // Re-throw the error to handle it at a higher level
    }
  }

  /**
   * Callback khi thanh toán thành công MoMo
   * @param {string} data - Dữ liệu callback
   * @param {string} mac - Mã MAC
   * @returns {Promise<void>} - Trả về dữ liệu callback
   */
  async callbackMoMo(callBackData) {
    const transaction = await db.sequelize.transaction();
    try {
      const { orderId, amount, resultCode, message } = callBackData;

      // Kiểm tra kết quả từ MoMo
      if (resultCode !== 0) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          message || "Giao dịch không thành công"
        );
      }

      // Tìm payment
      const payment = await db.Payments.findOne({
        where: { transactionId: orderId },
        transaction,
      });

      if (!payment) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Không tìm thấy giao dịch");
      }

      // Kiểm tra trạng thái và số tiền
      if (payment.status === "Thành công") {
        console.log(`Payment ${payment.id} already processed successfully`);
        await transaction.commit();
        return { return_code: 1, return_message: "success" };
      }

      const paymentAmount = parseFloat(payment.amount);
      const callbackAmount = parseFloat(amount);
      if (paymentAmount !== callbackAmount) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Số tiền không khớp");
      }

      // Cập nhật trạng thái payment
      payment.status = "Thành công";
      await payment.save({ transaction });
      console.log(`Updated payment ${payment.id} status to: Thành công`);

      // Tìm hoặc tạo wallet
      const wallet = await db.Wallets.findOne({
        where: { userId: payment.userId },
        transaction,
      });

      if (wallet) {
        wallet.balance = parseFloat(wallet.balance) + paymentAmount;
        await wallet.save({ transaction });
        console.log(
          `Updated wallet ${wallet.id} balance to: ${wallet.balance}`
        );
      } else {
        const newWallet = await db.Wallets.create(
          {
            userId: payment.userId,
            balance: paymentAmount,
            currently: "VND",
          },
          { transaction }
        );
        console.log(
          `Created new wallet ${newWallet.id} with balance: ${newWallet.balance}`
        );
      }

      await transaction.commit();
      return { return_code: 1, return_message: "success" };
    } catch (error) {
      await transaction.rollback();
      console.error("Error in callbackMoMo:", error);
      throw error;
    }
  }

  /**
   * Lịch sử nạp tiền
   * @param {string} userId - Id của người dùng
   * @returns {Promise<void>} - Trả về lịch sử nạp tiền
   */
  async getHistoryDeposit(userId, query) {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const history = await db.Payments.findAndCountAll({
      where: {
        userId,
        transactionType: "Nạp tiền",
      },
      order: [["createdAt", "DESC"]],
      attributes: [
        "paymentDate",
        "amount",
        "promotionAmount",
        "transactionId",
        "paymentMethod",
      ],
      limit,
      offset,
    });

    return { page, limit, total: history.count, data: history.rows };
  }

  /**
   * Lịch sử thanh toán
   * @param {string} userId - Id của người dùng
   * @returns {Promise<void>} - Trả về lịch sử thanh toán
   */
  async getHistoryPayment(userId, query) {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const history = await db.Payments.findAndCountAll({
      where: {
        userId,
        transactionType: {
          [Op.or]: ["Thanh toán", "Hoàn tiền"],
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Wallets,
          attributes: ["balanceBefore", "balanceAfter"],
        },
        {
          model: db.Jobs,
          attributes: ["id", "title"],
        },
      ],
      attributes: ["paymentDate", "amount", "paymentMethod", "note"],
      limit,
      offset,
    });

    return { page, limit, total: history.count, data: history.rows };
  }
}

module.exports = new WalletsService();
