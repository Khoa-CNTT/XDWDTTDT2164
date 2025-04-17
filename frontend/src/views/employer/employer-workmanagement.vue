<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h4 class="mb-1">Quản lý công việc!</h4>
      <router-link to="/" class="text-decoration-none text-muted small"
        >Trở lại trang chủ?</router-link
      >
    </div>

    <!-- Jobs List -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Danh sách công việc của tôi</h5>
          <router-link
            to="/employer-dashboard/create-job"
            class="btn btn-secondary"
          >
            <i class="fas fa-plus me-2"></i>Thêm mới bài đăng
          </router-link>
        </div>

        <!-- Trạng thái loading -->
        <div v-if="jobStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách công việc...
        </div>
        <!-- Trạng thái lỗi -->
        <div v-else-if="jobStore.error" class="text-center text-danger">
          {{ jobStore.error }}
        </div>
        <!-- Không có công việc -->
        <div v-else-if="jobStore.jobs.length === 0" class="text-center">
          Không có công việc nào.
        </div>
        <!-- Hiển thị danh sách công việc -->
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="bg-light">
              <tr class="text-center">
                <th class="text-start">Tên công việc</th>
                <th>Tên người đăng</th>
                <th>Ngày tạo và hết hạn</th>
                <th>Trạng thái</th>
                <th>Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(job, index) in jobStore.jobs"
                :key="job.id"
                class="align-middle text-center"
              >
                <td class="text-start">
                  <div class="d-flex align-items-center">
                    <div class="rounded-3 bg-light p-2 me-3">
                      <img
                        :src="
                          getImageUrl(job.Employers?.companyLogo) ||
                          'https://framerusercontent.com/images/3g0GS7Ho5Myy2UtnkAyiPFODrc.png'
                        "
                        alt="Company"
                        width="40"
                        height="40"
                      />
                    </div>
                    <div>
                      <div class="fw-500 mb-1">{{ job.jobName || "N/A" }}</div>
                      <div
                        class="d-flex align-items-center gap-4 text-muted small"
                      >
                        <div>
                          <i class="fa-solid fa-bag-shopping me-2"></i>
                          <span>{{ job.Ranks?.rankName || "N/A" }}</span>
                        </div>
                        <div>
                          <i class="fas fa-map-marker-alt mx-2"></i>
                          <span>{{ job.address || "N/A" }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <a href="#" class="text-primary text-decoration-underline">{{
                    job.Users?.fullName || "N/A"
                  }}</a>
                </td>
                <td class="text-muted small">
                  <div>{{ formatDate(job.createdAt) }}</div>
                  <div>{{ formatDate(job.expire) }}</div>
                </td>
                <td>
                  <span
                    :class="[
                      'badge rounded-pill px-3',
                      job.isVisible ? 'bg-success' : 'bg-danger',
                    ]"
                  >
                    {{ job.isVisible ? "Hoạt động" : "Không hoạt động" }}
                  </span>
                </td>
                <td>
                  <router-link
                    :to="`/employer-dashboard/edit-job/${job.id}`"
                    class="btn btn-sm btn-light me-2 px-3"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                  <button
                    class="btn btn-sm btn-light px-3"
                    @click="deleteJob(job.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="jobStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: jobStore.currentPage === 1 }"
              >
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in jobStore.totalPages"
                :key="page"
                class="page-item"
                :class="{ active: jobStore.currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: jobStore.currentPage === jobStore.totalPages,
                }"
              >
                <button class="page-link" @click="nextPage">Trang sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobStore } from "@stores/useJobStore";

export default {
  name: "JobManagement",
  setup() {
    const jobStore = useJobStore();
    return { jobStore };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có ảnh
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${imagePath}`;
    },
    async fetchJobs(page = 1) {
      try {
        await this.jobStore.fetchJobsForEmployer(page, this.jobStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công việc:", error);
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      const d = new Date(date);
      return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
    },
    previousPage() {
      if (this.jobStore.currentPage > 1) {
        this.fetchJobs(this.jobStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.jobStore.currentPage < this.jobStore.totalPages) {
        this.fetchJobs(this.jobStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.jobStore.totalPages) {
        this.fetchJobs(page);
      }
    },
    async deleteJob(jobId) {
      if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        try {
          // Gọi API để xóa công việc (chưa triển khai)
          console.log("Xóa công việc:", jobId);
          // Sau khi xóa thành công, làm mới danh sách
          await this.fetchJobs(this.jobStore.currentPage);
        } catch (error) {
          console.error("Lỗi khi xóa công việc:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchJobs(); // Gọi API khi component được mount
  },
};
</script>

<style scoped>
.container-fluid {
  max-width: 1400px;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn-light {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.btn-light:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.badge {
  font-weight: normal;
}

.fw-500 {
  font-weight: 500;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.table th,
.table td {
  vertical-align: middle;
}

.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  cursor: pointer;
}

.text-danger {
  font-size: 0.875rem;
}
</style>
