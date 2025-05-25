<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h4 class="mb-0">Lịch sử nạp tiền</h4>
          <div>
            <router-link to="/" class="text-decoration-none text-muted"
              >Trở lại trang chủ?</router-link
            >
          </div>
        </div>

        <!-- Deposit History Table -->
        <div class="card border-0 rounded-4">
          <div class="card-body p-4">
            <h5 class="mb-4">Lịch sử nạp tiền</h5>

            <!-- Loading State -->
            <div v-if="walletStore.isLoading" class="text-center mb-4">
              <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
            </div>

            <!-- Error State -->
            <div v-else-if="walletStore.error" class="alert alert-danger">
              {{ walletStore.error }}
            </div>

            <!-- Table -->
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="bg-light">
                  <tr>
                    <th>STT</th>
                    <th>Ngày nạp</th>
                    <th class="text-success">Số tiền nạp</th>
                    <th>Khuyến mãi</th>
                    <th>Thực nhận</th>
                    <th>Mã giao dịch</th>
                    <th>Phương thức</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(deposit, index) in walletStore.historyDeposits"
                    :key="deposit.id"
                  >
                    <td>
                      {{
                        (walletStore.currentPage - 1) * walletStore.pageSize +
                        index +
                        1
                      }}
                    </td>
                    <td>{{ formatDate(deposit.paymentDate) }}</td>
                    <td class="text-success">
                      +{{ formatNumber(deposit.amount) }}
                    </td>
                    <td>{{ formatNumber(deposit.promotionAmount) }}</td>
                    <td>
                      {{ formatNumber(deposit.amount) }}
                    </td>
                    <td>
                      <span class="text-primary">{{
                        deposit.transactionId
                      }}</span>
                    </td>
                    <td>{{ deposit.paymentMethod }}</td>
                    <td>{{ deposit.note || deposit.status }}</td>
                  </tr>
                  <!-- Empty State -->
                  <tr v-if="!walletStore.historyDeposits?.length">
                    <td colspan="8" class="text-center text-muted">
                      Không có dữ liệu lịch sử nạp tiền.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              v-if="walletStore.historyDeposits?.length >= 8"
              class="d-flex justify-content-center mt-4"
            >
              <nav>
                <ul class="pagination mb-0">
                  <li
                    class="page-item"
                    :class="{ disabled: walletStore.currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(walletStore.currentPage - 1)"
                    >
                      Quay lại
                    </button>
                  </li>
                  <li
                    v-for="page in paginationPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: walletStore.currentPage === page }"
                  >
                    <button class="page-link" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{
                      disabled:
                        walletStore.currentPage === walletStore.totalPages,
                    }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(walletStore.currentPage + 1)"
                    >
                      Tiếp
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWalletStore } from "@stores/useWalletStore";

export default {
  name: "DepositHistory",
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
        await this.walletStore.fetchHistoryDeposit(page, limit);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử nạp tiền:", error);
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
/* Container chính */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  margin-top: 2rem;
}

/* Tiêu đề */
h4.mb-0 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

h5.mb-4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
}

/* Link trở lại */
.text-muted {
  font-size: 0.9rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.text-muted:hover {
  color: #0d6efd;
  text-decoration: none !important;
}

/* Card chứa bảng */
.card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

/* Bảng */
.table {
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead th {
  font-size: 0.95rem;
  font-weight: 600;
  color: #444;
  padding: 1rem;
  background: #f5f7fa;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table tbody tr {
  transition: background 0.3s ease;
}

.table tbody tr:hover {
  background: #f0f6ff;
}

.table tbody td {
  font-size: 0.95rem;
  color: #333;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  vertical-align: middle;
}

/* Định dạng các cột đặc biệt */
.text-success {
  font-weight: 600;
  color: #28a745 !important;
}

.text-primary {
  font-weight: 500;
  color: #0d6efd !important;
  cursor: pointer;
  transition: color 0.3s ease;
}

.text-primary:hover {
  color: #0a58ca !important;
  text-decoration: underline;
}

/* Trạng thái rỗng */
.text-muted.text-center {
  font-size: 1rem;
  color: #888;
  font-style: italic;
  padding: 2rem;
}

/* Trạng thái loading */
.text-center i {
  font-size: 1.5rem;
  color: #0d6efd;
}

/* Trạng thái lỗi */
.alert-danger {
  font-size: 1rem;
  color: #721c24;
  background: #f8d7da;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

/* Phân trang */
.pagination {
  margin: 0;
}

.page-item .page-link {
  font-size: 0.95rem;
  color: #6c757d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin: 0 0.25rem;
  transition: background 0.3s ease, color 0.3s ease, transform 0.1s ease;
}

.page-item .page-link:hover {
  color: #0d6efd;
  background: #f0f6ff;
  transform: translateY(-1px);
}

.page-item.active .page-link {
  background: #0d6efd;
  color: #fff;
  font-weight: 600;
}

.page-item.disabled .page-link {
  color: #d3d3d3;
  cursor: not-allowed;
  background: none;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 0.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  h4.mb-0 {
    font-size: 1.5rem;
  }

  .table thead th,
  .table tbody td {
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .page-link {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 576px) {
  .table-responsive {
    font-size: 0.85rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.5rem;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-item .page-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
