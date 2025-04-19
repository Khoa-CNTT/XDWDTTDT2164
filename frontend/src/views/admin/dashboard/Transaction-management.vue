<template>
  <div class="transaction-management">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h2>Quản Lý Giao Dịch</h2>
        <a href="blank">Quay trở lại trang chủ?</a>
      </div>
      <div>
        <button class="btn btn-success">
          Xuất file CSV <i class="fa-solid fa-circle-down"></i>
        </button>
      </div>
    </div>

    <!-- Card doanh thu -->
    <div class="row mt-5">
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng doanh thu hôm nay</h5>
            <span class="text-success">{{ formatCurrency(todayRevenue) }}</span>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5>Tổng doanh thu tháng này</h5>
            <span class="text-success">{{ formatCurrency(monthRevenue) }}</span>
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
            <span class="text-success">{{
              formatCurrency(walletDeposits)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ doanh thu -->
    <div class="row mt-4">
      <div class="col-lg-7 col-md-12">
        <div class="card p-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Doanh thu theo thời gian</h5>
            <select
              v-model="selectedRevenueFilter"
              @change="updateRevenueChart"
              class="form-select"
              style="width: 100px"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <canvas ref="revenueChartCanvas"></canvas>
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
              style="width: 100px"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <canvas ref="pieChartCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Bảng giao dịch -->
    <div class="card mt-5">
      <table class="table table-bordered table-hover">
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
            v-for="(transaction, index) in transactions"
            :key="transaction.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ transaction.transactionId }}</td>
            <td>{{ transaction.companyName }}</td>
            <td>{{ transaction.transactionType }}</td>
            <td>{{ formatCurrency(transaction.amount) }}</td>
            <td>
              <button
                :class="
                  transaction.status === 'Thành công'
                    ? 'badge bg-success'
                    : 'badge bg-danger'
                "
              >
                {{ transaction.status }}
              </button>
            </td>
            <td>{{ formatDate(transaction.paymentDate) }}</td>
            <td>
              <button
                class="btn btn-success me-2"
                data-bs-toggle="modal"
                data-bs-target="#update-modal"
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
    </div>
  </div>
</template>

<script>

import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";
import { BarController, PieController } from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
Chart.register(...registerables, BarController, PieController);

export default {
  name: "TransactionManagement",
  setup() {
    // Dữ liệu mẫu (có thể thay thế bằng dữ liệu từ API)
    const todayRevenue = ref(5000000);
    const monthRevenue = ref(70000000);
    const transactionStats = ref({ success: 90, failed: 10 });
    const walletDeposits = ref(60000000);
    const transactions = ref([
      {
        id: 1,
        transactionId: "PX01231414323",
        companyName: "Công TNHH Văn Minh",
        transactionType: "Thanh toán bài đăng",
        amount: 50000,
        status: "Thành công",
        paymentDate: "2025-04-03T22:50:00",
      },
    ]);

    // Bộ lọc cho biểu đồ
    const selectedRevenueFilter = ref("day");
    const selectedPieFilter = ref("day");

    // Tham chiếu đến canvas
    const revenueChartCanvas = ref(null);
    const pieChartCanvas = ref(null);

    // Biến lưu trữ instance của biểu đồ
    let revenueChartInstance = null;
    let pieChartInstance = null;

    // Dữ liệu mẫu cho biểu đồ (có thể thay thế bằng dữ liệu từ API)
    const revenueData = {
      day: {
        labels: ["01/04", "02/04", "03/04", "04/04", "05/04", "06/04", "07/04"],
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: [
              2000000, 3000000, 5000000, 4000000, 6000000, 3500000, 4500000,
            ],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      month: {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: [15000000, 20000000, 25000000, 70000000],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      year: {
        labels: ["2023", "2024", "2025"],
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: [100000000, 150000000, 200000000],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    };

    const pieData = {
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
    };

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    // Hàm định dạng ngày
    const formatDate = (date) => {
      return new Date(date).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Hàm cập nhật biểu đồ cột (Doanh thu theo thời gian)
    const updateRevenueChart = () => {
      if (revenueChartInstance) {
        revenueChartInstance.destroy();
      }

      const ctx = revenueChartCanvas.value.getContext("2d");
      revenueChartInstance = new Chart(ctx, {
        type: "bar", // Biểu đồ cột
        data: revenueData[selectedRevenueFilter.value],
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Doanh thu (VNĐ)",
              },
              ticks: {
                callback: (value) => formatCurrency(value).replace("₫", ""),
              },
            },
            x: {
              title: {
                display: true,
                text:
                  selectedRevenueFilter.value === "day"
                    ? "Ngày"
                    : selectedRevenueFilter.value === "month"
                    ? "Tháng"
                    : "Năm",
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
                label: (context) =>
                  `${context.dataset.label}: ${formatCurrency(context.raw)}`,
              },
            },
          },
        },
      });
    };

    // Hàm cập nhật biểu đồ tròn (Phân bổ doanh thu)
    const updatePieChart = () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }

      const ctx = pieChartCanvas.value.getContext("2d");
      pieChartInstance = new Chart(ctx, {
        type: "pie", // Biểu đồ tròn
        data: pieData[selectedPieFilter.value],
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.label}: ${formatCurrency(context.raw)}`,
              },
            },
          },
        },
      });
    };

    // Hàm xử lý hoàn tiền (có thể gọi API)
    const handleRefund = (transactionId) => {
      // Gọi API hoàn tiền (ví dụ)
      console.log(`Hoàn tiền cho giao dịch ${transactionId}`);
      // Sau khi hoàn tiền thành công, cập nhật lại danh sách giao dịch
      // transactions.value = transactions.value.filter(t => t.id !== transactionId);
    };

    // Khởi tạo biểu đồ khi component được mount
    onMounted(() => {
      updateRevenueChart();
      updatePieChart();
    });

    // Hủy biểu đồ khi component bị hủy
    onBeforeUnmount(() => {
      if (revenueChartInstance) {
        revenueChartInstance.destroy();
      }
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
    });

    return {
      todayRevenue,
      monthRevenue,
      transactionStats,
      walletDeposits,
      transactions,
      selectedRevenueFilter,
      selectedPieFilter,
      revenueChartCanvas,
      pieChartCanvas,
      formatCurrency,
      formatDate,
      updateRevenueChart,
      updatePieChart,
      handleRefund,
    };
  },
};
</script>

<style scoped>
.transaction-management {
  padding: 20px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.table {
  margin-bottom: 0;
}

.table th,
.table td {
  vertical-align: middle;
}

canvas {
  max-height: 300px;
}

.col-lg-3 {
    transition: transform 0.3s ease;
}

.col-lg-3:hover {
    transform: translateY(-5px);
}
</style>
