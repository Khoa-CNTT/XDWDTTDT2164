import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createSkillApi,
  deleteSkillApi,
  getSkillsApi,
  updateSkillApi,
  getSkillsByCategoryIdApi,
} from "@apis/skill";

export const useSkillStore = defineStore("skill", {
  state: () => ({
    skills: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchSkills(page = 1, limit = 8) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getSkillsApi(page, limit);

        if (!response || !response.data.skills) {
          throw new Error("Dữ liệu kỹ năng không hợp lệ");
        }

        this.skills = response.data.skills;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        console.error("Lấy danh sách kỹ năng thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách kỹ năng!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSkillByCategoryIds(categoryId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getSkillsByCategoryIdApi(categoryId);

        if (!response || !response.data) {
          throw new Error("Dữ liệu kỹ năng không hợp lệ");
        }

        this.skills = response.data;
      } catch (error) {
        console.error("Lấy danh sách kỹ năng thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách kỹ năng!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewSkill(skillData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await createSkillApi(skillData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới kỹ năng thành công", { autoClose: 3000 });

          // Thêm vào danh sách kỹ năng hiện tại
          if (response.data) {
            this.skills.push(response.data);
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchSkills(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Tạo mới kỹ năng thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi tạo mới kỹ năng!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateSkill(id, skillData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await updateSkillApi(skillData, id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật kỹ năng thành công", { autoClose: 3000 });

          const index = this.skills.findIndex((skill) => skill.id === id);
          if (index !== -1 && response.data) {
            this.skills[index] = response.data;
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchSkills(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Cập nhật kỹ năng thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi cập nhật kỹ năng!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteSkill(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await deleteSkillApi(id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa kỹ năng thành công", { autoClose: 3000 });

          this.skills = this.skills.filter((skill) => skill.id !== id);
          await this.fetchSkills(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        console.error("Xóa kỹ năng thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa kỹ năng!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
