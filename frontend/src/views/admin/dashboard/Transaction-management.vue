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
            <th>Phương thức nạp tiền</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
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
              {{ transaction.Users.Employers.companyName }}
            </td>
            <td>{{ transaction.transactionType }}</td>
            <td>{{ formatCurrency(transaction.amount) }}</td>
            <td>{{ transaction.paymentMethod }}</td>
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
import { Chart, registerables } from "chart.js";
import { debounce } from "lodash";
import { useWalletStore } from "@/stores/useWalletStore";
import { exportFileCsv, getPaymentTimeApi } from "@/apis/wallet";
import { getPaymentOverview } from "@/apis/dashboard";

// Register Chart.js components
Chart.register(...registerables);

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
              data: [3000000, 1500000, 500000],
              backgroundColor: [
                "rgba(40, 167, 69, 0.8)",
                "rgba(0, 123, 255, 0.8)",
                "rgba(255, 193, 7, 0.8)",
              ],
              borderColor: [
                "rgba(40, 167, 69, 1)",
                "rgba(0, 123, 255, 1)",
                "rgba(255, 193, 7, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        month: {
          labels: ["Thanh toán bài đăng", "Nạp ví", "Hoàn tiền"],
          datasets: [
            {
              data: [40000000, 25000000, 5000000],
              backgroundColor: [
                "rgba(40, 167, 69, 0.8)",
                "rgba(0, 123, 255, 0.8)",
                "rgba(255, 193, 7, 0.8)",
              ],
              borderColor: [
                "rgba(40, 167, 69, 1)",
                "rgba(0, 123, 255, 1)",
                "rgba(255, 193, 7, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        year: {
          labels: ["Thanh toán bài đăng", "Nạp ví", "Hoàn tiền"],
          datasets: [
            {
              data: [120000000, 70000000, 10000000],
              backgroundColor: [
                "rgba(40, 167, 69, 0.8)",
                "rgba(0, 123, 255, 0.8)",
                "rgba(255, 193, 7, 0.8)",
              ],
              borderColor: [
                "rgba(40, 167, 69, 1)",
                "rgba(0, 123, 255, 1)",
                "rgba(255, 193, 7, 1)",
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
        this.transactionStats = {
          success: response.data.success || 0,
          failed: response.data.failed || 0,
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

        const response = await getPaymentTimeApi(query);
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

      if (this.revenueData.length === 0 || !this.$refs.revenueChartCanvas) {
        return;
      }

      try {
        const ctx = this.$refs.revenueChartCanvas.getContext("2d");
        const labels = this.revenueData.map((item) => item.display);
        const currentData = this.revenueData.map((item) => item.revenue);
        const previousData = this.revenueData.map((item) => item.previod);

        // Đảm bảo canvas có đúng kích thước
        this.$refs.revenueChartCanvas.width =
          this.$refs.revenueChartCanvas.parentNode.clientWidth;
        this.$refs.revenueChartCanvas.height = 350;

        // Tính toán các giá trị tối đa cho scale
        const maxValue = Math.max(...currentData, ...previousData, 1);
        const step = Math.ceil(maxValue / 5 / 1000000) * 1000000;

        this.revenueChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Doanh thu hiện tại",
                data: currentData,
                backgroundColor: "rgba(40, 167, 69, 0.7)",
                borderColor: "rgba(40, 167, 69, 1)",
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
              },
              {
                label: "Doanh thu kỳ trước",
                data: previousData,
                backgroundColor: "rgba(108, 117, 125, 0.5)",
                borderColor: "rgba(108, 117, 125, 0.8)",
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10,
                right: 20,
                left: 10,
                bottom: 0,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                  drawBorder: false,
                },
                ticks: {
                  stepSize: step,
                  callback: (value) => {
                    if (value >= 1000000) {
                      return (value / 1000000).toLocaleString("vi-VN") + " Tr";
                    }
                    return value.toLocaleString("vi-VN");
                  },
                  font: {
                    size: 11,
                  },
                  color: "#6c757d",
                },
                title: {
                  display: true,
                  text: "Doanh thu (VNĐ)",
                  font: {
                    size: 12,
                    weight: "normal",
                  },
                  color: "#495057",
                },
              },
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  autoSkip: true,
                  font: {
                    size: 11,
                  },
                  color: "#6c757d",
                },
                title: {
                  display: true,
                  text:
                    this.selectedRevenueFilter === "weekday"
                      ? "Thứ trong tuần"
                      : "Thời gian",
                  font: {
                    size: 12,
                    weight: "normal",
                  },
                  color: "#495057",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: "end",
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: "circle",
                  font: {
                    size: 11,
                  },
                },
              },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                titleColor: "#212529",
                bodyColor: "#212529",
                borderColor: "#dee2e6",
                borderWidth: 1,
                padding: 10,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0].label,
                  label: (context) => {
                    const label = context.dataset.label || "";
                    const value = context.raw;
                    return `${label}: ${this.formatCurrency(value)}`;
                  },
                },
              },
            },
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
          },
        });
      } catch (error) {
        console.error("Lỗi khi vẽ biểu đồ doanh thu:", error);
      }
    },

    updatePieChart() {
      if (this.pieChartInstance) {
        this.pieChartInstance.destroy();
      }

      if (!this.$refs.pieChartCanvas) {
        return;
      }

      const ctx = this.$refs.pieChartCanvas.getContext("2d");

      // Đảm bảo canvas có đúng kích thước
      this.$refs.pieChartCanvas.width =
        this.$refs.pieChartCanvas.parentNode.clientWidth;
      this.$refs.pieChartCanvas.height = 350;

      this.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: this.pieData[this.selectedPieFilter],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 20,
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                boxWidth: 12,
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                  size: 11,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              titleColor: "#212529",
              bodyColor: "#212529",
              borderColor: "#dee2e6",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw;
                  const total = context.chart.data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${this.formatCurrency(
                    value
                  )} (${percentage}%)`;
                },
              },
            },
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: "easeOutQuart",
          },
          cutout: "50%",
        },
      });
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
  padding: 24px;
  max-width: 100%;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Header */
h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

h2:after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: #28a745;
  border-radius: 2px;
}

.back-link {
  font-size: 0.9rem;
  color: #0d6efd;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.back-link:hover {
  color: #0a58ca;
}

.back-link::before {
  content: "\f060";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.8rem;
}

/* Alert */
.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #842029;
}

/* Header Layout */
.d-flex.justify-content-between {
  margin-bottom: 20px;
  align-items: center;
}

/* Buttons */
.btn {
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-success {
  background: #198754;
  border: none;
  color: #ffffff;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
}

.btn-success:hover {
  background: #157347;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-danger {
  background: #dc3545;
  border: none;
  color: #ffffff;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #bb2d3b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary {
  border: 1px solid #0d6efd;
  color: #0d6efd;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  background-color: transparent;
}

.btn-outline-primary:hover {
  background: #0d6efd;
  color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary:disabled {
  color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 4px;
}

/* Revenue Cards */
.row.mb-4 {
  margin-bottom: 20px !important;
}

.card {
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-body h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.card-body p.text-success,
.card-body span.text-success {
  font-size: 1.2rem;
  font-weight: 600;
  color: #198754;
  margin-bottom: 0;
}

.card-body span.text-danger {
  font-size: 0.95rem;
  font-weight: 500;
  color: #dc3545;
}

/* Chart Cards */
.card.p-3 {
  padding: 1rem !important;
}

.card.p-3 h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.75rem;
}

.form-control-sm {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control-sm:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  outline: none;
}

.form-select {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  outline: none;
}

canvas {
  width: 100% !important;
  max-height: 350px !important;
}

/* Table */
.card.mt-5 {
  margin-top: 1.5rem !important;
}

.table {
  margin: 0;
  font-size: 0.875rem;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  width: 100%;
}

.table th,
.table td {
  padding: 0.75rem;
  border-color: #dee2e6;
  vertical-align: middle;
}

.table th {
  background: #d1e7dd;
  color: #0f5132;
  font-weight: 600;
  font-size: 0.8rem;
  white-space: nowrap;
}

.table td {
  color: #212529;
}

.table-hover tbody tr:hover {
  background: #f8f9fa;
}

/* Badges */
.badge {
  padding: 0.35em 0.65em;
  border-radius: 50rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: default;
}

.badge.bg-success {
  background: #d1e7dd !important;
  color: #0f5132 !important;
}

.badge.bg-danger {
  background: #f8d7da !important;
  color: #842029 !important;
}

/* Pagination */
.d-flex.justify-content-between.p-3 {
  border-top: 1px solid #dee2e6;
  padding: 1rem !important;
}

/* Loading & Error States */
.text-center.py-5 {
  padding: 2rem 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.text-center.py-5 i {
  font-size: 1.25rem;
  color: #6c757d;
  margin-right: 0.5rem;
}

.text-center.py-5 i.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text-danger {
  color: #dc3545;
}

/* Modal */
.modal-dialog {
  max-width: 500px;
}

.modal-content {
  border-radius: 6px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
}

.btn-close {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1rem;
}

.modal-body p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #212529;
}

.modal-body strong {
  font-weight: 600;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 0.75rem;
}

.btn-secondary {
  background: #6c757d;
  border: none;
  color: #ffffff;
  padding: 0.45rem 1rem;
}

.btn-secondary:hover {
  background: #5c636a;
}

/* Equal height columns */
.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
}

.row > * {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}

.col-lg-3 {
  margin-bottom: 1rem;
}

/* Responsive */
@media (min-width: 992px) {
  .col-lg-3 {
    flex: 0 0 auto;
    width: 25%;
  }

  .col-lg-5 {
    flex: 0 0 auto;
    width: 41.66666667%;
  }

  .col-lg-7 {
    flex: 0 0 auto;
    width: 58.33333333%;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .col-md-6 {
    flex: 0 0 auto;
    width: 50%;
  }

  .col-md-12 {
    flex: 0 0 auto;
    width: 100%;
  }
}

@media (max-width: 767.98px) {
  .transaction-management {
    padding: 15px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .d-flex.justify-content-between.align-items-center {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 10px;
  }

  .card.p-3 {
    padding: 0.75rem !important;
  }

  .form-select,
  .form-control-sm {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .table th,
  .table td {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  canvas {
    max-height: 250px !important;
  }

  .d-flex.gap-2 {
    flex-wrap: wrap;
  }
}

@media (max-width: 575.98px) {
  .btn-success,
  .btn-danger,
  .btn-outline-primary,
  .btn-secondary {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .d-flex.justify-content-between.p-3 {
    flex-direction: column;
    gap: 10px;
    align-items: center !important;
  }
}
</style>
