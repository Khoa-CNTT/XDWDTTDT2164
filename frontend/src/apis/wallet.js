import api from "@utils/axios.config";

/**
 * Nạp tiền vào tài khoản theo phương thức MoMo
 * @returns {Promise<void>} - Trả về data
 */
export const depositMomoApi = async (data) => {
  const response = await api.post("/api/wallets/deposit-momo", data);
  return response.data;
};

/**
 * Nạp tiền vào tài khoản theo phương thức zalopay
 * @returns {Promise<void>} - Trả về data
 */
export const depositZalopayApi = async (data) => {
  const response = await api.post("/api/wallets/deposit-zalopay", data);
  return response.data;
};

/**
 * Nạp tiền vào tài khoản theo phương thức vnpay
 * @returns {Promise<void>} - Trả về data
 */
export const depositVnpayApi = async (data) => {
  const response = await api.post("/api/wallets/deposit-vnpay", data);
  return response.data;
};

/**
 * Lấy ra ví người dùng
 * @returns {Promise<void>} - Trả về data
 */
export const getWalletApi = async () => {
  const response = await api.get("/api/wallets/get-wallet");
  return response.data;
};

/**
 * Lấy ra lịch sử nạp tiền
 * @returns {Promise<void>} - Trả về data
 */
export const getHistoryDepositApi = async (page, limit) => {
  const response = await api.get("/api/wallets/get-history-deposit", {
    param: { page, limit },
  });
  return response.data;
};

/**
 * Lấy ra lịch sử thanh toán
 * @returns {Promise<void>} - Trả về data
 */
export const getHistoryPaymentApi = async (page, limit) => {
  const response = await api.get("/api/wallets/get-history-payment", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Lấy ra danh sách giao dịch
 * @param {string} page
 * @param {string} limit
 * @returns
 */
export const getPaymentsApi = async (page, limit) => {
  const response = await api.get("/api/wallets/get-payments", {
    params: { page, limit },
  });

  return response.data;
};

/**
 * Xuất file csv
 * @returns
 */
export const exportFileCsv = async () => {
  const response = await api.get("/api/wallets/export-file", {
    responseType: "blob", // 👈 yêu cầu server trả về định dạng nhị phân (blob)
  });
  return response.data;
};

/**
 * Lấy doanh thu theo thời gian
 * @returns {Promise<void>}
 */
export const getPaymentTimeApi = async () => {
  const response = await api.get("/api/wallets/get-payments-time");
  return response.data;
};
