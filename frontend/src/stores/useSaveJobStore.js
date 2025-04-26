import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { deleteSaveJobApi, getSaveJobsApi, saveJobApi } from "../apis/saveJob";

export const useSaveJobsStore = defineStore("save-job", {
  state: () => ({
    jobs: [],
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
    async fetchSaveJobs(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getSaveJobsApi(page, limit);
        if (!response || !response.data) {
          throw new Error("Dữ liệu bài đăng đã lưu không hợp lệ");
        }
        this.jobs = response.data.jobs;
        this.totalPages = response.data.totalJobs;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(
          error,
          "Lỗi khi lấy danh sách bài đăng công việc đã lưu"
        );
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async saveJobs(jobData) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await saveJobApi(jobData);
        if (!response || !response.data) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Thêm mới bài đăng vào danh sách bài đăng thành công", {
            autoClose: 3000,
          });
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi thêm bài đăng vào danh sách đã lưu");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async delJob(jobId) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await deleteSaveJobApi(jobId);
        if (!response) {
          throw new Error("Phản hồi từ APi không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa bài đăng công việc trong danh sách thành công", {
            autoClose: 3000,
          });
          this.jobs = this.jobs.filter((job) => job.id === jobId);
          await this.fetchSaveJobs(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        this.handleError(
          error,
          "Lỗi khi xóa bài đăng công việc trong danh sách đã lưu!"
        );
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
