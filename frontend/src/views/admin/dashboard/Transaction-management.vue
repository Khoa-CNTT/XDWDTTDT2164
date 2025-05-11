<template>
  <div class="transaction-management">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h2>Quản Lý Giao Dịch</h2>
        <a href="/" class="back-link">Quay trở lại trang chủ?</a>
      </div>
      <div>
        <button class="btn btn-success" @click="handleExportCsv">
          Xuất file CSV <i class="fa-solid fa-circle-down"></i>
        </button>
      </div>
    </div>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>

    <!-- Card doanh thu -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng doanh thu hôm nay</h5>
            <p class="text-success">{{ formatCurrency(todayRevenue) }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng doanh thu tháng này</h5>
            <p class="text-success">{{ formatCurrency(monthRevenue) }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng số giao dịch</h5>
            <div>
              <span class="text-success"
                >Thành công: {{ transactionStats.success }}</span
              >
              /
              <span class="text-danger"
                >Thất bại: {{ transactionStats.failed }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng tiền nạp vào ví</h5>
            <p class="text-success">{{ formatCurrency(walletDeposits) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ doanh thu -->
    <div class="row">
      <div class="col-lg-7 col-md-12">
        <div class="card p-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Doanh thu theo thời gian</h5>
            <div class="d-flex gap-2 align-items-center">
              <div v-if="showDatePickers" class="d-flex gap-2">
                <input
                  type="date"
                  v-model="startDate"
                  class="form-control form-control-sm"
                  style="width: 140px"
                  @change="debouncedFetchRevenueData"
                />
                <input
                  type="date"
                  v-model="endDate"
                  class="form-control form-control-sm"
                  style="width: 140px"
                  @change="debouncedFetchRevenueData"
                />
              </div>
              <select
                v-model="selectedRevenueFilter"
                @change="debouncedFetchRevenueData"
                class="form-select"
                style="width: 120px"
              >
                <option value="day">Theo ngày</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
                <option value="weekday">Theo thứ</option>
              </select>
              <button
                @click="toggleDatePickers"
                class="btn btn-sm"
                :class="showDatePickers ? 'btn-danger' : 'btn-outline-primary'"
              >
                <i
                  class="fas"
                  :class="showDatePickers ? 'fa-times' : 'fa-calendar'"
                ></i>
              </button>
            </div>
          </div>

          <div v-if="revenueChartLoading" class="text-center py-5">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
          <div
            v-else-if="revenueChartError"
            class="text-center py-5 text-danger"
          >
            <i class="fas fa-exclamation-triangle"></i> {{ revenueChartError }}
          </div>
          <div v-else-if="revenueData.length === 0" class="text-center py-5">
            <i class="fas fa-info-circle"></i> Không có dữ liệu trong khoảng
            thời gian này
          </div>
          <canvas
            v-else
            ref="revenueChartCanvas"
            style="min-height: 350px"
          ></canvas>
        </div>
      </div>
      <div class="col-lg-5 col-md-12">
        <div class="card p-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Phân bổ doanh thu</h5>
            <select
              v-model="selectedPieFilter"
              @change="updatePieChart"
              class="form-select"
              style="width: 120px"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <canvas ref="pieChartCanvas" style="min-height: 350px"></canvas>
        </div>
      </div>
    </div>

    <!-- Bảng giao dịch -->
    <div class="card mt-5">
      <div v-if="paymentStore.isLoading" class="text-center py-5">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách giao dịch...
      </div>
      <div v-else-if="paymentStore.error" class="text-center py-5 text-danger">
        <i class="fas fa-exclamation-triangle"></i> {{ paymentStore.error }}
      </div>
      <div v-else-if="!paymentStore.payments.length" class="text-center py-5">
        <i class="fas fa-info-circle"></i> Không có giao dịch nào.
      </div>
      <table v-else class="table table-bordered table-hover">
        <thead class="table-success text-center align-middle">
          <tr>
            <th>STT</th>
            <th>Mã giao dịch</th>
            <th>Tên công ty</th>
            <th>Loại giao dịch</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="text-center align-middle">
          <tr
            v-for="(transaction, index) in paymentStore.payments"
            :key="transaction.id"
          >
            <td>
              {{
                (paymentStore.currentPage - 1) * paymentStore.pageSize +
                index +
                1
              }}
            </td>
            <td>{{ transaction.transactionId }}</td>
            <td>
              {{ transaction.Users.EmployerUsers[0].Employers.companyName }}
            </td>
            <td>{{ transaction.transactionType }}</td>
            <td>{{ formatCurrency(transaction.amount) }}</td>
            <td>
              <button
                :class="
                  transaction.status === 'Thành công'
                    ? 'badge bg-success text-light'
                    : 'badge bg-danger text-light'
                "
              >
                {{ transaction.status }}
              </button>
            </td>
            <td>{{ formatDate(transaction.paymentDate) }}</td>
            <td class="d-flex justify-content-center">
              <button
                class="btn btn-success me-2"
                data-bs-toggle="modal"
                data-bs-target="#update-modal"
                @click="selectedTransaction = transaction"
              >
                Xem chi tiết
              </button>
              <button
                class="btn btn-danger me-2"
                @click="handleRefund(transaction.id)"
              >
                Hoàn Tiền
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="paymentStore.payments.length"
        class="d-flex justify-content-between align-items-center p-3"
      >
        <div>
          Trang {{ paymentStore.currentPage }} / {{ paymentStore.totalPages }}
        </div>
        <div>
          <button
            class="btn btn-outline-primary me-2"
            :disabled="paymentStore.currentPage === 1"
            @click="paymentStore.previousPage"
          >
            Trang trước
          </button>
          <button
            class="btn btn-outline-primary"
            :disabled="paymentStore.currentPage >= paymentStore.totalPages"
            @click="paymentStore.nextPage"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for transaction details -->
    <div class="modal fade" id="update-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết giao dịch</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p v-if="selectedTransaction">
              <strong>Mã giao dịch:</strong>
              {{ selectedTransaction.transactionId }}
            </p>
            <p v-if="selectedTransaction">
              <strong>Tên công ty:</strong>
              {{
                selectedTransaction.Users?.EmployerUsers[0]?.Employers
                  .companyName || "N/A"
              }}
            </p>
            <p v-if="selectedTransaction">
              <strong>Loại giao dịch:</strong>
              {{ selectedTransaction.transactionType }}
            </p>
            <p v-if="selectedTransaction">
              <strong>Số tiền:</strong>
              {{ formatCurrency(selectedTransaction.amount) }}
            </p>
            <p v-if="selectedTransaction">
              <strong>Trạng thái:</strong> {{ selectedTransaction.status }}
            </p>
            <p v-if="selectedTransaction">
              <strong>Thời gian:</strong>
              {{ formatDate(selectedTransaction.paymentDate) }}
            </p>
            <p v-else>Không có dữ liệu giao dịch.</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables, BarController, PieController } from "chart.js";
import { debounce } from "lodash";
import { useWalletStore } from "@/stores/useWalletStore";
import { exportFileCsv, getPaymentTimeApi } from "@/apis/wallet";
import { getPaymentOverview } from "@/apis/dashboard";

// Register Chart.js components
Chart.register(...registerables, BarController, PieController);

export default {
  name: "TransactionManagement",
  setup() {
    const paymentStore = useWalletStore();
    return { paymentStore };
  },
  data() {
    return {
      todayRevenue: 0,
      monthRevenue: 0,
      transactionStats: { success: 0, failed: 0 },
      walletDeposits: 0,
      error: null,
      selectedRevenueFilter: "month",
      selectedPieFilter: "month",
      revenueChartCanvas: null,
      pieChartCanvas: null,
      selectedTransaction: null,
      revenueChartInstance: null,
      pieChartInstance: null,
      revenueData: [],
      revenueChartLoading: false,
      revenueChartError: null,
      showDatePickers: false,
      startDate: "",
      endDate: "",
      pieData: {
        day: {
          labels: ["Thanh toán bài đăng", "Nạp ví", "Hoàn tiền"],
          datasets: [
            {
              label: "Phân bổ doanh thu",
              data: [3000000, 1500000, 500000],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        month: {
          labels: ["Thanh toán bài đăng", "Nạp ví", "Hoàn tiền"],
          datasets: [
            {
              label: "Phân bổ doanh thu",
              data: [40000000, 25000000, 5000000],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        year: {
          labels: ["Thanh toán bài đăng", "Nạp ví", "Hoàn tiền"],
          datasets: [
            {
              label: "Phân bổ doanh thu",
              data: [120000000, 70000000, 10000000],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.fetchPaymentOverview();
    this.paymentStore.fetchPayments(1, this.paymentStore.pageSize);
    this.$nextTick(() => {
      this.fetchRevenueData();
      this.updatePieChart();
    });
  },
  watch: {
    revenueData: {
      handler(newData) {
        if (newData.length > 0) {
          this.$nextTick(() => {
            this.updateRevenueChart();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    debouncedFetchRevenueData: debounce(function () {
      this.fetchRevenueData();
    }, 500),

    toggleDatePickers() {
      this.showDatePickers = !this.showDatePickers;
      if (!this.showDatePickers) {
        this.startDate = "";
        this.endDate = "";
        this.debouncedFetchRevenueData();
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },

    formatDate(date) {
      return new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    async fetchPaymentOverview() {
      try {
        const response = await getPaymentOverview();
        this.todayRevenue = response.data.todayRevenue || 0;
        this.monthRevenue = response.data.monthRevenue || 0;
        this.transactionStats = response.data || {
          totalTransactions: 0,
          failed: 0,
        };
        this.walletDeposits = response.data.totalWalletBalance || 0;
        this.error = null;
      } catch (err) {
        this.error = "Không thể tải dữ liệu doanh thu. Vui lòng thử lại.";
        console.error("Lỗi khi lấy dữ liệu doanh thu:", err);
      }
    },

    async fetchRevenueData() {
      try {
        this.revenueChartLoading = true;
        this.revenueChartError = null;

        if (
          this.startDate &&
          this.endDate &&
          new Date(this.startDate) > new Date(this.endDate)
        ) {
          this.revenueChartError =
            "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu";
          this.revenueChartLoading = false;
          return;
        }

        const query = { period: this.selectedRevenueFilter };
        if (this.startDate) query.startDate = this.startDate;
        if (this.endDate) query.endDate = this.endDate;

        console.log("Đang gửi yêu cầu với query:", query);
        const response = await getPaymentTimeApi(query);
        console.log("Dữ liệu nhận được:", response);

        this.revenueData = response.data || [];
      } catch (err) {
        this.revenueChartError = `Không thể tải dữ liệu biểu đồ: ${
          err.message || "Lỗi không xác định"
        }`;
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", err);
      } finally {
        this.revenueChartLoading = false;
      }
    },

    async handleExportCsv() {
      try {
        const response = await exportFileCsv();
        const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Lỗi khi xuất file CSV:", error);
        this.error = "Không thể xuất file CSV. Vui lòng thử lại.";
      }
    },

    updateRevenueChart() {
      if (this.revenueChartInstance) {
        this.revenueChartInstance.destroy();
      }

      if (this.revenueData.length === 0) {
        console.warn("Không có dữ liệu để vẽ biểu đồ");
        return;
      }

      if (!this.$refs.revenueChartCanvas) {
        console.warn("Canvas chưa sẵn sàng");
        setTimeout(() => {
          this.updateRevenueChart();
        }, 100);
        return;
      }

      try {
        const ctx = this.$refs.revenueChartCanvas.getContext("2d");
        const labels = this.revenueData.map((item) => item.display);
        const currentData = this.revenueData.map((item) => item.revenue);
        const previousData = this.revenueData.map((item) => item.previod);
        const maxCount = Math.max(...currentData, ...previousData, 1);

        console.log("Dữ liệu biểu đồ:", { labels, currentData, previousData });

        this.$refs.revenueChartCanvas.width =
          this.$refs.revenueChartCanvas.parentNode.offsetWidth;
        this.$refs.revenueChartCanvas.height = 350;

        this.revenueChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Doanh thu hiện tại (VNĐ)",
                data: currentData,
                backgroundColor: currentData.map((count) =>
                  count === Math.max(...currentData)
                    ? "rgba(54, 162, 235, 1)"
                    : "rgba(54, 162, 235, 0.7)"
                ),
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                borderRadius: 5,
              },
              {
                label: "Doanh thu kỳ trước (VNĐ)",
                data: previousData,
                backgroundColor: previousData.map((count) =>
                  count === Math.max(...previousData)
                    ? "rgba(108, 117, 125, 1)"
                    : "rgba(108, 117, 125, 0.7)"
                ),
                borderColor: "rgba(108, 117, 125, 1)",
                borderWidth: 1,
                borderRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: Math.max(1000000, Math.ceil(maxCount / 10)),
                  precision: 0,
                  callback: (value) =>
                    this.formatCurrency(value).replace("₫", ""),
                },
                title: {
                  display: true,
                  text: "Doanh thu (VNĐ)",
                  font: {
                    size: 14,
                  },
                },
              },
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
                title: {
                  display: true,
                  text:
                    this.selectedRevenueFilter === "weekday"
                      ? "Thứ trong tuần"
                      : "Thời gian",
                  font: {
                    size: 14,
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0].label,
                  label: (context) =>
                    `${context.dataset.label}: ${this.formatCurrency(
                      context.raw
                    )}`,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Lỗi khi vẽ biểu đồ:", error);
      }
    },

    updatePieChart() {
      if (this.pieChartInstance) {
        this.pieChartInstance.destroy();
      }

      const ctx = this.$refs.pieChartCanvas.getContext("2d");
      this.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: this.pieData[this.selectedPieFilter],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.label}: ${this.formatCurrency(context.raw)}`,
              },
            },
          },
        },
      });
    },

    handleRefund(transactionId) {
      console.log(`Hoàn tiền cho giao dịch ${transactionId}`);
    },
  },
  beforeUnmount() {
    if (this.revenueChartInstance) {
      this.revenueChartInstance.destroy();
    }
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }
  },
};
</script>

<style scoped>
/* Main Container */
.transaction-management {
  padding: 30px;
  max-width: 100%;
  background: linear-gradient(to bottom, #f0f5ff, #f8fafc);
  border-radius: 16px;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Header */
h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

h2:after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #2563eb, #60a5fa);
  border-radius: 4px;
}

.back-link {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  width: fit-content;
}

.back-link:hover {
  color: #1e40af;
  transform: translateX(-5px);
  background-color: rgba(37, 99, 235, 0.15);
}

.back-link::before {
  content: "\f060";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Alert */
.alert-danger {
  background: #fee2e2;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #991b1b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Header Layout */
.d-flex.justify-content-between {
  margin-bottom: 20px;
  align-items: center;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-success {
  background: #10b981;
  border: none;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background: #dc2626;
  border: none;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
}

.btn-outline-primary {
  border-color: #2563eb;
  color: #2563eb;
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Revenue Cards */
.row.mb-4 {
  gap: 20px;
  margin-bottom: 30px;
}

.col-lg-3.col-md-6 {
  transition: transform 0.4s ease;
}

.col-lg-3.col-md-6:hover {
  transform: translateY(-8px);
}

.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 40px rgba(14, 30, 73, 0.12);
  transform: translateY(-5px);
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-body h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
}

.card-body p.text-success,
.card-body span.text-success {
  font-size: 1.5rem;
  font-weight: 700;
  color: #047857;
  position: relative;
  display: inline-block;
}

.card-body p.text-success:before,
.card-body span.text-success:before {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #047857, #10b981);
  border-radius: 2px;
  opacity: 0.6;
}

.card-body span.text-danger {
  font-size: 1rem;
  font-weight: 500;
  color: #dc2626;
}

/* Chart Cards */
.row {
  gap: 20px;
}

.col-lg-7.col-md-12,
.col-lg-5.col-md-12 {
  transition: transform 0.4s ease;
}

.col-lg-7.col-md-12:hover,
.col-lg-5.col-md-12:hover {
  transform: translateY(-5px);
}

.card.p-3 {
  padding: 24px !important;
}

.card.p-3 h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5eaef;
}

.form-control-sm {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.form-control-sm:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

.form-select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  outline: none;
}

canvas {
  width: 100% !important;
  max-height: 350px !important;
  padding: 10px;
}

/* Table */
.card.mt-5 {
  margin-top: 30px;
}

.table {
  margin: 0;
  font-size: 0.9rem;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
}

.table th,
.table td {
  padding: 12px;
  border-color: #e5e7eb;
  vertical-align: middle;
}

.table th {
  background: #d1fae5;
  color: #065f46;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.table td {
  color: #1f2937;
}

.table-hover tbody tr:hover {
  background: #f8fafc;
  transition: background 0.2s ease;
}

/* Badges */
.badge {
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: none;
}

.badge.bg-success {
  background: #d1fae5;
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2;
  color: #991b1b;
}

/* Pagination */
.d-flex.justify-content-between.p-3 {
  border-top: 1px solid #e5e7eb;
  padding: 16px !important;
}

/* Loading & Error States */
.text-center.py-5 {
  padding: 30px;
  color: #64748b;
  font-size: 1rem;
}

.text-center.py-5 i {
  font-size: 1.5rem;
  color: #2563eb;
  margin-bottom: 10px;
}

.text-center.py-5 i.fa-spinner {
  font-size: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text-danger {
  color: #dc2626;
  font-size: 0.95rem;
  padding: 30px;
}

/* Modal */
.modal-dialog {
  max-width: 600px;
}

.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: #f1f5f9;
  border-bottom: 1px solid #e5e7eb;
  padding: 18px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 12px 0;
  font-size: 0.9rem;
  color: #475569;
}

.modal-body strong {
  color: #1f2937;
  font-weight: 600;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 16px;
}

.btn-secondary {
  background: #6b7280;
  border: none;
  color: #ffffff;
  padding: 8px 16px;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(107, 114, 128, 0.3);
}

/* Responsive */
@media (max-width: 992px) {
  .row.mb-4,
  .row {
    gap: 20px;
  }

  .col-lg-3.col-md-6,
  .col-lg-7.col-md-12,
  .col-lg-5.col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .d-flex.gap-2 {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .transaction-management {
    padding: 20px;
  }

  h2 {
    font-size: 1.75rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .btn-success {
    width: 100%;
  }

  .table th,
  .table td {
    padding: 8px;
    font-size: 0.8rem;
  }

  .card-body h5 {
    font-size: 1rem;
  }

  .card-body p.text-success,
  .card-body span.text-success {
    font-size: 1.25rem;
  }

  .form-select,
  .form-control-sm {
    width: 100%;
  }

  canvas {
    max-height: 300px !important;
  }

  .d-flex.gap-2 {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 1.5rem;
  }

  .table {
    font-size: 0.8rem;
  }

  .btn-success,
  .btn-danger,
  .btn-outline-primary,
  .btn-secondary {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .card-body p.text-success,
  .card-body span.text-success,
  .card-body span.text-danger {
    font-size: 1rem;
  }

  .modal-dialog {
    margin: 16px;
  }

  canvas {
    max-height: 280px !important;
  }
}
</style>
