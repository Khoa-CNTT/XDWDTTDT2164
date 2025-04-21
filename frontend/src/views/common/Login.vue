<template>
  <div class="row g-0 login-container">
    <div class="col-lg-5 d-none d-lg-block">
      <div class="image-container">
        <img
          src="@/assets/images/12.jpg"
          class="login-image"
          alt="Login Background"
        />
        <img
          src="@/assets/logo/logo-2.svg"
          class="logo-overlay"
          alt="Logo"
          style="width: 150px; position: absolute; top: 20px; left: 20px"
        />
      </div>
    </div>
    <div class="col-lg-7 col-md-12">
      <div class="form-center">
        <div class="form-content">
          <div class="d-lg-none text-center mb-5">
            <img src="@/assets/logo/logo.svg" alt="Logo" style="width: 130px" />
          </div>

          <h2 class="mb-4 text-center">Đăng nhập</h2>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="form-label fw-bold">Email</label>
              <input
                type="email"
                class="form-control py-2"
                placeholder="Nhập email"
                v-model="form.email"
                required
              />
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
                />
                <i
                  @click.prevent="togglePasswordVisibility"
                  :class="[
                    'fas',
                    isPasswordVisible ? 'fa-eye' : 'fa-eye-slash',
                  ]"
                ></i>
              </div>
              <div class="text-end mt-2">
                <router-link to="/forgot-password" class="text-decoration-none"
                  >Quên mật khẩu?</router-link
                >
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 py-2 mb-3 fw-bold"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading">
                <i class="fas fa-spinner fa-spin me-2"></i>Đang đăng nhập...
              </span>
              <span v-else>Đăng nhập</span>
            </button>

            <div class="text-center mb-4">
              Bạn chưa có tài khoản?
              <router-link to="/register" class="text-decoration-none fw-bold"
                >Đăng ký ngay</router-link
              >
            </div>

            <button
              type="button"
              class="btn btn-outline-danger w-100 py-2"
              @click="loginWithGoogle"
              :disabled="authStore.isLoading"
            >
              <i class="fab fa-google me-2"></i>
              Đăng nhập với Google
            </button>
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
        const redirectPath =
          this.$route.query.redirect ||
          (userInfo?.role === "admin" ? "/admin-dashboard/admin-starter" : "/");

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
.login-container {
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

.btn-primary:disabled {
  opacity: 0.65;
}
</style>
