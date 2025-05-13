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
            <span>Trang chủ</span>
          </router-link>

          <router-link
            to="/employer-dashboard/employer-info"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-user"></i>
            Hồ Sơ Công Ty
          </router-link>

          <router-link
            to="/employer-dashboard/employer-recharge"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-wallet"></i>
            Nạp tiền tài khoản
          </router-link>

          <router-link
            to="/employer-dashboard/employer-deposithistory"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-wallet"></i>
            Lịch sử nạp tiền
          </router-link>

          <router-link
            to="/employer-dashboard/employer-paymenthistory"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-wallet"></i>
            Lịch sử thanh toán
          </router-link>
          <router-link
            to="/employer-dashboard/employer-newjob"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-play"></i>
            Đăng Một Công Việc Mới
          </router-link>
          <router-link
            to="/employer-dashboard/employer-workmanagement"
            class="sidebar-item header text-dark"
          >
            <i class="fa-solid fa-bag-shopping"></i>
            Quản Lý Công Việc
          </router-link>

          <router-link
            to="/employer-dashboard/employer-password"
            class="sidebar-item header text-dark"
          >
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
  color: inherit;
}

.sidebar {
  background: #ffffff;
  width: 280px;
  height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  position: sticky;
  top: 0;
  transition: all 0.3s ease;
  border-right: 1px solid #f0f0f0;
}

/* Balance box */
.balance-box {
  background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
  margin: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.15);
  padding: 16px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  display: flex;
  flex-direction: column;
}

.balance-box .box {
  margin-bottom: 15px;
}

.balance-box .header {
  color: #5f5b51;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.balance-box p.fw-bold {
  font-size: 22px;
  color: #212121;
  margin: 0;
  font-weight: 700 !important;
}

.btn-deposit {
  background: #ffc107;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #5d4037;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.25);
}

.btn-deposit:hover {
  background: #ffca28;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.35);
}

.btn-deposit:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.2);
}

.btn-deposit i {
  font-size: 16px;
}

/* Menu section */
.menu {
  padding: 0 10px;
}

.menu-section {
  margin-bottom: 20px;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-item {
  font-size: 14px !important;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  color: #555;
  position: relative;
  font-weight: 500;
}

.sidebar-item.header {
  text-transform: none;
  font-size: 14px !important;
  margin-top: 0;
}

.sidebar-item.router-link-active,
.sidebar-item.router-link-exact-active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.sidebar-item:hover {
  background: #f5f5f5;
  color: #212121;
}

.sidebar-item.router-link-active:hover,
.sidebar-item.router-link-exact-active:hover {
  background-color: #bbdefb;
}

.sidebar-item.logout {
  margin-top: 20px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  color: #e53935;
  font-weight: 600;
}

.sidebar-item.logout:hover {
  background-color: #ffebee;
}

.sidebar-item i {
  width: 24px;
  height: 24px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item.router-link-active i,
.sidebar-item.router-link-exact-active i {
  color: #1976d2;
}

.sidebar-item.logout i {
  color: #e53935;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .sidebar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    padding: 15px 0;
  }

  .sidebar-item span,
  .balance-box .header,
  .balance-box p.fw-bold {
    display: none;
  }

  .balance-box {
    padding: 10px;
    margin: 10px;
    align-items: center;
  }

  .btn-deposit {
    padding: 8px;
    width: 40px;
    height: 40px;
  }

  .btn-deposit span {
    display: none;
  }

  .sidebar-item {
    padding: 12px;
    justify-content: center;
  }

  .sidebar-item i {
    margin-right: 0;
  }
}

/* Custom scrollbar */
.sidebar::-webkit-scrollbar {
  width: 5px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
