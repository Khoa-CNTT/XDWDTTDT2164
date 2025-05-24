import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { loginApi, logoutApi } from "@apis/auth";
import { getInfoApi } from "@apis/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    isAuthResolved: false, // ✅ Thêm trạng thái xác định đã init xong
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    // Đăng nhập và lấy token
    async login(credentials) {
      try {
        this.isLoading = true;
        const response = await loginApi(credentials);

        const token = response?.data?.accessToken;
        if (!token) {
          throw new Error("Token không hợp lệ từ API");
        }

        this.token = token;
        localStorage.setItem("token", token);

        await this.fetchUserInfo();
        toast.success("Đăng nhập thành công!");
        return this.user;
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        toast.error(error.response?.data?.message || "Lỗi khi đăng nhập!");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch thông tin người dùng từ API
    async fetchUserInfo() {
      try {
        if (!this.token) return null;

        const userInfo = await getInfoApi();
        this.user = userInfo?.data || userInfo;
        return this.user;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast.error("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
        this.logout();
        return null;
      }
    },

    // Đăng xuất người dùng
    async logout() {
      this.user = null;
      this.token = null;
      await logoutApi();
      localStorage.removeItem("token");
    },

    // Khởi tạo auth khi F5 hoặc load lại trang
    async initAuth() {
      this.isAuthResolved = false; // ✅ Reset trước
      if (this.token && !this.user) {
        try {
          await this.fetchUserInfo();
        } catch (error) {
          // lỗi đã được xử lý trong fetchUserInfo
        }
      }
      this.isAuthResolved = true; // ✅ Đánh dấu đã xong
    },
  },
});
