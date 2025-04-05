<template>
    <div class="row g-0 reset-password-container">
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
  
            <h2 class="mb-4 text-center">Đặt Lại Mật Khẩu</h2>
  
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label class="form-label fw-bold">Nhập mật khẩu mới</label>
                <div class="password-toggle">
                  <input 
                    :type="isPasswordVisible ? 'text' : 'password'" 
                    class="form-control py-2" 
                    placeholder="Nhập mật khẩu mới" 
                    v-model="form.newPassword"
                    required
                  >
                  <i 
                    @click.prevent="togglePasswordVisibility" 
                    :class="['fas', isPasswordVisible ? 'fa-eye' : 'fa-eye-slash']"
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
                  >
                  <i 
                    @click.prevent="togglePasswordVisibility" 
                    :class="['fas', isPasswordVisible ? 'fa-eye' : 'fa-eye-slash']"
                  ></i>
                </div>
                <small v-if="!passwordMatch" class="text-danger">Mật khẩu không khớp</small>
              </div>
  
              <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
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
  export default {
    name: 'ResetPassword',
    data() {
      return {
        isPasswordVisible: false,
        form: {
          newPassword: '',
          confirmPassword: ''
        }
      }
    },
    computed: {
      passwordMatch() {
        return this.form.newPassword === this.form.confirmPassword || 
               this.form.confirmPassword === ''
      }
    },
    methods: {
      togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible
      },
      handleSubmit() {
        if (!this.passwordMatch) {
          alert('Vui lòng nhập mật khẩu khớp nhau');
          return;
        }
        
        // Gọi API đặt lại mật khẩu
        console.log('Mật khẩu mới:', this.form.newPassword);
        
        // Ví dụ gọi API:
        // this.$store.dispatch('auth/resetPassword', {
        //   token: this.$route.query.token, // Lấy token từ URL
        //   newPassword: this.form.newPassword
        // })
        // .then(() => {
        //   this.$router.push('/login?reset=success');
        // })
        // .catch(error => {
        //   console.error('Lỗi đặt lại mật khẩu:', error);
        // });
        
        // Tạm thời chuyển hướng (sau này thay bằng API)
        this.$router.push('/login?reset=success');
      }
    }
  }
  </script>
  
  <style scoped>
  .reset-password-container {
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
  
  .password-toggle {
    position: relative;
  }
  
  .password-toggle i {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
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