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

/* Biểu đồ */
.card.mt-4 {
  padding: 1.5rem;
}

.form-control-sm,
.form-select {
  border-radius: 8px;
  font-size: 0.9rem;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.form-control-sm:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  outline: none;
}

.btn-sm {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

/* Canvas biểu đồ */
canvas {
  max-height: 350px !important;
  width: 100% !important;
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
@media (max-width: 992px) {
  .row.text-center .col-4 {
    margin-bottom: 1.5rem;
  }

  .card.mt-4 {
    margin-top: 1.5rem;
  }

  .d-flex.gap-2 {
    flex-wrap: wrap;
  }

  .form-control-sm,
  .form-select {
    width: 100% !important;
    margin-bottom: 0.75rem;
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
}
</style>
