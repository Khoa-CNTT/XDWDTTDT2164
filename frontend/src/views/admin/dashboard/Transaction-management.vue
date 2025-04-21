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
    <div class="row">
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
    <div class="row">
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

<
<style scoped>
/* General container */
.transaction-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc; /* Light background for depth */
  border-radius: 12px;
  min-height: 100vh;
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b; /* Dark slate for contrast */
  margin-bottom: 10px;
}

a[href="blank"] {
  font-size: 0.95rem;
  color: #2563eb; /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

a[href="blank"]:hover {
  color: #1e40af; /* Darker blue on hover */
  transform: translateX(-3px); /* Subtle shift */
}

a[href="blank"]::before {
  content: "\f060"; /* Font Awesome arrow-left */
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Header layout */
.d-flex.justify-content-between {
  margin-bottom: 20px;
  align-items: center;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success {
  background: #10b981; /* Green */
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.2);
}

.btn-success i {
  font-size: 1rem;
}

.btn-danger {
  background: #ef4444; /* Red */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

/* Revenue cards */
.row.mt-5 {
  gap: 20px; /* Add gap for better spacing */
}

.col-lg-3.col-md-6 {
  transition: transform 0.3s ease;
}

.col-lg-3.col-md-6:hover {
  transform: translateY(-5px); /* Lift effect on hover */
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background: #ffffff;
  overflow: hidden;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-body h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body span.text-success {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46; /* Dark green */
}

.card-body span.text-danger {
  font-size: 1rem;
  font-weight: 500;
  color: #991b1b; /* Dark red */
}

/* Chart cards */
.row.mt-4 {
  gap: 20px;
}

.col-lg-7.col-md-12,
.col-lg-5.col-md-12 {
  transition: transform 0.3s ease;
}

.col-lg-7.col-md-12:hover,
.col-lg-5.col-md-12:hover {
  transform: translateY(-5px);
}

.card.p-3 {
  padding: 20px;
}

.card.p-3 h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.form-select {
  border: 1px solid #d1d5db; /* Light gray */
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  width: 120px; /* Slightly wider */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

canvas {
  max-height: 300px;
  width: 100%;
}

/* Table */
.card.mt-5 {
  margin-top: 30px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin-bottom: 0;
  font-size: 0.95rem;
  border-collapse: separate;
  border-spacing: 0;
}

.table th,
.table td {
  vertical-align: middle;
  padding: 12px 15px;
  border-color: #e2e8f0; /* Light border */
}

.table th {
  background: #d1fae5; /* Light green header */
  color: #065f46; /* Dark green text */
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc; /* Subtle hover effect */
  transition: background 0.2s ease;
}

.table td {
  color: #334155; /* Dark slate text */
}

/* Badges */
.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
  border: none;
  cursor: default;
}

.badge.bg-success {
  background: #d1fae5; /* Light green */
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2; /* Light red */
  color: #991b1b;
}

/* Responsive */
@media (max-width: 992px) {
  .row.mt-5,
  .row.mt-4 {
    gap: 15px;
  }

  .col-lg-3.col-md-6 {
    flex: 0 0 100%;
    max-width: 100%; /* Full-width cards on medium screens */
  }

  .col-lg-7.col-md-12,
  .col-lg-5.col-md-12 {
    flex: 0 0 100%;
    max-width: 100%; /* Full-width charts on medium screens */
  }
}

@media (max-width: 768px) {
  .transaction-management {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .btn-success {
    width: 100%; /* Full-width button on mobile */
  }

  .table th,
  .table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .card-body h5 {
    font-size: 1rem;
  }

  .card-body span.text-success {
    font-size: 1.1rem;
  }

  .form-select {
    width: 100%; /* Full-width select on mobile */
  }
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .btn-success,
  .btn-danger {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  canvas {
    max-height: 250px;
  }

  .card-body span.text-success,
  .card-body span.text-danger {
    font-size: 0.95rem;
  }
}
</style>
>
