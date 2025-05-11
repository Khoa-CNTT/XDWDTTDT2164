<template>
  <div class="payment-history-container">
    <!-- Header -->
    <div class="history-header">
      <h4 class="history-title">Lịch sử thanh toán</h4>
      <router-link to="/" class="back-link">
        <i class="fas fa-home"></i> Trở lại trang chủ
      </router-link>
    </div>

    <!-- Payment History Table -->
    <div class="history-card">
      <div class="card-content">
        <div class="section-header">
          <h5>Lịch sử thanh toán</h5>
        </div>

        <!-- Loading State -->
        <div v-if="walletStore.isLoading" class="loading-state">
          <div class="spinner"></div>
          <span>Đang tải dữ liệu...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="walletStore.error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ walletStore.error }}</span>
        </div>

        <!-- Table -->
        <div v-else class="table-container">
          <table class="payment-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thời gian</th>
                <th class="amount-column">Phí thanh toán</th>
                <th>Số dư đầu</th>
                <th>Số dư cuối</th>
                <th>Mã bài đăng</th>
                <th>Tên bài đăng</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(payment, index) in walletStore.historyPayments"
                :key="payment.id"
                class="table-row"
              >
                <td class="index-cell">
                  {{ index + 1 }}
                </td>
                <td class="date-cell">{{ formatDate(payment.paymentDate) }}</td>
                <td class="amount-cell">
                  <span class="expense-amount"
                    >-{{ formatNumber(payment.amount) }}</span
                  >
                </td>
                <td class="balance-cell">
                  {{ formatNumber(payment.balanceBefore) }}
                </td>
                <td class="balance-cell">
                  {{ formatNumber(payment.balanceAfter) }}
                </td>
                <td class="post-id-cell">
                  <span class="post-id">{{ payment.Jobs.id }}</span>
                </td>
                <td class="post-title-cell">{{ payment.Jobs.jobName }}</td>
              </tr>
              <!-- Empty State -->
              <tr
                v-if="!walletStore.historyPayments?.length"
                class="empty-state"
              >
                <td colspan="7">
                  <div class="empty-message">
                    <i class="fas fa-inbox"></i>
                    <span>Không có dữ liệu lịch sử thanh toán.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="walletStore.historyPayments?.length"
          class="pagination-container"
        >
          <div class="pagination">
            <button
              class="pagination-btn prev-btn"
              :class="{ disabled: walletStore.currentPage === 1 }"
              @click="changePage(walletStore.currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i> Quay lại
            </button>

            <div class="pagination-numbers">
              <button
                v-for="page in paginationPages"
                :key="page"
                class="page-number"
                :class="{ active: walletStore.currentPage === page }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              class="pagination-btn next-btn"
              :class="{
                disabled: walletStore.currentPage === walletStore.totalPages,
              }"
              @click="changePage(walletStore.currentPage + 1)"
            >
              Tiếp <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWalletStore } from "@stores/useWalletStore";

export default {
  name: "PaymentHistory",
  setup() {
    const walletStore = useWalletStore();
    return { walletStore };
  },
  computed: {
    paginationPages() {
      const total = this.walletStore.totalPages;
      const current = this.walletStore.currentPage;
      const maxPagesToShow = 5;
      const pages = [];

      let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(total, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    formatNumber(number) {
      return new Intl.NumberFormat("vi-VN").format(number);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    async fetchHistory(page = 1, limit = 8) {
      try {
        await this.walletStore.fetchHistoryPayment(page, limit);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", error);
      }
    },
    changePage(page) {
      if (
        page < 1 ||
        page > this.walletStore.totalPages ||
        page === this.walletStore.currentPage
      ) {
        return;
      }
      this.fetchHistory(page, this.walletStore.pageSize);
    },
  },
  mounted() {
    this.fetchHistory();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

* {
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;
}

.payment-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: #333;
}

/* Header Styles */
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
}

.history-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.back-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0d6efd;
}

.back-link i {
  margin-right: 6px;
}

/* Card Styles */
.history-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-content {
  padding: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h5 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.8rem;
  margin: 0;
}

.section-header h5:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 40px;
  background: #0d6efd;
  border-radius: 3px;
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1rem;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #0d6efd;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 8px;
  font-size: 1.2rem;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.payment-table thead {
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
}

.payment-table th {
  text-align: left;
  padding: 1rem 1.2rem;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: rgba(13, 110, 253, 0.04);
}

.payment-table td {
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #f1f1f1;
  color: #495057;
}

.index-cell {
  width: 60px;
  color: #6c757d;
  font-weight: 500;
}

.date-cell {
  font-size: 0.9rem;
  color: #6c757d;
}

.amount-column {
  color: #dc3545;
}

.amount-cell {
  font-weight: 600;
}

.expense-amount {
  color: #dc3545;
}

.balance-cell {
  font-size: 0.95rem;
}

.post-id-cell {
  text-align: center;
}

.post-id {
  color: #0d6efd;
  cursor: pointer;
  transition: color 0.2s;
  font-weight: 500;
}

.post-id:hover {
  color: #0b5ed7;
  text-decoration: underline;
}

.post-title-cell {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Empty State */
.empty-state {
  background-color: #f8f9fa;
}

.empty-message {
  padding: 3rem 0;
  text-align: center;
  color: #adb5bd;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.empty-message i {
  font-size: 2rem;
  opacity: 0.5;
}

/* Pagination Styles */
.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  background-color: white;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background-color: #f8f9fa;
  color: #0d6efd;
  border-color: #0d6efd;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.3rem;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #dee2e6;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover:not(.active) {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.page-number.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
  font-weight: 500;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .card-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .payment-history-container {
    padding: 1.5rem 1rem;
  }

  .history-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .card-content {
    padding: 1.2rem;
  }

  .payment-table th,
  .payment-table td {
    padding: 0.8rem;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
