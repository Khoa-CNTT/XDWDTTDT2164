import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  getCategoriesApi,
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "@/apis/category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null; // Reset error trước khi gọi API
      try {
        const response = await getCategoriesApi();
        console.log("Response từ getCategoriesApi:", response); // Log để debug
        if (!response || !response.data) {
          throw new Error("Dữ liệu danh mục không hợp lệ");
        }
        this.categories = response.data;
      } catch (error) {
        console.error("Lấy danh sách danh mục thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách danh mục!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewCategory(categoryData) {
      this.isLoading = true;
      this.error = null; // Reset error trước khi gọi API
      try {
        const response = await createCategoryApi(categoryData);
        console.log("Response từ createCategoryApi:", response); // Log để debug
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới danh mục thành công", { autoClose: 3000 });
          // Cập nhật state categories
          if (response.data) {
            this.categories.push(response.data); // Thêm danh mục mới vào danh sách
          } else {
            // Nếu API không trả về data, gọi lại fetchCategories
            await this.fetchCategories();
          }
        }
        return response; // Trả về response để component sử dụng
      } catch (error) {
        console.error("Tạo mới danh mục thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi tạo mới danh mục!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateCategory(id, categoryData) {
      this.isLoading = true;
      this.error = null; // Reset error trước khi gọi API
      try {
        const response = await updateCategoryApi(categoryData, id);
        console.log("Response từ updateCategoryApi:", response); // Log để debug
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật danh mục thành công", { autoClose: 3000 });
          // Cập nhật state categories
          if (response.data) {
            const index = this.categories.findIndex((cat) => cat.id === id);
            if (index !== -1) {
              this.categories[index] = response.data; // Cập nhật danh mục
            }
          } else {
            // Nếu API không trả về data, gọi lại fetchCategories
            await this.fetchCategories();
          }
        }
        return response; // Trả về response để component sử dụng
      } catch (error) {
        console.error("Cập nhật danh mục thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi cập nhật danh mục!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCategory(id) {
      this.isLoading = true;
      this.error = null; // Reset error trước khi gọi API
      try {
        const response = await deleteCategoryApi(id);
        console.log("Response từ deleteCategoryApi:", response); // Log để debug
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa danh mục thành công", { autoClose: 3000 });
          // Cập nhật state categories
          this.categories = this.categories.filter((cat) => cat.id !== id); // Xóa danh mục khỏi danh sách
        }
        return response; // Trả về response để component sử dụng
      } catch (error) {
        console.error("Xóa danh mục thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa danh mục!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
