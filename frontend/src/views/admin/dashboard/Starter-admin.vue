<template>
  <div class="admin-starter">
    <h1>Xin Chào Long Ma Bắc Giang</h1>
    <router-link to="/" class="mb-3 d-inline-block"
      >Quay trở lại trang chủ?</router-link
    >
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-7 col-md-12">
          <div class="row text-center">
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số bài đăng</h5>
                <p class="text-success">100 Bài đang hoạt động</p>
              </div>
            </div>
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số nhà tuyển dụng</h5>
                <p class="text-success">
                  {{ userStore.totalPages }} nhà tuyển dụng
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card p-3">
                <h5>Tổng số ứng viên</h5>
                <p class="text-success">{{ userStore.totalPages }} ứng viên</p>
              </div>
            </div>
          </div>

          <!-- Biểu đồ bài đăng -->
          <div class="card mt-4 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5>Số lượng bài đăng theo thời gian</h5>
              <select
                v-model="selectedPostFilter"
                @change="updatePostChart"
                class="form-select"
                style="width: 100px"
              >
                <option value="day">Theo ngày</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>
            <canvas ref="postChartCanvas"></canvas>
          </div>

          <!-- Biểu đồ ứng viên -->
          <div class="card mt-4 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5>Số lượng ứng viên nộp hồ sơ</h5>
              <select
                v-model="selectedCandidateFilter"
                @change="updateCandidateChart"
                class="form-select"
                style="width: 100px"
              >
                <option value="day">Theo ngày</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>
            <canvas ref="candidateChartCanvas"></canvas>
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
              <!-- Trạng thái loading -->
              <div v-if="notificationStore.isLoading" class="text-center">
                <i class="fas fa-spinner fa-spin"></i> Đang tải thông báo...
              </div>
              <!-- Trạng thái lỗi -->
              <div
                v-else-if="notificationStore.error"
                class="text-center text-danger"
              >
                {{ notificationStore.error }}
              </div>
              <!-- Không có thông báo -->
              <div
                v-else-if="notificationStore.notifications.length === 0"
                class="text-center"
              >
                Không có thông báo nào.
              </div>
              <!-- Hiển thị danh sách thông báo -->
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
import { useNotificationStore } from "@stores/useNotificationStore";
import { useUserStore } from "@stores/useUserStore";

Chart.register(...registerables);

export default {
  setup() {
    const notificationStore = useNotificationStore();
    const userStore = useUserStore();
    return { notificationStore, userStore };
  },
  data() {
    return {
      postChartInstance: null,
      candidateChartInstance: null,
      selectedPostFilter: "day",
      selectedCandidateFilter: "day",
      BD_Data: {
        day: {
          labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
          data: [35, 50, 40, 52, 30, 12, 7],
        },
        month: {
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          data: [200, 320, 280, 400, 350, 270, 200, 320, 280, 400, 350, 270],
        },
        year: {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          data: [1200, 1500, 1800, 2100, 2500],
        },
      },
      candidateData: {
        day: {
          labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
          data: [25, 40, 30, 45, 20, 10, 5],
        },
        month: {
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          data: [180, 300, 250, 380, 320, 240, 180, 300, 250, 380, 320, 240],
        },
        year: {
          labels: ["2020", "2021", "2022", "2023", "2024"],
          data: [1000, 1300, 1600, 1900, 2200],
        },
      },
    };
  },
  mounted() {
    this.renderPostChart();
    this.renderCandidateChart();
    this.fetchNotifications();
    this.fetchCandidates();
    this.fetchEmployers();
  },
  methods: {
    async fetchNotifications() {
      try {
        await this.notificationStore.fetchNotifications();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thông báo:", error);
      }
    },
    async fetchCandidates() {
      try {
        await this.userStore.fetchCandidates(
          this.userStore.currentPage,
          this.userStore.pageSize
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng viên:", error);
      }
    },
    async fetchEmployers() {
      try {
        await this.userStore.fetchEmployers(
          this.userStore.currentPage,
          this.userStore.pageSize
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà tuyển dụng:", error);
      }
    },
    formatTime(createdAt) {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} phút trước`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      } else {
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
      }
    },
    previousCandidatePage() {
      if (this.userStore.currentPage > 1) {
        this.fetchCandidates(
          this.userStore.currentPage - 1,
          this.userStore.pageSize
        );
      }
    },
    nextCandidatePage() {
      if (this.userStore.currentPage < this.userStore.totalPages) {
        this.fetchCandidates(
          this.userStore.currentPage + 1,
          this.userStore.pageSize
        );
      }
    },
    goToCandidatePage(page) {
      if (page >= 1 && page <= this.userStore.totalPages) {
        this.fetchCandidates(page, this.userStore.pageSize);
      }
    },
    previousEmployerPage() {
      if (this.userStore.currentPage > 1) {
        this.fetchEmployers(
          this.userStore.currentPage - 1,
          this.userStore.pageSize
        );
      }
    },
    nextEmployerPage() {
      if (this.userStore.currentPage < this.userStore.totalPages) {
        this.fetchEmployers(
          this.userStore.currentPage + 1,
          this.userStore.pageSize
        );
      }
    },
    goToEmployerPage(page) {
      if (page >= 1 && page <= this.userStore.totalPages) {
        this.fetchEmployers(page, this.userStore.pageSize);
      }
    },
    renderPostChart() {
      const ctx = this.$refs.postChartCanvas.getContext("2d");
      const { labels, data } = this.BD_Data[this.selectedPostFilter];

      this.postChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Số lượng bài đăng",
              data,
              backgroundColor: "rgba(54, 162, 235, 0.7)",
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
                stepSize: 1,
              },
            },
          },
        },
      });
    },
    renderCandidateChart() {
      const ctx = this.$refs.candidateChartCanvas.getContext("2d");
      const { labels, data } = this.candidateData[this.selectedCandidateFilter];

      this.candidateChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Số lượng ứng viên nộp hồ sơ",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.7)",
              borderColor: "rgba(75, 192, 192, 1)",
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
                stepSize: 1,
              },
            },
          },
        },
      });
    },
    updatePostChart() {
      if (this.postChartInstance) {
        this.postChartInstance.destroy();
      }
      this.renderPostChart();
    },
    updateCandidateChart() {
      if (this.candidateChartInstance) {
        this.candidateChartInstance.destroy();
      }
      this.renderCandidateChart();
    },
  },
  beforeUnmount() {
    // Dọn dẹp biểu đồ khi component bị hủy
    if (this.postChartInstance) {
      this.postChartInstance.destroy();
    }
    if (this.candidateChartInstance) {
      this.candidateChartInstance.destroy();
    }
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}

.form-select {
  padding: 5px;
  font-size: 14px;
}

.admin-starter {
  padding: 20px;
}

.card-body {
  max-height: 400px;
  overflow-y: auto;
}

.card-body::-webkit-scrollbar {
  width: 8px;
}

.card-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.card-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
