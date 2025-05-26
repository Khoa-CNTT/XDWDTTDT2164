import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  getNotificationsApi,
  getNotificationsForEmployerApi,
} from "@apis/notification";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getNotificationsApi();
        if (!response || !response.data) {
          throw new Error("Dữ liệu thông báo không hợp lệ");
        }

        this.notifications = response.data;
      } catch (error) {
        console.error("Lấy danh sách thông báo thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách thông báo!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchNotificationsForEmployer() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getNotificationsForEmployerApi();
        if (!response || !response.data) {
          throw new Error("Dữ liệu thông báo không hợp lệ");
        }
        this.notifications = response.data;
      } catch (error) {
        console.error("Lấy danh sách thông báo thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách thông báo!";
        toast.error(errorMessage);
        this.error = errorMessage;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
