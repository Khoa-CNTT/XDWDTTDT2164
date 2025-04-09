<template>
    <div class="row g-0 forgot-password-container">
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
  
            <h2 class="mb-4 text-center">Quên Mật Khẩu</h2>
  
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label class="form-label fw-bold">Email</label>
                <input 
                  type="email" 
                  class="form-control py-2" 
                  placeholder="Nhập email" 
                  v-model="form.email"
                  required
                >
              </div>
  
              <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
                Gửi mã xác nhận
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
    name: 'ForgotPassword',
    data() {
      return {
        form: {
          email: ''
        }
      }
    },
    methods: {
      handleSubmit() {
        // Xử lý gửi mã xác nhận
        console.log('Email đã nhập:', this.form.email);
        
        // Gọi API ở đây
        // this.$store.dispatch('auth/forgotPassword', this.form)
        //   .then(() => {
        //     this.$router.push('/verify-code');
        //   })
        //   .catch(error => {
        //     console.error('Lỗi:', error);
        //   });
        
        // Tạm thời chuyển hướng (sau này thay bằng API)
        this.$router.push('/verify-code');
      }
    }
  }
  </script>
  
  <style scoped>
  .forgot-password-container {
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
  </style>