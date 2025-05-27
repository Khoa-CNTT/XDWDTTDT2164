<template>
  <div class="admin-starter">
    <h1>Xin Chào Quản trị viên</h1>
    <router-link to="/" class="mb-3 d-inline-block">
      Quay trở lại trang chủ?
    </router-link>
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-7 col-md-12">
          <div class="row text-center">
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số bài đăng</h5>
                <p class="text-success">{{ totalJobs }} Bài đang hoạt động</p>
              </div>
            </div>
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số nhà tuyển dụng</h5>
                <p class="text-success">{{ totalEmployers }} nhà tuyển dụng</p>
              </div>
            </div>
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số ứng viên</h5>
                <p class="text-success">{{ totalCandidates }} ứng viên</p>
              </div>
            </div>
          </div>

          <!-- Biểu đồ bài đăng - Improved -->
          <div class="chart-container mt-4">
            <div class="chart-header">
              <div class="chart-title">
                <h5>
                  <i class="fas fa-chart-bar chart-icon"></i>
                  Số lượng bài đăng theo thời gian
                </h5>
              </div>
              <div class="chart-controls">
                <div v-if="showDatePickers" class="date-range-picker">
                  <div class="date-input-group">
                    <label>Từ ngày:</label>
                    <input
                      type="date"
                      v-model="startDate"
                      class="date-input"
                      @change="debouncedFetchPostData"
                    />
                  </div>
                  <div class="date-input-group">
                    <label>Đến ngày:</label>
                    <input
                      type="date"
                      v-model="endDate"
                      class="date-input"
                      @change="debouncedFetchPostData"
                    />
                  </div>
                </div>
                <div class="control-buttons">
                  <select
                    v-model="selectedPostFilter"
                    @change="debouncedFetchPostData"
                    class="filter-select"
                  >
                    <option value="day">Theo ngày</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                    <option value="weekday">Theo thứ</option>
                  </select>
                  <button
                    @click="toggleDatePickers"
                    class="date-toggle-btn"
                    :class="{ active: showDatePickers }"
                  >
                    <i
                      class="fas"
                      :class="showDatePickers ? 'fa-times' : 'fa-calendar'"
                    ></i>
                    <span v-if="!showDatePickers">Tùy chỉnh</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="chart-content">
              <div v-if="postChartLoading" class="chart-loading">
                <div class="loading-spinner">
                  <div class="spinner"></div>
                  <p>Đang tải dữ liệu...</p>
                </div>
              </div>
              <div v-else-if="postChartError" class="chart-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>{{ postChartError }}</p>
              </div>
              <div v-else-if="jobsData.length === 0" class="chart-empty">
                <i class="fas fa-info-circle"></i>
                <p>Không có dữ liệu trong khoảng thời gian này</p>
              </div>
              <div v-else class="chart-wrapper">
                <canvas ref="postChartCanvas" class="chart-canvas"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5 col-md-12">
          <div class="card">
            <div
              class="card-header text-center bg-primary text-white align-items-center"
              style="padding: 10px"
            >
              <h3>THÔNG BÁO</h3>
            </div>
            <div class="card-body">
              <div v-if="notificationStore.isLoading" class="text-center">
                <i class="fas fa-spinner fa-spin"></i> Đang tải thông báo...
              </div>
              <div
                v-else-if="notificationStore.error"
                class="text-center text-danger"
              >
                {{ notificationStore.error }}
              </div>
              <div
                v-else-if="notificationStore.notifications.length === 0"
                class="text-center"
              >
                Không có thông báo nào.
              </div>
              <div
                v-else
                v-for="notification in notificationStore.notifications"
                :key="notification.id"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <p>
                    <b>{{ notification.title }}</b>
                  </p>
                  <p>{{ formatTime(notification.createdAt) }}</p>
                </div>
                <span>{{ notification.message }}</span>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { debounce } from "lodash";
import { useNotificationStore } from "@stores/useNotificationStore";
import { getJobsForTime } from "@/apis/job";
import { getDashboardOverview } from "@/apis/dashboard";

Chart.register(...registerables);

// Cập nhật script
export default {
  setup() {
    const notificationStore = useNotificationStore();
    return { notificationStore };
  },
  data() {
    return {
      postChartInstance: null,
      selectedPostFilter: "month",
      jobsData: [],
      postChartLoading: false,
      postChartError: null,
      showDatePickers: false,
      startDate: "",
      endDate: "",
      totalJobs: 0,
      totalCandidates: 0,
      totalEmployers: 0,
    };
  },
  mounted() {
    this.fetchDashboardOverview();
    // Sử dụng nextTick để đảm bảo DOM đã render
    this.$nextTick(() => {
      this.fetchPostData();
    });
    this.fetchNotifications();
  },
  watch: {
    // Theo dõi sự thay đổi của jobsData
    jobsData: {
      handler(newData) {
        if (newData.length > 0) {
          this.$nextTick(() => {
            this.updatePostChart();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    debouncedFetchPostData: debounce(function () {
      this.fetchPostData();
    }, 500),

    toggleDatePickers() {
      this.showDatePickers = !this.showDatePickers;
      if (!this.showDatePickers) {
        this.startDate = "";
        this.endDate = "";
        this.debouncedFetchPostData();
      }
    },

    async fetchDashboardOverview() {
      try {
        const response = await getDashboardOverview();
        this.totalJobs = response.data.jobCount || 0;
        this.totalCandidates = response.data.candidateCount || 0;
        this.totalEmployers = response.data.employerCount || 0;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tổng quan dashboard:", error);
      }
    },

    async fetchPostData() {
      try {
        this.postChartLoading = true;
        this.postChartError = null;

        if (
          this.startDate &&
          this.endDate &&
          new Date(this.startDate) > new Date(this.endDate)
        ) {
          this.postChartError =
            "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu";
          this.postChartLoading = false;
          return;
        }

        const query = { period: this.selectedPostFilter };
        if (this.startDate) query.startDate = this.startDate;
        if (this.endDate) query.endDate = this.endDate;

        console.log("Đang gửi yêu cầu với query:", query);
        const response = await getJobsForTime(query);
        console.log("Dữ liệu nhận được:", response.data);

        this.jobsData = response.data || [];

        // Không gọi updatePostChart ở đây, để Watch xử lý
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài đăng:", error);
        this.postChartError = `Không thể tải dữ liệu biểu đồ: ${
          error.message || "Lỗi không xác định"
        }`;
      } finally {
        this.postChartLoading = false;
      }
    },

    async fetchNotifications() {
      try {
        await this.notificationStore.fetchNotifications();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thông báo:", error);
      }
    },

    formatTime(createdAt) {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    },

    updatePostChart() {
      if (this.postChartInstance) {
        console.log("Hủy biểu đồ cũ");
        this.postChartInstance.destroy();
      }

      if (this.jobsData.length === 0) {
        console.warn("Không có dữ liệu để vẽ biểu đồ");
        return;
      }

      if (!this.$refs.postChartCanvas) {
        console.warn("Canvas chưa sẵn sàng");
        // Thử lại sau một khoảng thời gian
        setTimeout(() => {
          this.updatePostChart();
        }, 100);
        return;
      }

      try {
        const ctx = this.$refs.postChartCanvas.getContext("2d");
        const labels = this.jobsData.map((item) => item.display);
        const data = this.jobsData.map((item) => item.count);
        const maxCount = Math.max(...data, 1);

        console.log("Dữ liệu biểu đồ:", { labels, data });

        // Đảm bảo canvas có kích thước
        this.$refs.postChartCanvas.width =
          this.$refs.postChartCanvas.parentNode.offsetWidth;
        this.$refs.postChartCanvas.height = 300;

        this.postChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Số lượng bài đăng",
                data,
                backgroundColor: data.map((count, index) => {
                  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                  if (count === maxCount) {
                    gradient.addColorStop(0, "rgba(75, 192, 192, 0.9)");
                    gradient.addColorStop(1, "rgba(75, 192, 192, 0.3)");
                  } else {
                    gradient.addColorStop(0, "rgba(54, 162, 235, 0.8)");
                    gradient.addColorStop(1, "rgba(54, 162, 235, 0.2)");
                  }
                  return gradient;
                }),
                borderColor: data.map((count) =>
                  count === maxCount
                    ? "rgba(75, 192, 192, 1)"
                    : "rgba(54, 162, 235, 1)"
                ),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: Math.max(1, Math.ceil(maxCount / 10)),
                  precision: 0,
                  color: "#6B7280",
                  font: {
                    size: 12,
                    family: "Inter, sans-serif",
                  },
                },
                title: {
                  display: true,
                  text: "Số lượng bài đăng",
                  color: "#374151",
                  font: {
                    size: 14,
                    weight: "600",
                    family: "Inter, sans-serif",
                  },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                  drawBorder: false,
                },
              },
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                  color: "#6B7280",
                  font: {
                    size: 12,
                    family: "Inter, sans-serif",
                  },
                },
                title: {
                  display: true,
                  text:
                    this.selectedPostFilter === "weekday"
                      ? "Thứ trong tuần"
                      : "Thời gian",
                  color: "#374151",
                  font: {
                    size: 14,
                    weight: "600",
                    family: "Inter, sans-serif",
                  },
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "#374151",
                  font: {
                    size: 13,
                    weight: "500",
                    family: "Inter, sans-serif",
                  },
                  usePointStyle: true,
                  pointStyle: "circle",
                  padding: 20,
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                  size: 14,
                  weight: "600",
                  family: "Inter, sans-serif",
                },
                bodyFont: {
                  size: 13,
                  family: "Inter, sans-serif",
                },
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0].label,
                  label: (context) => `Số lượng: ${context.raw} bài đăng`,
                },
              },
            },
            animation: {
              duration: 800,
              easing: "easeInOutQuart",
            },
          },
        });
        console.log("Biểu đồ đã được tạo thành công");
      } catch (error) {
        console.error("Lỗi khi vẽ biểu đồ:", error);
      }
    },
  },
  beforeUnmount() {
    if (this.postChartInstance) {
      this.postChartInstance.destroy();
    }
  },
};
</script>

<style scoped>
/* Tổng thể */
.admin-starter {
  font-family: "Inter", sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem 1rem;
}

/* Tiêu đề */
h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Link quay lại */
a.mb-3.d-inline-block {
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

a.mb-3.d-inline-block:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Container */
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

/* Card thống kê */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.card p.text-success {
  font-size: 1rem;
  font-weight: 500;
  color: #28a745;
}

/* ===== IMPROVED CHART STYLES ===== */
.chart-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.chart-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-title {
  flex: 1;
  min-width: 250px;
}

.chart-title h5 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1rem;
}

.chart-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.date-range-picker {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-input-group label {
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
}

.date-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 140px;
}

.date-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.control-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.filter-select {
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.date-toggle-btn {
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.date-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.date-toggle-btn.active {
  background: rgba(220, 53, 69, 0.9);
  border-color: rgba(220, 53, 69, 0.5);
}

.date-toggle-btn.active:hover {
  background: rgba(200, 35, 51, 0.9);
}

.chart-content {
  padding: 2rem;
  min-height: 400px;
  position: relative;
}

.chart-wrapper {
  position: relative;
  height: 350px;
  width: 100%;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px;
}

/* Loading States */
.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
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

.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #dc3545;
  text-align: center;
}

.chart-error i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
  text-align: center;
}

.chart-empty i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Thông báo */
.card-header.bg-primary {
  border-radius: 12px 12px 0 0;
  padding: 1rem;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.card-body p {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.card-body p b {
  font-weight: 600;
  color: #1a1a1a;
}

.card-body span {
  font-size: 0.95rem;
  color: #666;
  display: block;
  margin-top: 0.25rem;
}

.card-body hr {
  margin: 1rem 0;
  border-color: #e0e0e0;
}

/* Loading và Error */
.text-center.py-5 {
  color: #666;
  font-size: 1rem;
}

.text-center.py-5 i {
  margin-right: 0.5rem;
}

.text-danger {
  color: #dc3545 !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }

  .chart-controls {
    align-items: stretch;
  }

  .date-range-picker {
    flex-direction: column;
    align-items: stretch;
  }

  .control-buttons {
    justify-content: stretch;
  }

  .filter-select,
  .date-toggle-btn {
    flex: 1;
  }
}

@media (max-width: 992px) {
  .row.text-center .col-4 {
    margin-bottom: 1.5rem;
  }

  .chart-container {
    margin-top: 1.5rem;
  }

  .chart-header {
    padding: 1rem;
  }

  .chart-content {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .date-range-picker {
    flex-direction: column;
    gap: 0.5rem;
  }

  .control-buttons {
    flex-direction: column;
  }

  .date-input {
    width: 100%;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.5rem;
  }

  .card h5 {
    font-size: 1rem;
  }

  .card p.text-success {
    font-size: 0.9rem;
  }

  .card-header h3 {
    font-size: 1.25rem;
  }

  .chart-title h5 {
    font-size: 1.1rem;
  }

  .chart-content {
    padding: 0.75rem;
  }
}
</style>
