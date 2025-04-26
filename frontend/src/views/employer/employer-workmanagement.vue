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
                v-for="job in jobStore.jobs"
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
                      <div class="d-flex align-items-center mb-1">
                        <div class="fw-500 me-2">
                          {{ job.jobName || "N/A" }}
                        </div>
                        <router-link
                          v-if="job.isVisible === false"
                          :to="`/employer-dashboard/employer-job-payment/${job.id}`"
                          class="badge bg-warning text-dark small"
                        >
                          Chưa thanh toán
                        </router-link>
                      </div>
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
                    :to="`/employer-dashboard/employer-candidates/${job.id}`"
                    class="btn btn-sm btn-light me-2 px-3"
                  >
                    Xem CV đã nộp
                  </router-link>
                  <router-link
                    :to="`/employer-dashboard/employer-update-job/${job.id}`"
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
  margin: 0 auto;
}

/* Card styling */
.card {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px !important;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.card-body {
  padding: 1.75rem !important;
}

/* Button styling */
.btn {
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.btn-secondary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.btn-secondary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-light {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #4b5563;
}

.btn-light:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  color: #111827;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

/* Table styling */
.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 1rem;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.table tr:hover {
  background-color: #f9fafb;
}

/* Company logo container */
.company-logo-container {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.company-logo-container img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

/* Badge styling */
.badge {
  font-weight: 500;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
}

.badge.bg-success {
  background-color: #10b981 !important;
}

.badge.bg-danger {
  background-color: #ef4444 !important;
}

/* Typography */
h4 {
  font-weight: 700;
  color: #111827;
  font-size: 1.5rem;
}

h5 {
  font-weight: 600;
  color: #111827;
  font-size: 1.25rem;
}

.fw-500 {
  font-weight: 600;
  color: #111827;
}

.text-muted {
  color: #6b7280 !important;
}

/* Pagination */
.pagination {
  margin-top: 2rem;
}

.page-item .page-link {
  border-radius: 6px;
  margin: 0 0.25rem;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  transition: all 0.15s ease-in-out;
  padding: 0.5rem 1rem;
}

.page-item .page-link:hover {
  background-color: #f3f4f6;
  color: #111827;
  border-color: #d1d5db;
}

.page-item.active .page-link {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.page-item.disabled .page-link {
  color: #9ca3af;
  background-color: #f9fafb;
  border-color: #f3f4f6;
}

/* Loading state */
.fa-spinner {
  color: #3b82f6;
  font-size: 1.5rem;
}

/* Links */
a {
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

a.text-primary {
  color: #3b82f6 !important;
  font-weight: 500;
}

a.text-primary:hover {
  color: #2563eb !important;
}

a.text-muted {
  color: #6b7280 !important;
}

a.text-muted:hover {
  color: #4b5563 !important;
}

/* Icons */
.fa-solid,
.fas {
  color: #6b7280;
}

/* Job item details */
.job-details-container {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
}

/* Error message */
.text-danger {
  color: #ef4444 !important;
  font-weight: 500;
}

/* Empty state */
.empty-state {
  padding: 3rem 0;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 992px) {
  .btn-sm {
    padding: 0.375rem 0.5rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.25rem !important;
  }

  .company-logo-container {
    width: 50px;
    height: 50px;
    padding: 0.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.125rem;
  }
}

@media (max-width: 576px) {
  .btn {
    padding: 0.375rem 0.75rem;
  }

  .badge {
    padding: 0.375rem 0.75rem;
  }
}
</style>
