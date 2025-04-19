<template>
  <div class="post-management">
    <h2>Danh Sách Bài Đăng</h2>
    <router-link to="/" class="mb-3 d-inline-block">
      Quay trở lại trang chủ?
    </router-link>

    <div class="card mt-5">
      <div class="card-header">
        <h5 class="title-header">Danh Sách Bài Đăng</h5>
      </div>
      <div class="card-body">
        <div v-if="jobStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách bài đăng...
        </div>

        <div v-else-if="jobStore.error" class="text-center text-danger">
          {{ jobStore.error }}
        </div>

        <div v-else-if="jobStore.jobs.length === 0" class="text-center">
          Không có bài đăng nào.
        </div>

        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Tên bài đăng</th>
                <th>Tên công ty</th>
                <th>Tên người dùng</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(job, index) in jobStore.jobs" :key="job.id">
                <td>
                  {{
                    (jobStore.currentPage - 1) * jobStore.pageSize + index + 1
                  }}
                </td>
                <td>
                  {{ job.jobName || "N/A" }}
                  <router-link
                    :to="`/admin-dashboard/description-job/${job.id}`"
                  >
                    <button class="badge bg-info ms-2">Chi tiết</button>
                  </router-link>
                </td>
                <td>{{ job.Employers?.companyName || "N/A" }}</td>
                <td>{{ job.Users?.fullName || "N/A" }}</td>
                <td>{{ formatDate(job.expire) }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      job.status === 'Chưa kiểm duyệt'
                        ? 'bg-warning'
                        : 'bg-success',
                    ]"
                  >
                    {{
                      job.status === "Đã kiểm duyệt" ? "Đã duyệt" : "Chưa duyệt"
                    }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-success me-2"
                    @click="approveJob(job.id)"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button class="btn btn-danger" @click="rejectJob(job.id)">
                    <i class="fa-solid fa-xmark"></i>
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
                <button
                  class="page-link"
                  @click="goToPage(jobStore.currentPage - 1)"
                >
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
                <button
                  class="page-link"
                  @click="goToPage(jobStore.currentPage + 1)"
                >
                  Trang sau
                </button>
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
  name: "PostManagement",
  setup() {
    const jobStore = useJobStore();
    return { jobStore };
  },
  methods: {
    async fetchJobs(page = 1) {
      try {
        await this.jobStore.fetchJobsForadmin(page, this.jobStore.pageSize);
        this.jobStore.currentPage = page; // cập nhật trang hiện tại
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài đăng:", error);
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.jobStore.totalPages) {
        this.fetchJobs(page);
      }
    },
    async approveJob(jobId) {
      try {
        // Gọi API duyệt bài đăng ở đây (bạn cần triển khai trong jobStore)
        await this.jobStore.approveJob(jobId);
        await this.fetchJobs(this.jobStore.currentPage);
      } catch (error) {
        console.error("Lỗi khi duyệt bài đăng:", error);
      }
    },
    async rejectJob(jobId) {
      try {
        // Gọi API từ chối bài đăng ở đây (bạn cần triển khai trong jobStore)
        await this.jobStore.rejectJob(jobId);
        await this.fetchJobs(this.jobStore.currentPage);
      } catch (error) {
        console.error("Lỗi khi hủy bài đăng:", error);
      }
    },
  },
  mounted() {
    this.fetchJobs();
  },
};
</script>

<style scoped>
.post-management {
  padding: 20px;
  max-width: 100%;
  overflow-x: auto;
}

.title-header {
  padding: 10px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
  background-color: #f1f3f5;
  border-bottom: 1px solid #dee2e6;
  padding: 15px;
}

.card-body {
  padding: 20px;
}

.table {
  margin-bottom: 0;
  font-size: 0.95rem;
}

.table th,
.table td {
  vertical-align: middle !important;
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.85rem;
  padding: 6px 10px;
}

.btn-success,
.btn-danger {
  padding: 6px 10px;
  font-size: 0.85rem;
}

.page-link {
  cursor: pointer;
}

.pagination {
  margin-top: 20px;
}

.badge.bg-warning {
  color: #856404;
  background-color: #fff3cd;
}

.badge.bg-success {
  background-color: #28a745;
}

button.badge {
  border: none;
  cursor: pointer;
}
</style>
