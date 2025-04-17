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
              v-if="walletStore.historyDeposits?.length"
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
.container {
  max-width: 1200px;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.table > :not(caption) > * > * {
  padding: 1rem;
}

.page-link {
  color: #6c757d;
  border: none;
  padding: 0.5rem 1rem;
}

.page-link:hover {
  color: #000;
  background: none;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  color: white;
}

.page-item.disabled .page-link {
  color: #d3d3d3;
  cursor: not-allowed;
}

.text-primary {
  cursor: pointer;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>
