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
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo/logo-2.svg" class="logo-overlay" alt="Logo" />
        </router-link>
      </div>
    </div>
    <div class="col-lg-7 col-md-12">
      <div class="form-center">
        <div class="form-content">
          <div class="d-lg-none text-center mb-4">
            <router-link to="/" class="logo-link">
              <img
                src="@/assets/logo/logo.svg"
                alt="Logo"
                class="mobile-logo"
              />
            </router-link>
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
              <div class="input-group password-input-group">
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
                <button
                  type="button"
                  class="input-group-text password-toggle-btn"
                  @click="togglePasswordVisibility"
                >
                  <i
                    :class="[
                      'fas',
                      isPasswordVisible ? 'fa-eye' : 'fa-eye-slash',
                    ]"
                  ></i>
                </button>
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
        role: "candidate", // Default to candidate
        email: "",
        phoneNumber: "",
        fullName: "",
        password: "",
      },
      errors: {
        role: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
      },
      isSubmitting: false, // Track form submission state
    };
  },
  computed: {
    passwordStrength() {
      const password = this.form.password.trim();
      if (!password) return { text: "", class: "" };

      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasDigit = /\d/.test(password);
      const hasSpecial = /[@$!%*?&]/.test(password);
      const lengthValid = password.length >= 6;

      const strengthScore = [
        hasLower,
        hasUpper,
        hasDigit,
        hasSpecial,
        lengthValid,
      ].filter(Boolean).length;

      if (strengthScore <= 2) {
        return { text: "Yếu", class: "text-danger" };
      } else if (strengthScore <= 4) {
        return { text: "Trung bình", class: "text-warning" };
      } else {
        return { text: "Mạnh", class: "text-success" };
      }
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    setRole(role) {
      this.form.role = role;
      this.errors.role = ""; // Clear role error when role is selected
    },
    validateForm() {
      // Reset errors
      this.errors = {
        role: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
      };

      let isValid = true;

      // Role validation
      if (!["candidate", "employer"].includes(this.form.role)) {
        this.errors.role =
          "Vui lòng chọn vai trò (Ứng viên hoặc Nhà tuyển dụng).";
        isValid = false;
      }

      // Email validation
      const email = this.form.email.trim();
      if (!email) {
        this.errors.email = "Vui lòng nhập email.";
        isValid = false;
      } else if (email.length > 255) {
        this.errors.email = "Email không được vượt quá 255 ký tự.";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.errors.email = "Vui lòng nhập email hợp lệ.";
        isValid = false;
      }

      // Full name validation
      const fullName = this.form.fullName.trim();
      if (!fullName) {
        this.errors.fullName = "Vui lòng nhập họ và tên.";
        isValid = false;
      } else if (fullName.length < 2) {
        this.errors.fullName = "Họ và tên phải có ít nhất 2 ký tự.";
        isValid = false;
      } else if (fullName.length > 100) {
        this.errors.fullName = "Họ và tên không được vượt quá 100 ký tự.";
        isValid = false;
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
        this.errors.fullName =
          "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
        isValid = false;
      }

      // Phone number validation (Vietnamese format)
      const phoneNumber = this.form.phoneNumber.trim();
      if (!phoneNumber) {
        this.errors.phoneNumber = "Vui lòng nhập số điện thoại.";
        isValid = false;
      } else if (phoneNumber.length > 10) {
        this.errors.phoneNumber = "Số điện thoại không được vượt quá 10 ký tự.";
        isValid = false;
      } else if (!/^(0|\+84)[0-9]{9,10}$/.test(phoneNumber)) {
        this.errors.phoneNumber = "Vui lòng nhập số điện thoại hợp lệ.";
        isValid = false;
      }

      // Password validation
      const password = this.form.password.trim();
      if (!password) {
        this.errors.password = "Vui lòng nhập mật khẩu.";
        isValid = false;
      } else if (password.length < 6) {
        this.errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        isValid = false;
      } else if (password.length > 128) {
        this.errors.password = "Mật khẩu không được vượt quá 128 ký tự.";
        isValid = false;
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          password
        )
      ) {
        this.errors.password =
          "Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái thường, một số và một ký tự đặc biệt.";
        isValid = false;
      }

      return isValid;
    },
    async handleSignUp() {
      if (this.isSubmitting) return;

      // Validate form
      if (!this.validateForm()) {
        // Display first error as a toast
        const firstError = Object.values(this.errors).find((error) => error);
        if (firstError) {
          toast.error(firstError, { autoClose: 3000 });
        }
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await registerApi({
          ...this.form,
          email: this.form.email.trim(),
          fullName: this.form.fullName.trim(),
          phoneNumber: this.form.phoneNumber.trim(),
          password: this.form.password.trim(),
        });
        toast.success(response?.message || "Đăng ký thành công!", {
          autoClose: 5000,
        });

        // Redirect to OTP page
        if (response?.status === "success") {
          this.$router.push({
            path: "/otp",
            query: { email: this.form.email.trim() },
          });
        }
      } catch (error) {
        console.log(error);
        const messages = error.response?.data?.data;
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            toast.error(msg.message, { autoClose: 3000 });
          });
        } else {
          toast.error(error.response.data.message || "Có lỗi xảy ra", {
            autoClose: 3000,
          });
        }
      } finally {
        this.isSubmitting = false;
      }
    },
    signUpWithGoogle() {
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

/* Logo link styling */
.logo-link {
  position: absolute;
  top: 30px;
  left: 30px;
  display: inline-block;
  transition: transform 0.3s ease;
  text-decoration: none;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-overlay {
  width: 150px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.mobile-logo {
  width: 130px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.mobile-logo:hover {
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: white;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.signup-form .input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  border-color: #0d6efd;
}

.signup-form .input-group-text {
  background-color: #f8f9fa;
  border: none;
  border-right: 1px solid #e9ecef;
  color: #6c757d;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  margin: 0;
}

.signup-form .form-control {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 15px;
  height: 48px;
  background-color: white;
  flex: 1;
  outline: none;
  box-shadow: none;
}

.signup-form .form-control:focus {
  background-color: #f9f9f9;
  box-shadow: none;
  outline: none;
}

/* Password input group specific styling */
.password-input-group {
  position: relative;
}

.password-toggle-btn {
  background-color: #f8f9fa;
  border: none;
  border-left: 1px solid #e9ecef;
  color: #6c757d;
  cursor: pointer;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  transition: all 0.2s ease;
  margin: 0;
}

.password-toggle-btn:hover {
  background-color: #e9ecef;
  color: #0d6efd;
}

.password-toggle-btn:focus {
  outline: none;
  box-shadow: none;
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

  .logo-link {
    position: static;
    display: inline-block;
  }
}

@media (max-width: 576px) {
  .title-text {
    font-size: 1.5rem;
  }

  .role-btn {
    padding: 1rem 0.5rem;
  }

  .signup-btn {
    padding: 0.6rem 1rem !important;
  }

  .signup-form .input-group-text,
  .password-toggle-btn {
    min-width: 40px;
    padding: 0.5rem 0.75rem;
  }

  .signup-form .form-control {
    height: 40px;
    padding: 0.5rem 0.75rem;
    font-size: 14px;
  }

  .signup-form .input-group-text,
  .password-toggle-btn {
    height: 40px;
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
