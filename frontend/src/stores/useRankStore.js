import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  createRankApi,
  deleteRankApi,
  getRankApi,
  updateRankApi,
} from "@apis/rank";

export const useRankStore = defineStore("rank", {
  state: () => ({
    ranks: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchRanks(page, limit) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getRankApi(page, limit);

        if (!response || !response.data) {
          throw new Error("Dữ liệu cấp bậc không hợp lệ");
        }

        this.ranks = response.data;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        console.error("Lấy danh sách cấp bậc thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách cấp bậc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addNewRank(rankData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await createRankApi(rankData);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Tạo mới cấp bậc thành công", { autoClose: 3000 });

          // Thêm vào danh sách cấp bậc hiện tại
          if (response.data) {
            this.ranks.push(response.data);
          } else {
            // Nếu API không trả về dữ liệu, làm mới danh sách
            await this.fetchRanks(this.currentPage, this.pageSize);
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

    async updateRank(id, rankData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await updateRankApi(rankData, id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật cấp bậc thành công", { autoClose: 3000 });

          const index = this.ranks.findIndex((rank) => rank.id === id);
          if (index !== -1 && response.data) {
            this.ranks[index] = response.data;
          } else {
            await this.fetchRanks(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        console.error("Cập nhật cấp bậc thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi cập nhật cấp bậc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRank(id) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await deleteRankApi(id);
        if (!response) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Xóa cấp bậc thành công", { autoClose: 3000 });

          this.ranks = this.ranks.filter((rank) => rank.id !== id);
          await this.fetchRanks(this.currentPage, this.pageSize);
        }
        return response;
      } catch (error) {
        console.error("Xóa cấp bậc thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi xóa cấp bậc!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
