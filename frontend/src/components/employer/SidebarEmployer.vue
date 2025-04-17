<template>
  <nav class="sidebar">
    <div class="balance-box mt-4">
      <div class="box">
        <p class="mb-0 mt-2 ms-2 header">Số dư tài khoản</p>
        <p class="ms-2 fw-bold">
          <!-- Hiển thị số dư ví hoặc "0" nếu chưa tải -->
          {{
            walletStore.isLoading
              ? "Đang tải..."
              : formatNumber(walletStore.wallet?.balance || 0)
          }}đ
        </p>
      </div>
      <button class="btn-deposit" @click="goToDeposit">
        <i class="fa-solid fa-credit-card"></i> Nạp tiền
      </button>
    </div>
    <div class="menu mt-4">
      <div class="menu-section">
        <ul class="sidebar-list">
          <router-link to="/" class="sidebar-item header text-dark">
            <i class="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/employer-dashboard/employer-info" class="sidebar-item header text-dark">
            <i class="fa-solid fa-user"></i>
            Hồ Sơ Công Ty
          </router-link>

          <router-link to="/employer-dashboard/employer-list" class="sidebar-item header text-dark">
            <i class="fa-solid fa-bookmark"></i>
            Quản lý nhân viên
          </router-link>

          <router-link to="/employer-dashboard/employer-newjob" class="sidebar-item header text-dark">
            <i class="fa-solid fa-play"></i>
            Thêm mới nhân viên
          </router-link>

          <router-link to="/employer-dashboard/employer-recharge" class="sidebar-item header text-dark">
            <i class="fa-solid fa-wallet"></i>
            Nạp tiền tài khoản
          </router-link>

          <router-link to="/employer-dashboard/employer-deposithistory" class="sidebar-item header text-dark">
            <i class="fa-solid fa-wallet"></i>
            Lịch sử nạp tiền
          </router-link>

          <router-link to="/employer-dashboard/employer-paymenthistory" class="sidebar-item header text-dark">
            <i class="fa-solid fa-wallet"></i>
            Lịch sử thanh toán
          </router-link>
          <router-link to="/employer-dashboard/employer-newjob" class="sidebar-item header text-dark">
            <i class="fa-solid fa-play"></i>
            Đăng Một Công Việc Mới
          </router-link>
          <router-link to="/employer-dashboard/employer-workmanagement" class="sidebar-item header text-dark">
            <i class="fa-solid fa-bag-shopping"></i>
            Quản Lý Công Việc
          </router-link>

          <router-link to="/employer-dashboard/employer-candidates" class="sidebar-item header text-dark">
            <i class="fa-solid fa-table"></i>
            Tất Cả Các Ứng Viên
          </router-link>

          <router-link to="/employer-dashboard/employer-password" class="sidebar-item header text-dark">
            <i class="fa-solid fa-lock"></i>
            Thay Đổi Mật Khẩu
          </router-link>

          <li class="sidebar-item logout" @click="handleLogout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            Đăng xuất
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useWalletStore } from "@stores/useWalletStore";
import { logoutApi } from "@apis/auth";

export default {
  name: "SidebarEmployer",
  setup() {
    const walletStore = useWalletStore();
    return { walletStore };
  },
  methods: {
    formatNumber(number) {
      return new Intl.NumberFormat("vi-VN").format(number);
    },
    goToDeposit() {
      this.$router.push("/employer-dashboard/employer-recharge");
    },
    async fetchWalletData() {
      try {
        await this.walletStore.fetchWallet();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin ví trong sidebar:", error);
      }
    },
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
  mounted() {
    this.fetchWalletData();
  },
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}

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

.btn-deposit:hover {
  background: #e0a800;
  transition: background 0.3s ease;
}
</style>
