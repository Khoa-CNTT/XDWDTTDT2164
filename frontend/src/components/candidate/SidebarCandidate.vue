<template>
  <div>
    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="menu">
        <div class="menu-section">
          <ul class="sidebar-list">
            <!-- Trang Chủ -->
            <router-link to="/candidate-dashboard">
              <li class="sidebar-item header">
                <a href="/admin-dashboard" class=""
                  ><i class="fa-solid fa-house"></i><span> Dashboard</span></a
                >
              </li>
            </router-link>
            <!-- Nhóm quản lý người đùng -->
            <li class="sidebar-item header">
              <router-link to="/candidate-dashboard/candidate-test">
                <a href="" class=""
                  ><i class="fa-solid fa-user"></i>Hồ sơ cá nhân
                </a>
              </router-link>
            </li>
            <li class="sidebar-item header">
              <router-link to="/candidate-dashboard/candidate-jobs">
                <a href="" class=""
                  ><i class="fa-solid fa-bookmark"></i>Đã lưu
                </a>
              </router-link>
            </li>
            <li class="sidebar-item header">
              <router-link to="/candidate-dashboard/candidate-apply">
                <a href="" class=""
                  ><i class="fa-solid fa-calendar"></i>Ứng viên công việc</a
                >
              </router-link>
            </li>
            <li class="sidebar-item header">
              <router-link to="/candidate-dashboard/candidate-password">
                <a href="" class=""
                  ><i class="fa-solid fa-lock"></i>Đổi mật khẩu</a
                >
              </router-link>
            </li>
            <!-- Đăng xuất -->
            <li class="sidebar-item logout" @click="handleLogout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Đăng xuất
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { logoutApi } from "@apis/auth";
export default {
  methods: {
    async handleLogout() {
      try {
        await logoutApi();
        localStorage.removeItem("token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Đăng xuất thất bại:", error);
      }
    },
  },
};
</script>
<style>
a {
  text-decoration: none !important;
  /* Tắt dấu gạch dưới của router-link */
}

/* .router-link-active,
.router-link-exact-active {
    all: unset !important;
} */

.sidebar {
  background: white;
  color: black;
  width: 280px;
  height: 100vh;
  padding: 20px 0;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 12px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.sidebar-item.header {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.7em;
  color: #7f8c8d;
  margin-top: 5px;
}

.sidebar-item.sub-item {
  padding-left: 50px;
  font-size: 0.9em;
}

.sidebar-item:hover {
  background: #c3d2ff;
}

.sidebar-item.logout {
  margin-top: 30px;
  border-top: 1px solid #34495e;
  padding-top: 20px;
  color: #e74c3c;
}

.sidebar-item i {
  width: 25px;
  text-align: center;
}
</style>
