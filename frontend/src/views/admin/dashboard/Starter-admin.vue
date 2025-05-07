<template>
  <div class="admin-starter">
    <h1>Xin Chào Long Ma Bắc Giang</h1>
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

          <!-- Biểu đồ bài đăng -->
          <div class="card mt-4 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5>Số lượng bài đăng theo thời gian</h5>
              <div class="d-flex gap-2 align-items-center">
                <div v-if="showDatePickers" class="d-flex gap-2">
                  <input
                    type="date"
                    v-model="startDate"
                    class="form-control form-control-sm"
                    style="width: 140px"
                    @change="debouncedFetchPostData"
                  />
                  <input
                    type="date"
                    v-model="endDate"
                    class="form-control form-control-sm"
                    style="width: 140px"
                    @change="debouncedFetchPostData"
                  />
                </div>
                <select
                  v-model="selectedPostFilter"
                  @change="debouncedFetchPostData"
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
                  :class="
                    showDatePickers ? 'btn-danger' : 'btn-outline-primary'
                  "
                >
                  <i
                    class="fas"
                    :class="showDatePickers ? 'fa-times' : 'fa-calendar'"
                  ></i>
                </button>
              </div>
            </div>

            <div v-if="postChartLoading" class="text-center py-5">
              <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
            </div>
            <div
              v-else-if="postChartError"
              class="text-center py-5 text-danger"
            >
              <i class="fas fa-exclamation-triangle"></i> {{ postChartError }}
            </div>
            <div v-else-if="jobsData.length === 0" class="text-center py-5">
              <i class="fas fa-info-circle"></i> Không có dữ liệu trong khoảng
              thời gian này
            </div>
            <canvas
              v-else
              ref="postChartCanvas"
              style="min-height: 300px"
            ></canvas>
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
                backgroundColor: data.map((count) =>
                  count === maxCount
                    ? "rgba(54, 162, 235, 1)"
                    : "rgba(54, 162, 235, 0.7)"
                ),
                borderColor: "rgba(54, 162, 235, 1)",
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
                  stepSize: Math.max(1, Math.ceil(maxCount / 10)),
                  precision: 0,
                },
                title: {
                  display: true,
                  text: "Số lượng bài đăng",
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
                    this.selectedPostFilter === "weekday"
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
                  label: (context) => `Số lượng: ${context.raw}`,
                },
              },
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
/* Main Dashboard Styles */
.admin-starter {
  padding: 30px;
  max-width: 100%;
  background: linear-gradient(to bottom, #f0f5ff, #f8fafc);
  border-radius: 16px;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

h1:after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #2563eb, #60a5fa);
  border-radius: 4px;
}

.mb-3.d-inline-block {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-bottom: 20px !important;
  padding: 8px 16px;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  width: fit-content;
}

.mb-3.d-inline-block:hover {
  color: #1e40af;
  transform: translateX(-5px);
  background-color: rgba(37, 99, 235, 0.15);
}

.mb-3.d-inline-block::before {
  content: "\f060";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

.container-fluid {
  margin-top: 30px;
}

/* Card Styles */
.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.card:hover {
  box-shadow: 0 12px 40px rgba(14, 30, 73, 0.12);
  transform: translateY(-5px);
}

.card.p-3 {
  padding: 24px !important;
}

.card h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.card p.text-success {
  font-size: 1.5rem;
  font-weight: 700;
  color: #047857;
  position: relative;
  display: inline-block;
}

.card p.text-success:before {
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

.col-4 {
  transition: transform 0.4s ease;
}

.col-4:hover {
  transform: translateY(-8px);
}

/* Statistics Cards Row */
.row.text-center {
  margin-bottom: 30px;
}

/* Chart Card */
.card.mt-4 {
  margin-top: 30px;
}

.card.mt-4 h5 {
  font-size: 1.25rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5eaef;
}

.d-flex.justify-content-between {
  margin-bottom: 20px;
  align-items: center;
}

/* Form Elements */
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

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-outline-primary {
  border-color: #2563eb;
  color: #2563eb;
}

.btn-outline-primary:hover {
  background-color: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.btn-danger {
  background-color: #dc2626;
  border-color: #dc2626;
}

.btn-danger:hover {
  background-color: #b91c1c;
  border-color: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
}

/* Chart Canvas */
canvas {
  width: 100% !important;
  max-height: 350px !important;
  padding: 10px;
}

/* Notification Card */
.card-header.bg-primary {
  background: linear-gradient(to right, #2563eb, #3b82f6) !important;
  padding: 18px;
  border-radius: 16px 16px 0 0;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 24px;
  max-height: 450px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.card-body::-webkit-scrollbar {
  width: 8px;
}

.card-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.card-body::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Loading & Error Messages */
.text-center {
  padding: 30px;
  color: #64748b;
  font-size: 1rem;
}

.text-center i {
  font-size: 1.5rem;
  color: #2563eb;
  margin-bottom: 10px;
}

.text-center.py-5 i.fa-spinner {
  font-size: 2rem;
  color: #2563eb;
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

.text-danger {
  font-size: 0.95rem;
  color: #dc2626;
  padding: 30px;
}

/* Notification Items */
.d-flex.justify-content-between.align-items-center {
  gap: 10px;
  padding: 10px 0;
}

.d-flex p {
  font-size: 0.95rem;
  color: #1e293b;
  margin: 0;
}

.d-flex p b {
  font-weight: 600;
  color: #0f172a;
}

.card-body span {
  font-size: 0.9rem;
  color: #475569;
  display: block;
  margin-bottom: 12px;
  line-height: 1.5;
}

hr {
  border-top: 1px solid #e2e8f0;
  margin: 15px 0;
  opacity: 0.6;
}

.gap-2 {
  gap: 0.5rem;
}

/* Enhanced Responsive Layout */
@media (max-width: 1200px) {
  .row.text-center {
    flex-direction: row;
  }
}

@media (max-width: 992px) {
  .row {
    gap: 20px;
  }

  .col-lg-7.col-md-12,
  .col-lg-5.col-md-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .row.text-center {
    display: flex;
    flex-direction: row;
  }

  .row.text-center .col-4 {
    flex: 0 0 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
    margin-right: 16px;
  }

  .row.text-center .col-4:last-child {
    margin-right: 0;
  }
}

@media (max-width: 768px) {
  .admin-starter {
    padding: 20px;
  }

  h1 {
    font-size: 1.75rem;
  }

  .card.p-3 {
    padding: 18px !important;
  }

  .card h5 {
    font-size: 1rem;
  }

  .card p.text-success {
    font-size: 1.25rem;
  }

  .form-select,
  .form-control-sm {
    width: 100%;
  }

  .card-header h3 {
    font-size: 1.25rem;
  }

  .card-body {
    padding: 18px;
  }

  .row.text-center {
    flex-direction: column;
  }

  .row.text-center .col-4 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }
}

@media (max-width: 576px) {
  .card-body span,
  .d-flex p {
    font-size: 0.85rem;
  }

  canvas {
    max-height: 280px !important;
  }

  .text-center,
  .text-danger {
    padding: 20px;
  }

  .d-flex.gap-2 {
    flex-direction: column;
  }

  .d-flex.justify-content-between.align-items-center {
    flex-direction: column;
    align-items: flex-start !important;
  }
}
</style>
