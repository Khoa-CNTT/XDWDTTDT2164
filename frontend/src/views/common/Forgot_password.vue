<template>
  <div class="row g-0 forgot-password-container">
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

          <h2 class="title-text mb-4 text-center">Quên Mật Khẩu</h2>

          <p class="text-center text-muted mb-4">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác nhận để thiết
            lập lại mật khẩu.
          </p>

          <form @submit.prevent="handleSubmit" class="forgot-form">
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

            <button
              type="submit"
              class="btn btn-primary w-100 py-3 mb-4 submit-btn"
              :disabled="isSubmitting"
            >
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Gửi yêu cầu
            </button>

            <div class="text-center back-link">
              <router-link to="/login" class="btn-back">
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
import { forgotPasswordApi } from "@apis/user";
import { toast } from "vue3-toastify";

export default {
  name: "ForgotPassword",
  data() {
    return {
      form: {
        email: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.form.email) return;

      this.isSubmitting = true;
      try {
        const response = await forgotPasswordApi({ email: this.form.email });
        if (response.status === "success") {
          toast.success("Mã xác nhận đã được gửi đến email của bạn", {
            autoClose: 3000,
          });
          this.$router.push("/login");
        } else {
          toast.error(response.message || "Lỗi khi gửi mã xác nhận");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi gửi mã xác nhận");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Container styles */
.forgot-password-container {
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}

/* Left side image styles */
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
  margin-bottom: 1rem;
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
  background: linear-gradient(90deg, #1967d2, #4285f4);
  border-radius: 3px;
}

/* Form styles */
.forgot-form .form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 15px;
}

.forgot-form .input-group {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.forgot-form .input-group-text {
  background-color: white;
  border: none;
  color: #6c757d;
  border-right: 1px solid #f0f0f0;
  padding: 0.75rem 1rem;
}

.forgot-form .form-control {
  border: none;
  padding: 0.75rem 1rem;
  font-size: 15px;
  height: auto;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.forgot-form .form-control:focus {
  box-shadow: none;
  background-color: #f9f9f9;
}

.forgot-form .input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(25, 103, 210, 0.15);
}

/* Submit button */
.submit-btn {
  background: linear-gradient(90deg, #1967d2, #4285f4);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(25, 103, 210, 0.2);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #0d5bba, #3367d6);
  box-shadow: 0 6px 15px rgba(25, 103, 210, 0.3);
  transform: translateY(-2px);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Back to login link */
.back-link {
  margin-top: 1rem;
}

.btn-back {
  color: #1967d2;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
}

.btn-back:hover {
  background-color: #f0f7ff;
  color: #0d5bba;
  text-decoration: none;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .form-center {
    background-color: white;
    padding: 15px;
  }

  .form-content {
    box-shadow: none;
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .title-text {
    font-size: 1.5rem;
  }

  .submit-btn {
    padding: 0.6rem 1rem !important;
  }

  .form-content {
    padding: 1rem;
  }
}
</style>
