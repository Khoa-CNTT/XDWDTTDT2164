import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { getJobsForAdminAPi, getJobsForEmployerApi } from "../apis/job";

export const useJobStore = defineStore("job", {
  state: () => ({
    jobs: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
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

    async fetchJobsForadmin(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobsForAdminAPi(page, limit);
        if (!response || !response.data?.jobs) {
          throw new Error("Dữ liệu bài đăng không hợp lệ");
        }
        this.jobs = response.data.jobs;
        this.totalPages = response.data.totalJobs;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách bài đăng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchJobsForEmployer(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobsForEmployerApi(page, limit);
        if (!response || !response.data?.jobs) {
          throw new Error("Dữ liệu bài đăng không hợp lệ");
        }
        this.jobs = response.data.jobs;
        this.totalPages = response.data.totalJobs;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách bài đăng!");
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
