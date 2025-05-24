<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
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

      <!-- Navigation content -->
      <div
        class="user-menu-container"
        id="navbarSupportedContent"
        @click="toggleUserMenu"
      >
        <div class="user-info">
          <span class="user-greeting">Xin chào,</span>
          <span class="user-name">{{ userName }}</span>
        </div>
        <i
          class="dropdown-icon fas fa-chevron-down"
          :class="{ 'rotate-icon': isMenuOpen }"
        ></i>
      </div>
      <div class="user-dropdown" :class="{ 'show-dropdown': isMenuOpen }">
        <div class="dropdown-header">
          <div class="dropdown-user-info">
            <span class="dropdown-user-name">{{ userName }}</span>
            <span class="dropdown-user-email">{{
              authStore.user?.email || "N/A"
            }}</span>
          </div>
        </div>
        <ul class="dropdown-menu-items">
          <template v-if="authStore.user?.role === 'admin'">
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/admin-starter">
                <i class="fas fa-user"></i>
                <span>Trang chủ</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/user-management">
                <i class="fas fa-user"></i>
                <span>Quản lý người dùng</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/list-jobtype">
                <i class="fas fa-user"></i>
                <span>Quản lý loại công việc</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/list-skills">
                <i class="fas fa-user"></i>
                <span>Quản lý kỹ năng</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/hierarchy-management">
                <i class="fas fa-user"></i>
                <span>Quản lý cấp bậc</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/formofwork-list">
                <i class="fas fa-user"></i>
                <span>Quản lý hình thức làm việc</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/expjob-list">
                <i class="fas fa-user"></i>
                <span>Quản lý kinh nghiệm làm việc</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/salary-management">
                <i class="fas fa-user"></i>
                <span>Quản lý khoản lương</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/company-management">
                <i class="fas fa-user"></i>
                <span>Quản lý công ty</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/post-management">
                <i class="fas fa-user"></i>
                <span>Quản lý bài đăng</span>
              </router-link>
            </li>
            <li class="dropdown-item">
              <router-link to="/admin-dashboard/transaction-management">
                <i class="fas fa-user"></i>
                <span>Quản lý giao dịch</span>
              </router-link>
            </li>
            <li class="dropdown-item logout-item">
              <button @click="logout" class="logout-button">
                <i class="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
              </button>
            </li>
          </template>
        </ul>
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
      return this.authStore.user.fullName || "Admin";
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
      const userDropdown = this.$el.querySelector(".user-dropdown");

      // Đóng menu nếu click bên ngoài cả menu và dropdown
      if (
        userMenu &&
        !userMenu.contains(event.target) &&
        userDropdown &&
        !userDropdown.contains(event.target) &&
        this.isMenuOpen
      ) {
        this.isMenuOpen = false;
      }
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-menu-container:hover {
  background-color: #f0f4ff;
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
  color: #666;
  font-size: 12px;
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

/* User dropdown menu */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 50px;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  max-height: 80vh;
  overflow-y: auto;
}

.show-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(10px);
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
  padding: 4px 15px;
}

.dropdown-item a,
.dropdown-item button {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  padding: 8px 10px;
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

  .user-dropdown {
    width: 100%;
    position: static;
    margin-top: 10px;
    box-shadow: none;
    border: 1px solid #eee;
    right: 0;
  }
}
</style>
