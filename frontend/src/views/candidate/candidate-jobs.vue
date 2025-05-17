<template>
  <div class="main-container">
    <div class="header">
      <h2 class="title">Công việc đã lưu</h2>
      <div class="back-link" @click="goBack">
        <i class="fas fa-arrow-left"></i> Trở lại trang chủ
      </div>
    </div>
    <div class="content-card">
      <div class="table-container">
        <!-- Loading State -->
        <div v-if="jobStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <!-- Error State -->
        <div v-else-if="jobStore.error" class="alert alert-danger text-center">
          {{ jobStore.error }}
        </div>
        <!-- Jobs Table -->
        <table v-else>
          <thead>
            <tr>
              <th>Tên công việc</th>
              <th>Hạn nhận CV</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobStore.jobs" :key="job.id">
              <td class="job-info">
                <div class="job-logo">
                  <img
                    :src="`https://res.cloudinary.com/dh1i7su2f/image/upload/${job.Jobs.Employers.companyLogo}`"
                    alt="Company logo"
                  />
                </div>
                <div class="job-details">
                  <div class="job-title">{{ job.Jobs.jobName }}</div>
                  <div class="job-meta">
                    <span class="job-segment">
                      <i class="fa-solid fa-calendar"></i>
                      {{ job.Jobs.Ranks.rankName }}
                    </span>
                    <span class="job-location">
                      <i class="fa-solid fa-location-dot"></i>
                      {{ job.Jobs.address }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="job-deadline">{{ formatDate(job.Jobs.expire) }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    job.Jobs.isApproved === 'Đã được duyệt'
                      ? 'approved'
                      : 'not-approved',
                  ]"
                >
                  {{
                    job.Jobs.isApproved === "Đã được duyệt"
                      ? "Đã kiểm duyệt"
                      : "Chưa kiểm duyệt"
                  }}
                </span>
              </td>
              <td class="action-buttons">
                <button
                  class="view-btn"
                  title="Xem chi tiết"
                  @click="viewJob(job.Jobs.jobSlug)"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button
                  class="delete-btn"
                  title="Xóa"
                  @click="removeJob(job.Jobs.id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!jobStore.jobs.length">
              <td colspan="4" class="text-center py-3">
                Không có công việc đã lưu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <nav v-if="jobStore.totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: jobStore.currentPage === 1 }"
          >
            <button
              class="page-link"
              @click="fetchJobs(jobStore.currentPage - 1)"
            >
              Trước
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in jobStore.totalPages"
            :key="page"
            :class="{ active: jobStore.currentPage === page }"
          >
            <button class="page-link" @click="fetchJobs(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: jobStore.currentPage === jobStore.totalPages }"
          >
            <button
              class="page-link"
              @click="fetchJobs(jobStore.currentPage + 1)"
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { useSaveJobsStore } from "@stores/useSaveJobStore";
import { useRouter } from "vue-router";

export default {
  name: "SavedJobs",
  setup() {
    const router = useRouter();
    const jobStore = useSaveJobsStore();
    return { router, jobStore };
  },
  data() {
    return {
      timeFilter: 6, // Default: 6 months
    };
  },
  created() {
    this.fetchJobs();
  },
  methods: {
    formatDate(date) {
      if (!date) return "N/A";
      const d = new Date(date);
      return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
    },
    async fetchJobs(page = 1) {
      await this.jobStore.fetchSaveJobs(
        page,
        this.jobStore.pageSize,
        this.timeFilter
      );
    },
    async removeJob(jobId) {
      if (
        !confirm("Bạn có chắc muốn xóa công việc này khỏi danh sách đã lưu?")
      ) {
        return;
      }
      await this.jobStore.delJob(jobId);
    },
    viewJob(jobId) {
      this.router.push(`/job/${jobId}`);
    },
    goBack() {
      this.router.push("/");
    },
  },
};
</script>

<style scoped>
.main-container {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.back-link {
  color: #4a5568;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #3182ce;
  text-decoration: underline;
}

.back-link i {
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.content-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.filter-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.05rem;
}

.time-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  color: #4a5568;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;
}

.time-filter:hover,
.time-filter:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.table-container {
  padding: 0;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #f7fafc;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #edf2f7;
}

tbody tr {
  border-bottom: 1px solid #edf2f7;
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f7fafc;
}

tbody td {
  padding: 1.25rem 1.5rem;
  color: #4a5568;
  vertical-align: middle;
}

.job-info {
  display: flex;
  align-items: center;
}

.job-logo {
  margin-right: 1rem;
  flex-shrink: 0;
}

.job-logo img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.job-details {
  flex-grow: 1;
}

.job-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.05rem;
  margin-bottom: 0.35rem;
}

.job-meta {
  display: flex;
  font-size: 0.85rem;
  color: #718096;
}

.job-segment {
  margin-right: 1.25rem;
}

.job-segment i,
.job-location i {
  margin-right: 0.35rem;
  font-size: 0.8rem;
}

.job-deadline {
  white-space: nowrap;
  color: #718096;
  font-size: 0.95rem;
}

.status-badge {
  display: inline-block;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
}

.status-badge.approved {
  background-color: rgba(72, 187, 120, 0.1);
  color: #38a169;
}

.status-badge.not-approved {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.action-buttons {
  white-space: nowrap;
  text-align: center;
}

.view-btn,
.delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin: 0 0.25rem;
}

.view-btn {
  color: #4299e1;
}

.delete-btn {
  color: #e53e3e;
}

.view-btn:hover {
  background-color: rgba(66, 153, 225, 0.1);
  transform: translateY(-2px);
}

.delete-btn:hover {
  background-color: rgba(229, 62, 62, 0.1);
  transform: translateY(-2px);
}

.pagination .page-link {
  border-radius: 8px;
  margin: 0 5px;
  color: #334155;
  font-size: 0.9rem;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.pagination .page-item.active .page-link {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.pagination .page-item.disabled .page-link {
  color: #9ca3af;
  background: #f8fafc;
  border-color: #e2e8f0;
}

.pagination .page-link:hover:not(.disabled) {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-link {
    margin-top: 0.5rem;
  }

  .job-meta {
    flex-direction: column;
  }

  .job-segment {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>
