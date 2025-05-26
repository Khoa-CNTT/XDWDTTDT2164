<template>
  <div class="row g-0 reset-password-container">
    <div class="col-lg-5 d-none d-lg-block">
      <div class="image-container">
        <img
          src="@/assets/images/12.jpg"
          class="login-image"
          alt="Login Background"
        />
        <div class="overlay-gradient"></div>
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo/logo-2.svg" class="logo-overlay" alt="Logo" />
        </router-link>
      </div>
    </div>
    <div class="col-lg-7 col-md-12">
      <div class="form-center">
        <div class="form-content">
          <div class="d-lg-none text-center mb-5">
            <img src="@/assets/logo/logo.svg" alt="Logo" class="mobile-logo" />
          </div>

          <h2 class="mb-4 text-center">Đặt Lại Mật Khẩu</h2>

          <form @submit.prevent="handleSubmit" class="reset-password-form">
            <div class="mb-4">
              <label class="form-label fw-bold">Nhập mật khẩu mới</label>
              <div class="password-toggle">
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  class="form-control py-2"
                  placeholder="Nhập mật khẩu mới"
                  v-model="form.newPassword"
                  required
                />
                <i
                  @click.prevent="togglePasswordVisibility"
                  :class="[
                    'fas',
                    isPasswordVisible ? 'fa-eye' : 'fa-eye-slash',
                  ]"
                ></i>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Nhập lại mật khẩu</label>
              <div class="password-toggle">
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  class="form-control py-2"
                  placeholder="Nhập lại mật khẩu"
                  v-model="form.confirmPassword"
                  required
                />
                <i
                  @click.prevent="togglePasswordVisibility"
                  :class="[
                    'fas',
                    isPasswordVisible ? 'fa-eye' : 'fa-eye-slash',
                  ]"
                ></i>
              </div>
              <small v-if="!passwordMatch" class="text-danger"
                >Mật khẩu không khớp</small
              >
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2 mb-3"
              :disabled="isSubmitting"
            >
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Đặt lại mật khẩu
            </button>

            <div class="text-center">
              <router-link to="/login" class="text-decoration-none">
                <i class="fas fa-arrow-left me-2"></i>Quay lại đăng nhập
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPasswordApi } from "@apis/user";
import { toast } from "vue3-toastify";

export default {
  name: "ResetPassword",
  data() {
    return {
      isPasswordVisible: false,
      isSubmitting: false,
      form: {
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    passwordMatch() {
      return (
        this.form.newPassword === this.form.confirmPassword ||
        this.form.confirmPassword === ""
      );
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleSubmit() {
      // Validate password match
      if (!this.passwordMatch) {
        toast.error("Mật khẩu không khớp");
        return;
      }

      // Validate password length
      if (this.form.newPassword.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      // Get token from URL query
      const token = this.$route.params.token;
      if (!token) {
        toast.error("Token không hợp lệ hoặc đã hết hạn");
        return;
      }

      this.isSubmitting = true;
      try {
        const response = await resetPasswordApi({
          token,
          newPassword: this.form.newPassword,
        });
        if (response.status === "success") {
          toast.success("Mật khẩu đã được đặt lại thành công", {
            autoClose: 3000,
          });
          this.$router.push("/login?reset=success");
        } else {
          toast.error(response.message || "Lỗi khi đặt lại mật khẩu");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi khi đặt lại mật khẩu"
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Container styles */
.reset-password-container {
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}

/* Left side image container */
.image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform 8s ease;
}

.image-container:hover .login-image {
  transform: scale(1.08);
}

.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

.logo-overlay {
  width: 150px;
  position: absolute;
  top: 30px;
  left: 30px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.logo-overlay:hover {
  transform: scale(1.05);
}

/* Form container */
.form-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 30px;
  background-color: #fbfbfb;
}

.form-content {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.form-content:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

/* Title styling */
h2 {
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 15px;
}

h2:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #007bff, #6610f2);
  border-radius: 3px;
}

/* Form styling */
form .form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 15px;
}

/* Password fields */
.password-toggle {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.password-toggle .form-control {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 15px;
  height: auto;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.password-toggle .form-control:focus {
  box-shadow: none;
  background-color: #f9f9f9;
}

.password-toggle:focus-within {
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
}

.password-toggle i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  z-index: 10;
}

.password-toggle i:hover {
  color: #007bff;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #0069d9, #004494);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Back to login link */
.text-decoration-none {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.text-decoration-none:hover {
  text-decoration: underline !important;
  color: #0056b3;
}

.text-decoration-none i {
  margin-right: 5px;
}

/* Error message */
.text-danger {
  font-size: 14px;
  margin-top: 5px;
  color: #dc3545;
}

/* Mobile logo */
.d-lg-none img {
  width: 130px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.d-lg-none img:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .form-center {
    background-color: white;
    padding: 15px;
    height: auto;
    min-height: 100vh;
  }

  .form-content {
    box-shadow: none;
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 1.5rem;
  }

  .btn-primary {
    padding: 0.6rem 1rem !important;
  }
}
</style>
