<template>
  <div class="post-management">
    <div class="header mb-4">
      <h2 class="title">Danh Sách Bài Đăng</h2>
      <router-link to="/" class="back-link">
        <i class="fas fa-arrow-left me-2"></i>Quay trở lại trang chủ
      </router-link>
    </div>

    <div class="card">
      <div class="card-header">
        <h5 class="card-title">Danh Sách Bài Đăng</h5>
      </div>
      <div class="card-body">
        <!-- Loading state -->
        <div v-if="jobStore.isLoading" class="text-center py-4">
          <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p class="mt-2">Đang tải danh sách bài đăng...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="jobStore.error" class="text-center text-danger py-4">
          <i class="fas fa-exclamation-circle me-2"></i>{{ jobStore.error }}
        </div>

        <!-- Empty state -->
        <div v-else-if="jobStore.jobs.length === 0" class="text-center py-4">
          <i class="fas fa-folder-open fa-2x text-muted"></i>
          <p class="mt-2">Không có bài đăng nào.</p>
        </div>

        <!-- Job list -->
        <div v-else>
          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
                <tr class="text-center align-middle">
                  <th scope="col">STT</th>
                  <th scope="col">Tên bài đăng</th>
                  <th scope="col">Tên công ty</th>
                  <th scope="col">Tên người dùng</th>
                  <th scope="col">Ngày kết thúc</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(job, index) in jobStore.jobs"
                  :key="job.id"
                  class="text-center align-middle"
                >
                  <td>
                    {{
                      (jobStore.currentPage - 1) * jobStore.pageSize + index + 1
                    }}
                  </td>
                  <td>
                    {{ job.jobName || "N/A" }}
                    <router-link
                      :to="`/admin-dashboard/description-job/${job.id}`"
                      class="ms-2"
                    >
                      <span class="badge bg-info text-white">Chi tiết</span>
                    </router-link>
                  </td>
                  <td>{{ job.Employers?.companyName || "N/A" }}</td>
                  <td>{{ job.Users?.fullName || "N/A" }}</td>
                  <td>{{ formatDate(job.expire) }}</td>
                  <td>
                    <span
                      :class="[
                        'badge',
                        job.status === 'Chờ kiểm duyệt'
                          ? 'bg-warning text-dark'
                          : job.status === 'Đã kiểm duyệt'
                          ? 'bg-success'
                          : 'bg-danger',
                      ]"
                    >
                      {{
                        job.status === "Đã kiểm duyệt"
                          ? "Đã duyệt"
                          : job.status === "Từ chối"
                          ? "Từ chối"
                          : "Chờ duyệt"
                      }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link
                        :to="`/admin-dashboard/description-job/${job.id}`"
                        class="btn btn-outline-primary btn-sm me-2"
                      >
                        Xem chi tiết
                      </router-link>
                      <button
                        v-if="job.status === 'Chờ kiểm duyệt'"
                        class="btn btn-success btn-sm me-2"
                        @click="approveJob(job.id)"
                      >
                        Duyệt
                      </button>
                      <button
                        v-if="job.status === 'Chờ kiểm duyệt'"
                        class="btn btn-danger btn-sm"
                        @click="openRejectModal(job.id)"
                      >
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav v-if="jobStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center mt-4">
              <li
                class="page-item"
                :class="{ disabled: jobStore.currentPage === 1 }"
              >
                <button
                  class="page-link"
                  @click="goToPage(jobStore.currentPage - 1)"
                >
                  <i class="fas fa-chevron-left"></i>
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
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Từ chối bài đăng</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeRejectModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="rejectReason" class="form-label"
                >Lý do từ chối:</label
              >
              <textarea
                id="rejectReason"
                v-model="rejectReason"
                class="form-control"
                rows="4"
                placeholder="Nhập lý do từ chối..."
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeRejectModal"
            >
              Thoát
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmRejectJob"
              :disabled="!rejectReason.trim()"
            >
              Từ chối
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showRejectModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { useJobStore } from "@stores/useJobStore";
import { toast } from "vue3-toastify";

export default {
  name: "PostManagement",
  setup() {
    const jobStore = useJobStore();
    return { jobStore };
  },
  data() {
    return {
      showRejectModal: false,
      rejectJobId: null,
      rejectReason: "",
    };
  },
  methods: {
    async fetchJobs(page = 1) {
      try {
        await this.jobStore.fetchJobsForadmin(page, this.jobStore.pageSize);
        this.jobStore.currentPage = page;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài đăng:", error);
        toast.error("Lỗi khi tải danh sách bài đăng!");
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      try {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      } catch {
        return "N/A";
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.jobStore.totalPages) {
        this.fetchJobs(page);
      }
    },
    async approveJob(jobId) {
      try {
        await this.jobStore.approveJob(jobId);
        toast.success("Duyệt bài đăng thành công!");
        await this.fetchJobs(this.jobStore.currentPage);
      } catch (error) {
        console.error("Lỗi khi duyệt bài đăng:", error);
        toast.error("Lỗi khi duyệt bài đăng!");
      }
    },
    openRejectModal(jobId) {
      this.rejectJobId = jobId;
      this.rejectReason = "";
      this.showRejectModal = true;
    },
    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectJobId = null;
      this.rejectReason = "";
    },
    async confirmRejectJob() {
      if (!this.rejectReason.trim()) {
        toast.error("Vui lòng nhập lý do từ chối!");
        return;
      }
      try {
        await this.jobStore.rejectJob(this.rejectJobId, this.rejectReason);
        toast.success("Từ chối bài đăng thành công!");
        await this.fetchJobs(this.jobStore.currentPage);
        this.closeRejectModal();
      } catch (error) {
        console.error("Lỗi khi từ chối bài đăng:", error);
        toast.error("Lỗi khi từ chối bài đăng!");
      }
    },
  },
  mounted() {
    this.fetchJobs();
  },
};
</script>

<style scoped>
/* General container */
.post-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.back-link {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: #1e40af;
  transform: translateX(-3px);
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  overflow: hidden;
}

.card-header {
  background: #eff6ff;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 25px;
}

/* Table */
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
  border-color: #e2e8f0;
}

.table th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc;
  transition: background 0.2s ease;
}

.table td {
  color: #334155;
}

/* Badges */
.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.badge.bg-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge.bg-success {
  background: #d1fae5;
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2;
  color: #991b1b;
}

button.badge.bg-info {
  border: none;
  padding: 5px 10px;
  font-size: 0.8rem;
  transition: background 0.2s ease;
}

button.badge.bg-info:hover {
  background: #0284c7;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-success {
  background: #10b981;
  border: none;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.2);
}

.btn-danger {
  background: #ef4444;
  border: none;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

.btn-outline-primary {
  border-color: #2563eb;
  color: #2563eb;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: #ffffff;
}

/* Pagination */
.pagination {
  margin-top: 30px;
}

.page-item .page-link {
  border-radius: 8px;
  margin: 0 5px;
  padding: 8px 14px;
  font-size: 0.9rem;
  color: #475569;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.page-item.active .page-link {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.page-item:not(.disabled) .page-link:hover {
  background: #dbeafe;
  border-color: #2563eb;
  color: #2563eb;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  color: #94a3b8;
}

/* Modal */
.modal {
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  padding: 15px 20px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.form-control {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background: #6b7280;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #ffffff;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger:disabled {
  background: #fca5a5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .post-management {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 15px;
  }

  .table th,
  .table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .modal-dialog {
    margin: 20px;
  }
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .btn-sm {
    padding: 5px 8px;
    font-size: 0.8rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }

  .page-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
