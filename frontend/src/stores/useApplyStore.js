import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  applyToJobApi,
  getCandidateDetailApi,
  getCandidatesApi,
} from "../apis/applyJob";

export const useApplyStore = defineStore("apply-job", {
  state: () => ({
    candidates: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    candidateDetail: null,
  }),
  actions: {
    setLoadingState(value) {
      this.isLoading = value;
    },
    resetError() {
      this.error = null;
    },
    handleError(error, fallbackMessage) {
      console.log(fallbackMessage, error);
      const errorMessage = error?.response?.data?.message || fallbackMessage;
      toast.error(errorMessage);
      this.error = errorMessage;
    },

    async applyJob(data) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await applyToJobApi(data);
        return response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi ứng tuyển công việc");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchCandidates(jobId, page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getCandidatesApi(jobId, page, limit);
        if (!response || !response.data) {
          throw new Error("Dữ liệu danh sách không hợp lệ");
        }
        this.candidates = response.data.candidates;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
        this.totalPages = response.data.totalCandidates;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách ứng viên");
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchCandidateDetail(jobId, candidateId) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getCandidateDetailApi(jobId, candidateId);
        if (!response || !response.data) {
          throw new Error("Dữ liệu thông tin ứng viên không hợp lệ");
        }
        this.candidateDetail = response.data;
        return response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy thông tin ứng viên");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
