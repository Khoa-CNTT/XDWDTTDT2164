import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  depositMomoApi,
  depositZalopayApi,
  getHistoryDepositApi,
  getHistoryPaymentApi,
  getWalletApi,
} from "../apis/wallet";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    wallet: null,
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    historyDeposits: [],
    historyPayments: [],
  }),
  actions: {
    setLoadingState(value) {
      this.isLoading = value;
    },
    resetError() {
      this.error = null;
    },
    handleError(error, fallbackMessage) {
      console.error(fallbackMessage, error);
      const errorMessage = error?.response?.data?.message || fallbackMessage;
      toast.error(errorMessage);
      this.error = errorMessage;
    },

    async depositMomo(data) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await depositMomoApi(data);
        return response.data.payUrl;
      } catch (error) {
        this.handleError(error, "Lỗi khi nạp tiền bằng momo");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async depositZalopay(data) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await depositZalopayApi(data);
        return response.data.order_url;
      } catch (error) {
        this.handleError(error, "Lỗi khi nạp tiền bằng zalopay");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchWallet() {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getWalletApi();
        if (!response || !response.data) {
          throw new Error("Dữ liệu ví không hợp lệ");
        }
        this.wallet = response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy ví người dùng");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchHistoryDeposit(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getHistoryDepositApi(page, limit);
        if (!response.data || !response.data?.deposits) {
          throw new Error("Dữ liệu lịch sử nạp tiền không hợp lệ");
        }

        this.historyDeposits = response.data?.deposits;
        this.totalPages = response.data.total;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách lịch sử nạp tiền");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchHistoryPayment(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getHistoryPaymentApi(page, limit);
        if (!response || !response.data?.payments) {
          throw new Error("Dữ liệu lịch sử thanh toán không hợp lệ");
        }
        this.historyPayments = response.data?.payments;
        this.totalPages = response.data.total;
        this.currentPage = response.data.page;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách lịch sử thanh toán");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
