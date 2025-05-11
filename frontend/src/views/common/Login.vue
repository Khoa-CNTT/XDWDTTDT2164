<template>
  <div class="row g-0 login-container">
    <div class="col-lg-5 d-none d-lg-block">
      <div class="image-container">
        <img
          src="@/assets/images/12.jpg"
          class="login-image"
          alt="Login Background"
        />
        <div class="overlay-gradient"></div>
        <img src="@/assets/logo/logo-2.svg" class="logo-overlay" alt="Logo" />
      </div>
    </div>
    <div class="col-lg-7 col-md-12">
      <div class="form-center">
        <div class="form-content">
          <div class="d-lg-none text-center mb-5">
            <img src="@/assets/logo/logo.svg" alt="Logo" class="mobile-logo" />
          </div>

          <h2 class="title-text mb-4 text-center">Đăng nhập</h2>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="mb-4">
              <label class="form-label">Email</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  placeholder="Nhập email của bạn"
                  v-model="form.email"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <div class="password-toggle input-group">
                <span class="input-group-text">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  :type="isPasswordVisible ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Nhập mật khẩu của bạn"
                  v-model="form.password"
                  required
                />
                <span
                  class="input-group-text password-eye"
                  @click.prevent="togglePasswordVisibility"
                >
                  <i
                    :class="[
                      'fas',
                      isPasswordVisible ? 'fa-eye' : 'fa-eye-slash',
                    ]"
                  ></i>
                </span>
              </div>
              <div class="text-end mt-2">
                <router-link to="/forgot-password" class="forgot-link"
                  >Quên mật khẩu?</router-link
                >
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-3 mb-4 login-btn"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading">
                <i class="fas fa-spinner fa-spin me-2"></i>Đang đăng nhập...
              </span>
              <span v-else>Đăng nhập</span>
            </button>

            <div class="text-center register-prompt">
              Bạn chưa có tài khoản?
              <router-link to="/register" class="register-link"
                >Đăng ký ngay</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@stores/useAuthStore";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const authStore = useAuthStore();

    return {
      authStore,
    };
  },
  data() {
    return {
      isPasswordVisible: false,
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleLogin() {
      try {
        const userInfo = await this.authStore.login(this.form); // Gọi API đăng nhập

        // Lấy đường dẫn chuyển hướng nếu có
        let redirectPath;
        if (userInfo.role === "admin") {
          redirectPath = "/admin-dashboard/admin-starter";
        } else if (userInfo.role === "candidate") {
          if (
            !this.authStore.user.Candidates ||
            (typeof this.authStore.user.Candidates === "object" &&
              Object.keys(this.authStore.user.Candidates).length === 0) ||
            (Array.isArray(this.authStore.user.Candidates) &&
              this.authStore.user.Candidates.length === 0)
          ) {
            redirectPath = "/create-candidate"; // Chưa có hồ sơ ứng viên
          } else {
            redirectPath = this.$route.query.redirect || "/"; // Có hồ sơ
          }
        } else if (userInfo.role === "employer") {
          if (
            !this.authStore.Employers ||
            (typeof this.authStore.Employers === "object" &&
              Object.keys(this.authStore.Employers).length === 0)
          ) {
            redirectPath = "/create-employer-profile"; // Chưa có hồ sơ nhà tuyển dụng
          } else {
            redirectPath =
              this.$route.query.redirect || "/employer-dashboard/employer-info"; // Có hồ sơ
          }
        } else {
          redirectPath = this.$route.query.redirect || "/"; // Vai trò khác
        }

        // Điều hướng người dùng
        await this.$router.push(redirectPath);
      } catch (error) {
        console.error("Đăng nhập thất bại:", error);
        // Toast đã được hiển thị trong store, không cần hiển thị lại
      }
    },
    loginWithGoogle() {
      // Xử lý đăng nhập bằng Google (có thể tích hợp Firebase hoặc OAuth)
      console.log("Login with Google");
    },
  },
});
</script>

<style scoped>
/* Container styles */
.login-container {
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

.mobile-logo {
  width: 130px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.mobile-logo:hover {
  transform: scale(1.05);
}

/* Title styling */
.title-text {
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 15px;
}

.title-text:after {
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
.login-form .form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 15px;
}

.login-form .input-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.login-form .input-group-text {
  background-color: white;
  border: none;
  color: #6c757d;
  border-right: 1px solid #f0f0f0;
  padding: 0.75rem 1rem;
}

.login-form .form-control {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 15px;
  height: auto;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.login-form .form-control:focus {
  box-shadow: none;
  background-color: #f9f9f9;
}

.login-form .input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
}

/* Password toggle */
.password-toggle {
  position: relative;
}

.password-eye {
  cursor: pointer;
  background-color: white !important;
  border: none !important;
  border-left: 1px solid #f0f0f0 !important;
}

.password-eye:hover {
  color: #007bff;
}

/* Forgot password link */
.forgot-link {
  color: #6c757d;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #007bff;
  text-decoration: underline;
}

/* Buttons */
.login-btn {
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #0069d9, #004494);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  transform: translateY(-2px);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Separator */
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.separator span {
  padding: 0 15px;
  color: #6c757d;
  font-size: 14px;
}

/* Google button */
.btn-google {
  background-color: white;
  border: 1px solid #ced4da;
  color: #333;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-google:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #dc3545;
  color: #dc3545;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Register prompt */
.register-prompt {
  font-size: 15px;
  color: #6c757d;
}

.register-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.2s;
}

.register-link:hover {
  text-decoration: underline;
  color: #0056b3;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .form-center {
    background-color: white;
    padding: 15px;
  }

  .form-content {
    box-shadow: none;
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .title-text {
    font-size: 1.5rem;
  }

  .login-btn,
  .btn-google {
    padding: 0.6rem 1rem !important;
  }
}
</style>
