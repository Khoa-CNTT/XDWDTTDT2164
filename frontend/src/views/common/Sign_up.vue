<template>
    <div class="row g-0 signup-container">
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
  
            <h2 class="mb-4 text-center">Tạo Tài Khoản</h2>
  
            <!-- Role selection buttons -->
            <div class="row mb-4">
              <div class="col-lg-6">
                <button 
                  class="btn text-light text-center align-middle py-2 mb-2 w-100" 
                  :class="{'active-role': form.role === 'candidate'}"
                  style="background-color: #34a853"
                  @click="setRole('candidate')"
                >
                  <i class="fa-solid fa-user me-2"></i> Ứng Viên
                </button>
              </div>
              <div class="col-lg-6">
                <button 
                  class="btn btn-outline-primary text-center py-2 mb-2 w-100"
                  :class="{'active-role': form.role === 'employer'}"
                  @click="setRole('employer')"
                >
                  <i class="fa-solid fa-briefcase me-2"></i> Nhà tuyển dụng
                </button>
              </div>
            </div>
  
            <form @submit.prevent="handleSignUp">
              <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input 
                  type="email" 
                  class="form-control py-2" 
                  placeholder="Nhập email" 
                  v-model="form.email"
                  required
                >
              </div>
  
              <div class="mb-3">
                <label class="form-label fw-bold">Họ và Tên</label>
                <input 
                  type="text" 
                  class="form-control py-2" 
                  placeholder="Nhập họ và tên" 
                  v-model="form.fullName"
                  required
                >
              </div>
  
              <div class="mb-3">
                <label class="form-label fw-bold">Mật khẩu</label>
                <div class="password-toggle">
                  <input 
                    :type="isPasswordVisible ? 'text' : 'password'" 
                    class="form-control py-2" 
                    placeholder="Nhập mật khẩu" 
                    v-model="form.password"
                    required
                  >
                  <i 
                    @click.prevent="togglePasswordVisibility" 
                    :class="['fas', isPasswordVisible ? 'fa-eye' : 'fa-eye-slash']"
                  ></i>
                </div>
              </div>
  
              <button type="submit" class="btn btn-primary w-100 py-2 mb-3 fw-bold">
                Đăng Ký
              </button>
  
              <div class="text-center mb-4">
                Bạn đã có tài khoản?
                <router-link to="/login" class="text-decoration-none fw-bold">Đăng nhập ngay</router-link>
              </div>
  
              <button 
                type="button" 
                class="btn btn-outline-danger w-100 py-2"
                @click="signUpWithGoogle"
              >
                <i class="fab fa-google me-2"></i>
                Đăng ký với Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignUpPage',
    data() {
      return {
        isPasswordVisible: false,
        form: {
          role: 'candidate', // Mặc định chọn ứng viên
          email: '',
          fullName: '',
          password: ''
        }
      }
    },
    methods: {
      togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible
      },
      setRole(role) {
        this.form.role = role
      },
      handleSignUp() {
        // Xử lý logic đăng ký
        console.log('Sign up data:', this.form)
        // Gọi API đăng ký ở đây
        // this.$store.dispatch('auth/register', this.form)
      },
      signUpWithGoogle() {
        // Xử lý đăng ký bằng Google
        console.log('Sign up with Google')
      }
    }
  }
  </script>
  
  <style scoped>
  .signup-container {
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
  
  .btn-outline-danger {
    border-color: #dc3545;
    color: #dc3545;
  }
  
  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
  }
  
  .active-role {
    border: 2px solid #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  </style>