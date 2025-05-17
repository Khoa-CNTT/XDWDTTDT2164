<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h4 class="mb-1 text-primary fw-bold">Thay đổi mật khẩu</h4>
      <router-link to="/" class="text-decoration-none text-muted small">
        <i class="bi bi-arrow-left me-1"></i>Trở lại trang chủ
      </router-link>
    </div>

    <!-- Change Password Form -->
    <div class="card border-0 rounded-4 shadow-sm">
      <div class="card-body p-4">
        <h5 class="mb-4 fw-bold">Thay đổi mật khẩu</h5>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger mb-4 rounded-3">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="form-label fw-medium">Mật khẩu cũ</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-lock"></i>
              </span>
              <input
                type="password"
                class="form-control bg-light border-0"
                placeholder="Nhập mật khẩu cũ"
                v-model="oldPassword"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-medium">Mật khẩu mới</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-key"></i>
              </span>
              <input
                type="password"
                class="form-control bg-light border-0"
                placeholder="Nhập mật khẩu mới"
                v-model="newPassword"
                :disabled="isLoading"
              />
            </div>
            <small class="text-muted mt-1"
              >Mật khẩu phải có ít nhất 6 ký tự</small
            >
          </div>

          <div class="mb-4">
            <label class="form-label fw-medium">Nhập lại mật khẩu</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                class="form-control bg-light border-0"
                placeholder="Nhập lại mật khẩu mới"
                v-model="confirmPassword"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button
              type="submit"
              class="btn btn-primary px-4"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ isLoading ? "Đang xử lý..." : "Lưu thay đổi" }}
            </button>
          </div>
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
        // Trim inputs to remove leading/trailing whitespace
        const oldPassword = this.oldPassword.trim();
        const newPassword = this.newPassword.trim();
        const confirmPassword = this.confirmPassword.trim();

        // Validate inputs
        if (!oldPassword || !newPassword || !confirmPassword) {
          this.error = "Vui lòng điền đầy đủ các trường.";
          return;
        }

        // Check for minimum and maximum length
        if (newPassword.length < 6) {
          this.error = "Mật khẩu mới phải có ít nhất 6 ký tự.";
          return;
        }
        if (newPassword.length > 128) {
          this.error = "Mật khẩu mới không được vượt quá 128 ký tự.";
          return;
        }

        // Check if new password is the same as old password
        if (oldPassword === newPassword) {
          this.error = "Mật khẩu mới phải khác với mật khẩu cũ.";
          return;
        }

        // Password strength validation
        const passwordStrengthRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordStrengthRegex.test(newPassword)) {
          this.error =
            "Mật khẩu mới phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một số và một ký tự đặc biệt.";
          return;
        }

        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
          this.error = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
          return;
        }

        // Call API
        const data = {
          oldPassword,
          newPassword,
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
/* Improved Form Styling */
.form-control,
.input-group-text {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
}

.input-group-text {
  color: #6c757d;
}

.form-control::placeholder {
  color: #a0a6ac;
  opacity: 0.8;
}

.form-control:focus {
  background-color: #ffffff !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-color: #86b7fe;
}

.form-control:focus + .input-group-text,
.input-group:focus-within .input-group-text {
  background-color: #ffffff !important;
  border-color: #86b7fe;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Button Styling */
.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  transform: translateY(-1px);
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #212529;
  border-color: #ced4da;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

/* Header and Labels */
.text-primary {
  color: #0d6efd !important;
}

.form-label {
  margin-bottom: 0.5rem;
  color: #495057;
}

/* Error Message */
.alert-danger {
  border-left: 4px solid #dc3545;
}
</style>
