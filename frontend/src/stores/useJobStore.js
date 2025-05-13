import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createNewJobApi,
  getJobsForAdminAPi,
  getJobsForEmployerApi,
} from "@apis/job";
import {
  getJobDetailForEmployerApi,
  getJobsApi,
  paymentJobApi,
  updateJobApi,
  verifyJobApi,
} from "../apis/job";

export const useJobStore = defineStore("job", {
  state: () => ({
    jobs: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    job: null,
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

    async fetchJobsForEmployer(page, limit, employerId) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobsForEmployerApi(page, limit, employerId);
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

    async fetchJobs(params) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobsApi(params);
        if (!response || !response.data) {
          throw new Error("Dữ liệu bài đăng không hợp lệ");
        }

        this.jobs = response.data.jobs;
        this.totalPages = response.data.totalJobs;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách bài đăng");
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchJobDetailForEmployer(id) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobDetailForEmployerApi(id);
        if (!response || !response.data) {
          throw new Error("Dữ liệu chi tiết bài đăng không hợp lệ");
        }
        this.job = response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy chi tiết bài đăng");
      } finally {
        this.setLoadingState(false);
      }
    },

    async createNewJob(jobData) {
      try {
        const response = await createNewJobApi(jobData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới bài đăng công việc thành công", {
            autoClose: 3000,
          });

          // Cập nhật states jobs
          if (response.data) {
            this.jobs.push(response.data);
            this.job = response.data;
          }
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi thêm mới bài đăng công việc");
      } finally {
        this.setLoadingState(false);
      }
    },

    async paymentJob(jobData, router) {
      try {
        const response = await paymentJobApi(jobData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Thanh toán bài đăng công việc thành công", {
            autoClose: 3000,
          });
          router.push("/employer-dashboard/employer-list");
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi thanh toán bài đăng");
      } finally {
        this.setLoadingState(false);
      }
    },

    async updateJob(id, data) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await updateJobApi(id, data);
        if (!response) {
          throw new Error("Phản hổi từ API không hợp lệ");
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi chỉnh sửa bài đăng");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async verifyJob(id, status) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await verifyJobApi(id, status);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi kiểm duyệt bài đăng");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
