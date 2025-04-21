import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  getCandidatesByAdminApi,
  getEmployerInfoApi,
  getEmployersForAdminApi,
} from "../apis/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    candidates: [],
    employers: [],
    employer: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
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

    async fetchCandidates(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getCandidatesByAdminApi(page, limit);
        if (!response || !response.data?.candidates) {
          throw new Error("Dữ liệu ứng viên không hợp lệ");
        }
        this.candidates = response.data.candidates;
        this.totalPages = response.data.totalCandidate;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách ứng viên!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchEmployers(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getEmployersForAdminApi(page, limit);
        if (!response || !response.data?.employers) {
          throw new Error("Dữ liệu nhà tuyển dụng không hợp lệ");
        }
        this.employers = response.data.employers;
        this.totalPages = response.data.totalEmployers;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách nhà tuyển dụng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchEmployerInfo() {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getEmployerInfoApi();
        if (!response || !response.data) {
          throw new Error("Dữ liệu nhà tuyển dụng không hợp lệ");
        }
        this.employer = response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy thông tin nhà tuyển dụng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
