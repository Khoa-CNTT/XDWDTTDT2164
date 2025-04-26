import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import {
  getCandidatesByAdminApi,
  getDetailEmployerApi,
  getEmployerInfoApi,
  getEmployersApi,
  getEmployersForAdminApi,
  getUsersByAdminApi,
  updateUserApi,
} from "../apis/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    candidates: [],
    employers: [],
    users: [],
    employer: null,
    totalPages: 0,
    currentPage: 1,
    pageSize: 8,
    isLoading: false,
    error: null,
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

    async fetchUsers(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getUsersByAdminApi(page, limit);
        if (!response || !response.data.users) {
          throw new Error("Dữ liệu người dùng không hợp lệ");
        }
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.page;
        this.pageSize = response.data.pageSize;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách người dùng");
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchCandidates(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getCandidatesByAdminApi(page, limit);
        if (!response || !response.data?.candidates) {
          throw new Error("Dữ liệu ứng viên không hợp lệ");
        }
        this.candidates = response.data.candidates;
        this.totalPages = response.data.totalCandidate;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách ứng viên!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchEmployers(page, limit) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getEmployersForAdminApi(page, limit);
        if (!response || !response.data?.employers) {
          throw new Error("Dữ liệu nhà tuyển dụng không hợp lệ");
        }
        this.employers = response.data.employers;
        this.totalPages = response.data.totalEmployers;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách nhà tuyển dụng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchAllEmployers(query) {
      this.setLoadingState(true);
      this.resetError();

      try {
        const response = await getEmployersApi(query);
        if (!response || !response.data?.employers) {
          throw new Error("Dữ liệu nhà tuyển dụng không hợp lệ");
        }
        this.employers = response.data.employers;
        this.totalPages = response.data.totalEmployers;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách nhà tuyển dụng");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchDetailEmployer(slug) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getDetailEmployerApi(slug);
        if (!response || !response.data) {
          throw new Error("Lỗi khi lấy chi tiết công ty");
        }
        this.employer = response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy chi tiết công ty");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async fetchEmployerInfo() {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getEmployerInfoApi();
        if (!response || !response.data) {
          throw new Error("Dữ liệu nhà tuyển dụng không hợp lệ");
        }
        this.employer = response.data;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy thông tin nhà tuyển dụng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },

    async updateUser(userId, userData) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await updateUserApi(userId, userData);
        if (!response || !response.data) {
          throw new Error("Phản hồi từ API không hợp lệ");
        }
        if (response.status === "success") {
          toast.success("Cập nhật thông tin người dùng thành công", {
            autoClose: 3000,
          });

          const index = this.users.findIndex((user) => user.id === userId);
          if (index !== -1 && response.data) {
            this.users[index] = response.data;
          } else {
            await this.fetchUsers(this.currentPage, this.pageSize);
          }
        }
        return response;
      } catch (error) {
        this.handleError(error, "Lỗi khi cập nhật thông tin người dùng!");
        throw error;
      } finally {
        this.setLoadingState(false);
      }
    },
  },
});
