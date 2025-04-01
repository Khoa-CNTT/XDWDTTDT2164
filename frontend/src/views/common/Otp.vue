<template>
    <div class="row g-0 otp-container">
      <div class="col-lg-5 d-none d-lg-block">
        <div class="image-container">
          <img src="@/assets/images/12.jpg" class="login-image" alt="Login Background">
          <img src="@/assets/logo/logo-2.svg" class="logo-overlay" alt="Logo"
               style="width: 150px; position: absolute; top: 20px; left: 20px;">
        </div>
      </div>
      <div class="col-lg-7 col-md-12">
        <div class="form-center">
          <div class="form-content">
            <div class="d-lg-none text-center mb-5">
              <img src="@/assets/logo/logo.svg" alt="Logo" style="width: 130px;">
            </div>
  
            <h2 class="mb-4 text-center">Xác Minh Tài Khoản</h2>
  
            <form @submit.prevent="handleSubmit">
              <div class="mb-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <label class="form-label fw-bold me-2">Xác nhận OTP: </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    style="width: 150px;" 
                    v-model="otp"
                    maxlength="6"
                    required
                  >
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
  
              <button type="submit" class="btn btn-primary w-100 py-2 mb-3 fw-bold">
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
  export default {
    name: 'VerifyOTP',
    data() {
      return {
        otp: '',
        isResendDisabled: false,
        resendCountdown: 60,
        resendButtonText: 'Gửi lại OTP'
      }
    },
    methods: {
      handleSubmit() {
        // Xử lý xác nhận OTP
        console.log('OTP đã nhập:', this.otp);
        
        // Gọi API xác nhận OTP
        // this.$store.dispatch('auth/verifyOTP', { otp: this.otp })
        //   .then(() => {
        //     this.$router.push('/reset-password');
        //   })
        //   .catch(error => {
        //     console.error('Lỗi xác nhận OTP:', error);
        //   });
        
        // Tạm thời chuyển hướng (sau này thay bằng API)
        this.$router.push('/reset-password');
      },
      resendOTP() {
        // Gửi lại OTP
        console.log('Yêu cầu gửi lại OTP');
        
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
            this.resendButtonText = 'Gửi lại OTP';
          }
        }, 1000);
      }
    }
  }
  </script>
  
  <style scoped>
  .otp-container {
    min-height: 100vh;
  }
  
  .image-container {
    position: relative;
    height: 100%;
  }
  
  .login-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .form-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
  }
  
  .form-content {
    max-width: 450px;
    width: 100%;
  }
  
  .btn-primary {
    background-color: #1967d2;
    border-color: #1967d2;
  }
  
  .btn-primary:hover {
    background-color: #0d5bba;
    border-color: #0d5bba;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
  }
  
  .btn-secondary:disabled {
    opacity: 0.65;
  }
  </style>