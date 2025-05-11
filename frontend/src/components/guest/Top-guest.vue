<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid navbar-container">
      <a class="logo" href="/">
        <img
          src="/src/assets/logo/logo.svg"
          alt="Superio"
          width="150"
          height="auto"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/"
              >Trang chủ</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/list"
              >Việc làm</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/list-company"
              >Công Ty
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/about"
              >Giới Thiệu
            </router-link>
          </li>
        </ul>

        <!-- Guest view - Only shown when not logged in -->
        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="login-button">
            Đăng nhập / Đăng ký
          </router-link>
        </div>

        <!-- Logged in user view -->
        <div class="user-menu-container" v-else>
          <div class="user-menu-trigger" @click="toggleUserMenu">
            <div class="user-avatar">
              <img
                v-if="userAvatar"
                :src="getCompanyLogo(userAvatar)"
                alt="User avatar"
              />
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
            <div class="user-info">
              <span class="user-greeting">Xin chào,</span>
              <span class="user-name">{{ userName }}</span>
            </div>
            <i class="dropdown-icon fas fa-chevron-down"></i>
          </div>

          <div class="user-dropdown" :class="{ 'show-dropdown': isMenuOpen }">
            <div class="dropdown-header">
              <div class="user-avatar">
                <img
                  v-if="userAvatar"
                  :src="getCompanyLogo(userAvatar)"
                  alt="User avatar"
                />
                <div v-else class="avatar-placeholder">
                  {{ userInitials }}
                </div>
              </div>
              <div class="dropdown-user-info">
                <span class="dropdown-user-name">{{ userName }}</span>
                <span class="dropdown-user-email">{{
                  authStore.user?.email || "N/A"
                }}</span>
              </div>
            </div>
            <ul class="dropdown-menu-items">
              <template v-if="authStore.user?.role === 'candidate'">
                <li class="dropdown-item">
                  <router-link to="/candidate-dashboard/candidate-test">
                    <i class="fas fa-user"></i>
                    <span>Hồ sơ cá nhân</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/candidate-dashboard/candidate-jobs">
                    <i class="fas fa-bookmark"></i>
                    <span>Công việc đã lưu</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/candidate-dashboard/candidate-apply">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Công việc đã ứng tuyển</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/candidate-dashboard/candidate-password">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Thay đổi mật khẩu</span>
                  </router-link>
                </li>
              </template>
              <template v-else-if="authStore.user?.role === 'employer'">
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-info">
                    <i class="fas fa-users"></i>
                    <span>Hồ sơ công ty</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-recharge">
                    <i class="fa-solid fa-wallet"></i>
                    <span>Nạp tiền vào tài khoản</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-deposithistory">
                    <i class="fa-solid fa-wallet"></i>
                    <span>Lịch sử nạp tiền</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-paymenthistory">
                    <i class="fa-solid fa-wallet"></i>
                    <span>Lịch sử thanh toán</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-newjob">
                    <i class="fa-solid fa-play"></i>
                    <span>Thêm mới công việc</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-workmanagement">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <span>Quản lý bài đăng công việc</span>
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <router-link to="/employer-dashboard/employer-password">
                    <i class="fa-solid fa-lock"></i>
                    <span>Thay đổi mật khẩu</span>
                  </router-link>
                </li>
              </template>
              <template v-else-if="authStore.user?.role === 'admin'">
                <li class="dropdown-item">
                  <router-link to="/admin-dashboard/admin-starter">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                  </router-link>
                </li>
              </template>
              <li class="dropdown-divider"></li>
              <li class="dropdown-item logout-item">
                <button @click="logout" class="logout-button">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    return {
      authStore,
      router,
    };
  },
  computed: {
    userName() {
      if (!this.authStore.isAuthenticated || !this.authStore.user) {
        return "N/A";
      }
      if (
        this.authStore.user.role === "candidate" &&
        this.authStore.user.Candidates
      ) {
        return this.authStore.user.Candidates.fullName || "Ứng viên";
      }
      if (
        this.authStore.user.role === "employer" &&
        this.authStore.user.Employers
      ) {
        return this.authStore.user.Employers.companyName || "Nhà tuyển dụng";
      }
      return "Admin";
    },
    userAvatar() {
      if (!this.authStore.isAuthenticated || !this.authStore.user) {
        return null;
      }
      if (
        this.authStore.user.role === "candidate" &&
        this.authStore.user.Candidates
      ) {
        return this.authStore.user.Candidates.avatar || null;
      }
      if (
        this.authStore.user.role === "employer" &&
        this.authStore.user.Employers
      ) {
        return this.authStore.user.Employers.companyLogo || null;
      }
      return null;
    },
    userInitials() {
      const name = this.userName;
      if (
        name === "N/A" ||
        name === "Ứng viên" ||
        name === "Nhà tuyển dụng" ||
        name === "Admin"
      ) {
        return "NN";
      }
      const nameParts = name.split(" ");
      if (nameParts.length > 1) {
        return (
          nameParts[0][0] + nameParts[nameParts.length - 1][0]
        ).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
  },
  methods: {
    toggleUserMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async logout() {
      try {
        await this.authStore.logout();
        this.isMenuOpen = false;
        toast.success("Đăng xuất thành công!");
        this.router.push("/");
      } catch (error) {
        toast.error("Lỗi khi đăng xuất");
        console.error("Lỗi khi đăng xuất:", error);
      }
    },
    closeMenuOnOutsideClick(event) {
      const userMenu = this.$el.querySelector(".user-menu-container");
      if (userMenu && !userMenu.contains(event.target) && this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    },
    getCompanyLogo(logo) {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeMenuOnOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeMenuOnOutsideClick);
  },
};
</script>

<style>
/* Navbar styling */
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  padding: 15px 50px;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 2rem;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Navigation links */
.navbar-nav {
  display: flex;
  gap: 1.5rem;
  margin: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #333;
  font-weight: 500;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #4a6cf7;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #4a6cf7;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.router-link-active {
  color: #4a6cf7;
  font-weight: 600;
}

/* Auth buttons - Non-logged in state */
.auth-buttons {
  display: flex;
  align-items: center;
}

.login-button {
  background-color: white;
  color: #4a6cf7;
  border: 2px solid #4a6cf7;
  border-radius: 6px;
  padding: 8px 20px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #4a6cf7;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 108, 247, 0.2);
}

/* User menu - Logged in state */
.user-menu-container {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu-trigger:hover {
  background-color: #f0f4ff;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4a6cf7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-greeting {
  color: #555;
  font-size: 12px;
}

.user-name {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.dropdown-icon {
  color: #999;
  font-size: 12px;
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.isMenuOpen .dropdown-icon {
  transform: rotate(180deg);
}

/* User dropdown menu */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  overflow: hidden;
}

.show-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-user-name {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.dropdown-user-email {
  color: #777;
  font-size: 13px;
}

.dropdown-menu-items {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.dropdown-item {
  padding: 8px 15px;
}

.dropdown-item a,
.dropdown-item button {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  padding: 6px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item a:hover,
.dropdown-item button:hover {
  background-color: #f0f4ff;
  color: #4a6cf7;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
  color: #777;
}

.dropdown-item:hover i {
  color: #4a6cf7;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout-item button {
  color: #e74c3c;
}

.logout-item button:hover {
  background-color: #fff0f0;
  color: #e74c3c;
}

.logout-item i {
  color: #e74c3c;
}

/* Mobile responsive */
@media (max-width: 991px) {
  .navbar-container {
    padding: 12px 20px;
  }

  .navbar-nav {
    gap: 0.5rem;
    padding-top: 1rem;
  }

  .nav-link::after {
    display: none;
  }

  .auth-buttons,
  .user-menu-container {
    margin-top: 1rem;
    width: 100%;
  }

  .login-button {
    width: 100%;
    text-align: center;
    padding: 10px;
  }

  .user-menu-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .user-dropdown {
    width: 100%;
    position: static;
    margin-top: 10px;
    box-shadow: none;
    border: 1px solid #eee;
  }
}
</style>
