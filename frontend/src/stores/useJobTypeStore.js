import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createJobTypeApi,
  deleteJobTypeApi,
  getJobTypesApi,
  updateJobTypeApi,
} from "@apis/jobType";

export const useJobTypeStore = defineStore("job-type", {
  state: () => ({
    jobTypes: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchJobTypes(page, limit) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getJobTypesApi(page, limit);
        if (!response || !response.data) {
          throw new Error("Dữ liệu hình thức làm việc không hợp lệ");
        }

        this.jobTypes = response.data.jobTypes || response.data; // Hỗ trợ cả trường hợp API trả về data.jobTypes hoặc data trực tiếp
        this.totalPages =
          response.data.totalPages ||
          Math.ceil(response.data.total / limit) ||
          1;
        this.currentPage = response.data.currentPage || page;
        this.pageSize = response.data.pageSize || limit;
      } catch (error) {
        console.error("Lấy danh sách hình thức làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi lấy danh sách hình thức làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewJobType(jobTypeData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await createJobTypeApi(jobTypeData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới hình thức làm việc thành công", {
            autoClose: 3000,
          });

          // Thêm vào danh sách jobTypes hiện tại
          if (response.data) {
            this.jobTypes.push(response.data);
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchJobTypes(this.currentPage, this.pageSize);
          }
        }
        return response; // Trả về response để component xử lý
      } catch (error) {
        console.error("Tạo mới hình thức làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi tạo mới hình thức làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateJobType(id, jobTypeData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await updateJobTypeApi(id, jobTypeData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật hình thức làm việc thành công", {
            autoClose: 3000,
          });

          const index = this.jobTypes.findIndex((jobType) => jobType.id === id);
          if (index !== -1 && response.data) {
            this.jobTypes[index] = response.data;
          } else {
            await this.fetchJobTypes(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Cập nhật hình thức làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi cập nhật hình thức làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteJobType(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await deleteJobTypeApi(id);
        if (!response) {
          throw new Error("Phản hồi API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa hình thức làm việc thành công", {
            autoClose: 3000,
          });

          this.jobTypes = this.jobTypes.filter((jobType) => jobType.id !== id);
          await this.fetchJobTypes(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        console.error("Xóa hình thức làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa hình thức làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
