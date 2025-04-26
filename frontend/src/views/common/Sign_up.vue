<template>
  <div class="row g-0 signup-container">
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
          <div class="d-lg-none text-center mb-4">
            <img src="@/assets/logo/logo.svg" alt="Logo" class="mobile-logo" />
          </div>

          <h2 class="title-text mb-4 text-center">Tạo Tài Khoản</h2>

          <!-- Role selection buttons -->
          <div class="role-container mb-4">
            <div class="row g-3">
              <div class="col-md-6">
                <button
                  class="role-btn candidate-btn w-100"
                  :class="{ 'active-role': form.role === 'candidate' }"
                  @click="setRole('candidate')"
                >
                  <i class="fa-solid fa-user role-icon"></i>
                  <span>Ứng Viên</span>
                </button>
              </div>
              <div class="col-md-6">
                <button
                  class="role-btn employer-btn w-100"
                  :class="{ 'active-role': form.role === 'employer' }"
                  @click="setRole('employer')"
                >
                  <i class="fa-solid fa-briefcase role-icon"></i>
                  <span>Nhà tuyển dụng</span>
                </button>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="mb-3">
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
              <label class="form-label">Họ và Tên</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ và tên của bạn"
                  v-model="form.fullName"
                  required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Số điện thoại</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-phone-alt"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập số điện thoại của bạn"
                  v-model="form.phoneNumber"
                  required
                />
              </div>
            </div>

            <div class="mb-4">
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
              <small class="text-muted mt-1"
                >Mật khẩu phải có ít nhất 6 ký tự</small
              >
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-3 mb-4 signup-btn"
            >
              <i class="fas fa-user-plus me-2"></i>Đăng Ký
            </button>

            <div class="separator mb-4">
              <span>hoặc</span>
            </div>

            <button
              type="button"
              class="btn btn-google w-100 py-3 mb-4"
              @click="signUpWithGoogle"
            >
              <i class="fab fa-google me-2"></i>
              Đăng ký với Google
            </button>

            <div class="text-center login-prompt">
              Bạn đã có tài khoản?
              <router-link to="/login" class="login-link"
                >Đăng nhập ngay</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { registerApi } from "@apis/auth";
export default {
  name: "SignUpPage",
  data() {
    return {
      isPasswordVisible: false,
      form: {
        role: "candidate", // Mặc định chọn ứng viên
        email: "",
        phoneNumber: "",
        fullName: "",
        password: "",
      },
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    setRole(role) {
      this.form.role = role;
    },
    async handleSignUp() {
      try {
        const response = await registerApi(this.form);
        toast.success(response?.message, { autoClose: 5000 });
        // Chuyển hướng đến trang xác nhận OTP
        if (response?.status === "success") {
          this.$router.push({
            path: "/otp",
            query: { email: this.form.email },
          });
        }
      } catch (error) {
        const messages = error.response?.data?.data;
        // Kiểm tra nếu `messages` là một mảng, hiển thị từng lỗi
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            toast.error(msg.message, { autoClose: 3000 });
          });
        } else {
          toast.error(messages || "Có lỗi xảy ra", { autoClose: 3000 });
        }
      }
    },
    signUpWithGoogle() {
      // Xử lý đăng ký bằng Google
      console.log("Sign up with Google");
    },
  },
};
</script>

<style scoped>
/* Container styles */
.signup-container {
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
  min-height: 100vh;
  padding: 40px 30px;
  background-color: #fbfbfb;
}

.form-content {
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.form-content:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(90deg, #0d6efd, #6610f2);
  border-radius: 3px;
}

/* Role selection buttons */
.role-container {
  margin-bottom: 2rem;
}

.role-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0.5rem;
  border-radius: 12px;
  border: 2px solid transparent;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  font-weight: 600;
  cursor: pointer;
  gap: 10px;
}

.candidate-btn {
  color: #34a853;
}

.employer-btn {
  color: #4285f4;
}

.role-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.role-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.active-role.candidate-btn {
  border-color: #34a853;
  background-color: rgba(52, 168, 83, 0.1);
  box-shadow: 0 0 0 0.25rem rgba(52, 168, 83, 0.25);
}

.active-role.employer-btn {
  border-color: #4285f4;
  background-color: rgba(66, 133, 244, 0.1);
  box-shadow: 0 0 0 0.25rem rgba(66, 133, 244, 0.25);
}

/* Form styling */
.signup-form .form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 15px;
}

.signup-form .input-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.signup-form .input-group-text {
  background-color: white;
  border: none;
  color: #6c757d;
  border-right: 1px solid #f0f0f0;
  padding: 0.75rem 1rem;
}

.signup-form .form-control {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 15px;
  height: auto;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.signup-form .form-control:focus {
  box-shadow: none;
  background-color: #f9f9f9;
}

.signup-form .input-group:focus-within {
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
  color: #0d6efd;
}

/* Small text */
.text-muted {
  display: block;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 5px;
}

/* Buttons */
.signup-btn {
  background: linear-gradient(90deg, #0d6efd, #0a58ca);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
  transition: all 0.3s ease;
}

.signup-btn:hover {
  background: linear-gradient(90deg, #0b5ed7, #0a4fb8);
  box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
  transform: translateY(-2px);
}

.signup-btn:active {
  transform: translateY(0);
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

.btn-google:hover {
  background-color: #f8f9fa;
  border-color: #dc3545;
  color: #dc3545;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Login prompt */
.login-prompt {
  font-size: 15px;
  color: #6c757d;
}

.login-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.2s;
}

.login-link:hover {
  text-decoration: underline;
  color: #0a58ca;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .form-center {
    background-color: white;
    padding: 20px 15px;
    align-items: flex-start;
    overflow-y: auto;
  }

  .form-content {
    box-shadow: none;
    padding: 1.5rem 1rem;
    margin: 20px 0;
  }
}

@media (max-width: 576px) {
  .title-text {
    font-size: 1.5rem;
  }

  .role-btn {
    padding: 1rem 0.5rem;
  }

  .signup-btn,
  .btn-google {
    padding: 0.6rem 1rem !important;
  }
}

@media (max-height: 800px) and (min-width: 992px) {
  .form-center {
    align-items: flex-start;
    overflow-y: auto;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .form-content {
    margin: 20px 0;
  }
}
</style>
