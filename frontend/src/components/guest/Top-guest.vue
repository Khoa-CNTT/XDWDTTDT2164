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
              >Công Ty</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/about"
              >Giới Thiệu</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/conditions"
              >Điều Khoản</router-link
            >
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
          <!-- Notification Bell - Only for Employers -->
          <div
            v-if="authStore.user?.role === 'employer'"
            class="notification-container"
            @click="toggleNotifications"
          >
            <div class="notification-bell">
              <i class="fas fa-bell"></i>
              <span
                v-if="notificationStore.unreadCount > 0"
                class="notification-badge"
              >
                {{
                  notificationStore.unreadCount > 99
                    ? "99+"
                    : notificationStore.unreadCount
                }}
              </span>
            </div>

            <!-- Notification Dropdown -->
            <div
              class="notification-dropdown"
              :class="{ 'show-notifications': showNotifications }"
            >
              <div class="notification-header">
                <h4>Thông báo</h4>
                <button
                  v-if="notificationStore.unreadCount > 0"
                  @click="markAllAsRead"
                  class="mark-all-read-btn"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              </div>

              <div class="notification-list">
                <div
                  v-if="notificationStore.isLoading"
                  class="notification-loading"
                >
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Đang tải thông báo...</span>
                </div>

                <div
                  v-else-if="notificationStore.notifications.length === 0"
                  class="no-notifications"
                >
                  <i class="far fa-bell"></i>
                  <span>Không có thông báo nào</span>
                </div>

                <div v-else>
                  <div
                    v-for="notification in notificationStore.notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ unread: !notification.isRead }"
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="notification-icon">
                      <i :class="getNotificationIcon(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                      <h5>{{ notification.title }}</h5>
                      <p>{{ notification.message }}</p>
                      <span class="notification-time">{{
                        formatTime(notification.createdAt)
                      }}</span>
                    </div>
                    <div
                      class="notification-status"
                      v-if="!notification.isRead"
                    >
                      <div class="unread-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <div class="dropdown-avatar">
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
                    <i class="fas fa-lock"></i>
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
                  <router-link to="/employer-dashboard/notifications">
                    <i class="fas fa-bell"></i>
                    <span>Thông báo</span>
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
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export default {
  data() {
    return {
      isMenuOpen: false,
      showNotifications: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const router = useRouter();

    return {
      authStore,
      notificationStore,
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
      return "Người dùng";
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
    notifications() {
      return this.notificationStore.notifications;
    },
    unreadNotificationsCount() {
      return this.notificationStore.unreadCount;
    },
  },
  methods: {
    toggleUserMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        this.showNotifications = false;
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.isMenuOpen = false;
        if (this.authStore.user?.role === "employer") {
          this.fetchNotifications();
        }
      }
    },
    async fetchNotifications() {
      try {
        await this.notificationStore.fetchNotificationsForEmployer();
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        toast.error("Lỗi khi tải thông báo!");
      }
    },
    async markAllAsRead() {
      try {
        await this.notificationStore.markAllAsRead();
        toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
      } catch (error) {
        console.error("Lỗi khi đánh dấu tất cả thông báo:", error);
        toast.error("Lỗi khi đánh dấu thông báo");
      }
    },
    async handleNotificationClick(notification) {
      try {
        if (!notification.isRead) {
          await this.notificationStore.markAsRead(notification.id);
        }
        this.navigateBasedOnNotification(notification);
        this.showNotifications = false;
      } catch (error) {
        console.error("Lỗi khi xử lý thông báo:", error);
        toast.error("Lỗi khi xử lý thông báo!");
      }
    },
    navigateBasedOnNotification(notification) {
      switch (notification.type) {
        case "job_application":
          this.router.push("/employer-dashboard/applications");
          break;
        case "payment_success":
          this.router.push("/employer-dashboard/employer-deposithistory");
          break;
        case "job_expired":
          this.router.push("/employer-dashboard/employer-workmanagement");
          break;
        case "job_approved":
        case "job_rejected":
          this.router.push(
            `/employer-dashboard/description-job/${notification.jobId}`
          );
          break;
        case "system":
        default:
          this.router.push("/employer-dashboard/notifications");
      }
    },
    getNotificationIcon(type) {
      const iconMap = {
        job_application: "fas fa-user-plus text-blue-500",
        payment_success: "fas fa-check-circle text-green-500",
        payment_failed: "fas fa-exclamation-circle text-red-500",
        job_expired: "fas fa-clock text-orange-500",
        job_approved: "fas fa-thumbs-up text-green-500",
        job_rejected: "fas fa-thumbs-down text-red-500",
        system: "fas fa-cog text-gray-500",
        default: "fas fa-bell text-blue-500",
      };
      return iconMap[type] || iconMap.default;
    },
    formatTime(timestamp) {
      const now = new Date();
      const time = new Date(timestamp);
      const diff = now - time;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Vừa xong";
      if (minutes < 60) return `${minutes} phút trước`;
      if (hours < 24) return `${hours} giờ trước`;
      if (days < 7) return `${days} ngày trước`;

      return time.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    async logout() {
      try {
        await this.authStore.logout();
        this.isMenuOpen = false;
        this.showNotifications = false;
        this.router.push("/");
        toast.success("Đăng xuất thành công!");
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        toast.error("Lỗi khi đăng xuất!");
      }
    },
    closeMenuOnOutsideClick(event) {
      const userMenu = this.$el.querySelector(".user-menu-container");
      if (userMenu && !userMenu.contains(event.target)) {
        this.isMenuOpen = false;
        this.showNotifications = false;
      }
    },
    getCompanyLogo(logo) {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    },
  },
  watch: {
    "authStore.isAuthenticated"(newVal) {
      if (newVal && this.authStore.user?.role === "employer") {
        this.fetchNotifications();
      } else {
        this.notificationStore.clearNotifications();
        this.showNotifications = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.closeMenuOnOutsideClick);
    if (
      this.authStore.isAuthenticated &&
      this.authStore.user?.role === "employer"
    ) {
      this.fetchNotifications();
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeMenuOnOutsideClick);
  },
};
</script>

<style scoped>
/* Same styles as provided, no changes needed */
.navbar {
  background-color: white;
  box-shadow: 0 2px 10Preparpx rgba(0, 0, 0, 0.05);
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

.user-menu-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Notification Styles */
.notification-container {
  position: relative;
}

.notification-bell {
  position: relative;
  background-color: #f8f9ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-bell:hover {
  background-color: #4a6cf7;
  color: white;
}

.notification-bell i {
  font-size: 18px;
  color: #4a6cf7;
  transition: color 0.3s ease;
}

.notification-bell:hover i {
  color: white;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 35px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1002;
  overflow: hidden;
}

.show-notifications {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.notification-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.mark-all-read-btn {
  background: none;
  border: none;
  color: #4a6cf7;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.mark-all-read-btn:hover {
  background-color: #f0f4ff;
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-loading,
.no-notifications {
  padding: 40px 20px;
  text-align: center;
  color: #777;
}

.notification-loading i {
  font-size: 24px;
  margin-bottom: 10px;
  color: #4a6cf7;
}

.no-notifications i {
  font-size: 32px;
  margin-bottom: 10px;
  color: #ddd;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 20px;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background-color: #f8f9ff;
}

.notification-item.unread {
  background-color: #f0f4ff;
}

.notification-item.unread:hover {
  background-color: #e8f0ff;
}

.notification-icon {
  margin-right: 12px;
  margin-top: 2px;
}

.notification-icon i {
  font-size: 20px;
}

.notification-content {
  flex: 1;
}

.notification-content h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.notification-content p {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.notification-time {
  font-size: 11px;
  color: #999;
}

.notification-status {
  margin-left: 10px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #4a6cf7;
  border-radius: 50%;
}

.notification-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.view-all-link {
  color: #4a6cf7;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: #3a5cdb;
}

/* User Menu Styles */
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

/* Custom scrollbar for notification list */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Notification animations */
@keyframes notificationPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-bell:hover {
  animation: notificationPulse 0.6s ease-in-out;
}

.notification-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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

  .user-menu-container {
    flex-direction: column;
    align-items: stretch;
  }

  .notification-container {
    order: 2;
    margin-top: 10px;
  }

  .notification-bell {
    width: 100%;
    border-radius: 6px;
    height: 45px;
    justify-content: flex-start;
    padding-left: 15px;
  }

  .notification-bell::after {
    content: "Thông báo";
    margin-left: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .notification-dropdown {
    width: 100%;
    position: static;
    margin-top: 10px;
    box-shadow: none;
    border: 1px solid #eee;
  }

  .user-menu-trigger {
    width: 100%;
    justify-content: space-between;
    order: 1;
  }

  .user-dropdown {
    width: 100%;
    position: static;
    margin-top: 10px;
    box-shadow: none;
    border: 1px solid #eee;
  }
}

@media (max-width: 576px) {
  .notification-dropdown {
    width: calc(100vw - 40px);
    left: 50%;
    transform: translateX(-50%);
  }

  .notification-item {
    padding: 12px 15px;
  }

  .notification-content h5 {
    font-size: 13px;
  }

  .notification-content p {
    font-size: 12px;
  }
}

/* Notification type specific colors */
.text-blue-500 {
  color: #3b82f6;
}
.text-green-500 {
  color: #10b981;
}
.text-red-500 {
  color: #ef4444;
}
.text-orange-500 {
  color: #f97316;
}
.text-gray-500 {
  color: #6b7280;
}

/* Loading animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fa-spin {
  animation: spin 1s linear infinite;
}
</style>
