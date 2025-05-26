<template>
  <div class="row g-0 otp-container">
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
            <img src="@/assets/logo/logo.svg" alt="Logo" style="width: 130px" />
          </div>

          <h2 class="mb-4 text-center">Xác Minh Tài Khoản</h2>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <label class="form-label fw-bold me-2">Xác nhận OTP: </label>
                <input
                  type="text"
                  class="form-control"
                  style="width: 150px"
                  v-model="otp"
                  maxlength="6"
                  required
                />
              </div>
              <button
                type="button"
                class="btn btn-secondary"
                @click="resendOTP"
                :disabled="isResendDisabled"
              >
                {{ resendButtonText }}
              </button>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2 mb-3 fw-bold"
            >
              Xác nhận
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
import { toast } from "vue3-toastify";
import { verifyEmailApi } from "@apis/auth";
export default {
  name: "VerifyOTP",
  data() {
    return {
      otp: "",
      email: this.$route.query.email,
      isResendDisabled: false,
      resendCountdown: 60,
      resendButtonText: "Gửi lại OTP",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        console.log("Gửi request xác nhận OTP...");
        const response = await verifyEmailApi({
          email: this.email,
          otp: this.otp,
        });

        console.log("Response nhận được:", response); // Kiểm tra phản hồi từ API
        console.log("Response nhận được:", response); // Kiểm tra phản hồi từ API
        toast.success(response?.message, { autoClose: 5000 });

        // Kiểm tra nếu response trả về thành công
        if (response?.status === "success") {
          console.log("Xác thực thành công, chuyển hướng đến login...");
          this.$router.push("/login");
        } else {
          console.warn("Xác thực không thành công, response:", response);
        }
      } catch (error) {
        console.error("Lỗi khi xác nhận OTP:", error);
        toast.error(error.response?.data?.message || "Mã OTP không hợp lệ!");
      }
    },
    resendOTP() {
      // Gửi lại OTP
      console.log("Yêu cầu gửi lại OTP");

      // Gọi API gửi lại OTP
      // this.$store.dispatch('auth/resendOTP')
      //   .then(() => {
      //     this.startResendCountdown();
      //   });

      // Tạm thời bật đếm ngược
      this.startResendCountdown();
    },
    startResendCountdown() {
      this.isResendDisabled = true;
      this.resendCountdown = 60;

      const timer = setInterval(() => {
        this.resendCountdown--;
        this.resendButtonText = `Gửi lại sau (${this.resendCountdown}s)`;

        if (this.resendCountdown <= 0) {
          clearInterval(timer);
          this.isResendDisabled = false;
          this.resendButtonText = "Gửi lại OTP";
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
/* Container styles */
.otp-container {
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

/* Mobile logo */
.d-lg-none img {
  width: 130px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.d-lg-none img:hover {
  transform: scale(1.05);
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
  margin-bottom: 0;
  font-size: 15px;
}

.form-control {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 15px;
  border: none;
  background-color: #f8f9fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.form-control:focus {
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  background-color: #fff;
}

/* OTP input styling */
input[type="text"] {
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-align: center;
  font-weight: 600;
}

/* Resend button */
.btn-secondary {
  background: linear-gradient(90deg, #6c757d, #5a6268);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.6rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(108, 117, 125, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(90deg, #5a6268, #495057);
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
  transform: translateY(-1px);
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Confirm button */
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
  margin-top: 1.5rem;
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

  .btn-primary,
  .btn-secondary {
    padding: 0.6rem 1rem !important;
  }

  /* Điều chỉnh layout cho mobile */
  .mb-3.d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .mb-3.d-flex .btn-secondary {
    margin-top: 1rem;
    width: 100%;
  }

  .d-flex.align-items-center {
    width: 100%;
    flex-direction: column;
    align-items: flex-start !important;
  }

  .form-control {
    width: 100% !important;
    margin-top: 0.5rem;
  }
}
</style>
