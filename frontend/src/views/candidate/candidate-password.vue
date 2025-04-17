<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h4 class="mb-1">Thay đổi mật khẩu</h4>
      <router-link to="/" class="text-decoration-none text-muted small"
        >Trở lại trang chủ?</router-link
      >
    </div>

    <!-- Change Password Form -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h5 class="mb-4">Thay đổi mật khẩu</h5>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger mb-4">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="form-label">Mật khẩu cũ</label>
            <input
              type="password"
              class="form-control bg-light border-0"
              placeholder="Nhập mật khẩu cũ"
              v-model="oldPassword"
              :disabled="isLoading"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Mật khẩu mới</label>
            <input
              type="password"
              class="form-control bg-light border-0"
              placeholder="Nhập mật khẩu mới"
              v-model="newPassword"
              :disabled="isLoading"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Nhập lại mật khẩu</label>
            <input
              type="password"
              class="form-control bg-light border-0"
              placeholder="Nhập lại mật khẩu mới"
              v-model="confirmPassword"
              :disabled="isLoading"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary px-4"
            :disabled="isLoading"
          >
            {{ isLoading ? "Đang xử lý..." : "Lưu" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { changePassword } from "@/apis/user";
import { toast } from "vue3-toastify";

export default {
  name: "ChangePassword",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async handleSubmit() {
      this.error = null;
      this.isLoading = true;

      try {
        // Validate inputs
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.error = "Vui lòng điền đầy đủ các trường.";
          return;
        }

        if (this.newPassword.length < 6) {
          this.error = "Mật khẩu mới phải có ít nhất 6 ký tự.";
          return;
        }

        if (this.newPassword !== this.confirmPassword) {
          this.error = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
          return;
        }

        // Call API
        const data = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        const response = await changePassword(data);

        // Show success message
        toast.success(response.message || "Đổi mật khẩu thành công!");

        // Reset form
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi đổi mật khẩu.";
        this.error = errorMessage;
        toast.error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.form-control {
  padding: 0.75rem 1rem;
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 0.75;
}

.form-control:focus {
  background-color: #f8f9fa;
  box-shadow: none;
  border-color: transparent;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>
