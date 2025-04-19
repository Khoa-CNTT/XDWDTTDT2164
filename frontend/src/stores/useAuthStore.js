import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { loginApi } from "@apis/auth";
import { getInfoApi } from "@apis/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
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

        // Điều chỉnh theo cấu trúc response API của bạn
        const token = response?.data?.accessToken;
        if (!token) {
          throw new Error("Token không hợp lệ từ API");
        }

        this.token = token;
        localStorage.setItem("token", token);

        // Fetch thông tin người dùng sau khi đăng nhập thành công
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
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      toast.success("Đã đăng xuất thành công!");
    },

    // Phương thức để khởi tạo trạng thái khi refresh trang
    async initAuth() {
      if (this.token && !this.user) {
        try {
          await this.fetchUserInfo(); // Fetch lại thông tin người dùng nếu có token
        } catch (error) {
          // Không cần xử lý gì ở đây, lỗi đã được xử lý trong fetchUserInfo
        }
      }
    },
  },
});
