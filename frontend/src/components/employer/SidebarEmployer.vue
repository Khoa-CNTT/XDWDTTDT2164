<template>
  <nav class="sidebar">
    <div class="balance-box">
      <div class="box">
        <p class="mb-0 mt-2 ms-2 header">Số dư tài khoản</p>
        <p class="ms-2 fw-bold">0</p>
      </div>
      <button class="btn-deposit">
        <i class="fa-solid fa-credit-card"></i> Nạp tiền
      </button>
    </div>
    <div class="menu mt-4">
      <div class="menu-section">
        <ul class="sidebar-list">
          <!-- Trang Chủ -->
          <li class="sidebar-item header">
            <router-link to="/employer-dashboard" class="text-dark">
              <i class="fa-solid fa-house"></i>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="sidebar-item header">
            <router-link
              to="/employer-dashboard/employer-info"
              class="text-dark"
            >
              <i class="fa-solid fa-user"></i>
              Hồ Sơ Công Ty
            </router-link>
          </li>
          <li class="sidebar-item header">
            <router-link
              to="/employer-dashboard/employer-newjob"
              class="text-dark"
            >
              <i class="fa-solid fa-circle-chevron-right"></i>
              Đăng Một Công Việc Mới
            </router-link>
          </li>
          <li class="sidebar-item header">
            <router-link to="#" class="text-dark">
              <i class="fa-solid fa-bag-shopping"></i>
              Quản Lý Công Việc
            </router-link>
          </li>
          <li class="sidebar-item header">
            <router-link
              to="/employer-dashboard/employer-recharge"
              class="text-dark"
            >
              <i class="fa-solid fa-table"></i>
              Tất Cả Các Ứng Viên
            </router-link>
          </li>
          <li class="sidebar-item header">
            <router-link
              to="/admin-dashboard/post-management"
              class="text-dark"
            >
              <i class="fa-solid fa-lock"></i>
              Thay Đổi Mật Khẩu
            </router-link>
          </li>
          <li class="sidebar-item logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            Đăng xuất
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "SidebarEmployer",
};
</script>

<style scoped>
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
  width: 250px;
  height: 100vh;
  padding: 20px 0;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  font-size: 12px !important;
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

.balance-box {
  background-color: #fefaea;
  margin: 0px 20px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #ffc107;
}

.balance-box .header {
  font-size: 14px;
  font-weight: 500;
}

.btn-deposit {
  background: #ffc107;
  border: none;
  border-radius: 50px;
  padding: 5px 6px;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
