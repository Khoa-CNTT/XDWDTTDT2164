import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createSalaryApi,
  getSalariesApi,
  updateSalaryApi,
  deleteSalaryApi,
} from "@apis/salaries";

export const useSalaryStore = defineStore("salary", {
  state: () => ({
    salaries: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchSalaries(page, limit) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getSalariesApi(page, limit);
        if (!response || !response.data) {
          throw new Error("Dữ liệu mức lương không hợp lệ");
        }
        this.salaries = response.data;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        console.error("Lấy danh sách mức lương thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách mức lương!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewSalary(salaryData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await createSalaryApi(salaryData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới mức lương thành công", { autoClose: 3000 });

          // Thêm vào danh sách mức lương hiện tại
          if (response.data) {
            this.salaries.push(response.data);
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchSalaries(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Tạo mới mức lương thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi tạo mới mức lương!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateSalary(id, salaryData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await updateSalaryApi(id, salaryData);
        if (!response) {
          throw new Error("Phản hồi tử API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật cấp bậc thành công", { autoClose: 3000 });

          const index = this.salaries.findIndex((salary) => salary.id === id);
          if (index !== -1 && response.data) {
            this.salaries[index] = response.data;
          } else {
            await this.fetchSalaries(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Cập nhật mức lương thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi mức lương cấp bậc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSalary(id) {
      this.isLoading = true;
      this.error = null;
      try {
        console.log("bắt đầu xóa");
        const response = await deleteSalaryApi(id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa mức lương thành công", { autoClose: 3000 });
          this.salaries = this.salaries.filter((salary) => salary.id !== id);
          await this.fetchSalaries(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        console.error("Xóa mức lương thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa mức lương!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
