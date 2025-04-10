import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createExperenceApi,
  deleteExperienceApi,
  getExperiencesApi,
  updateExperienceApi,
} from "@apis/experience";

export const useExperienceStore = defineStore("experience", {
  state: () => ({
    experiences: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchExperiences(page, limit) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getExperiencesApi(page, limit);
        if (!response || !response.data) {
          throw new Error("Dữ liệu kinh nghiệm làm việc không hợp lệ.");
        }

        this.experiences = response.data;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        console.error("Lấy danh sách kinh nghiệm làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi lấy danh sách kinh nghiệm làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewExperience(experienceData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await createExperenceApi(experienceData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới kinh nghiệm làm việc thành công", {
            autoClose: 3000,
          });
          if (response.data) {
            this.experiences.push(response.data);
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchExperiences(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Tạo mới kinh nghiệm làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi tạo mới kinh nghiệm làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateExperience(id, experienceData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await updateExperienceApi(id, experienceData);
        if (!response) {
          throw new Error("Phản hồi tử API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật cấp bậc thành công", { autoClose: 3000 });

          const index = this.experiences.findIndex(
            (experience) => experience.id === id
          );
          if (index !== -1 && response.data) {
            this.experiences[index] = response.data;
          } else {
            await this.fetchExperiences(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Cập nhật kinh nghiệm làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Lỗi khi cập nhật kinh nghiệm làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteExperience(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await deleteExperienceApi(id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa kinh nghiệm làm việc thành công", {
            autoClose: 3000,
          });

          this.experiences = this.experiences.filter(
            (experience) => experience.id !== id
          );
          await this.fetchExperiences(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        console.error("Xóa kinh nghiệm làm việc thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa kinh nghiệm làm việc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
