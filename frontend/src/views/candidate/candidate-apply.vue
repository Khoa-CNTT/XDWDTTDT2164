<template>
  <div class="main-container">
    <div class="header">
      <h2 class="title">Công việc đã ứng tuyển</h2>
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
        <!-- Empty State -->
        <div v-else-if="!jobStore.jobs.length" class="text-center py-5">
          Không có công việc đã ứng tuyển
        </div>
        <!-- Jobs Table -->
        <table v-else>
          <thead>
            <tr>
              <th>Tên công việc</th>
              <th>Thời gian nộp</th>
              <th>Trạng thái</th>
              <th>Đánh giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobStore.jobs" :key="job.applicationId || job.id">
              <td class="job-info">
                <div class="job-logo">
                  <img
                    :src="getCompanyLogo(job.Jobs?.Employers?.companyLogo)"
                    alt="Company logo"
                    @error="handleImageError"
                  />
                </div>
                <div class="job-details">
                  <div class="job-title">
                    {{ job.Jobs?.jobName || "Không có tiêu đề" }}
                  </div>
                  <div class="job-meta">
                    <span class="job-segment" v-if="job.Ranks?.rankName">
                      <i class="fa-solid fa-calendar"></i>
                      {{ job.Ranks.rankName }}
                    </span>
                    <span class="job-location" v-if="job.Jobs?.address">
                      <i class="fa-solid fa-location-dot"></i>
                      {{ job.Jobs.address }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="job-deadline">{{ formatDate(job.Jobs?.expire) }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    job.status === 'Đã xem' ? 'approved' : 'not-approved',
                  ]"
                >
                  {{ job.status || "Chưa cập nhật" }}
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    job.employerReview === 'Phù hợp'
                      ? 'approved'
                      : 'not-approved',
                  ]"
                >
                  {{ job.employerReview || "Chưa đánh giá" }}
                </span>
              </td>
              <td class="action-buttons">
                <button
                  class="action-btn view-btn"
                  title="Xem chi tiết"
                  @click="viewJob(job.Jobs?.jobSlug)"
                  :disabled="!job.Jobs?.jobSlug"
                >
                  <i class="fa-solid fa-eye"></i> Xem
                </button>
                <button
                  class="action-btn cv-btn"
                  title="Xem CV đã nộp"
                  @click="viewCV(job.cvUpload || job.Candidates?.cvUrl)"
                  :disabled="!(job.cvUpload || job.Candidates?.cvUrl)"
                >
                  <i class="fa-solid fa-file-pdf"></i> CV
                </button>
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
              :disabled="jobStore.currentPage === 1"
            >
              Trước
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in paginationRange"
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
              :disabled="jobStore.currentPage === jobStore.totalPages"
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
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useApplyStore } from "@/stores/useApplyStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "vue3-toastify";

export default {
  name: "AppliedJobs",
  setup() {
    const router = useRouter();
    const jobStore = useApplyStore();
    const authStore = useAuthStore();

    const formatDate = (date) => {
      if (!date) return "N/A";
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "N/A";
        return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
      } catch (e) {
        return "N/A";
      }
    };

    const getCompanyLogo = (logo) => {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    };

    const handleImageError = (event) => {
      event.target.src = "/images/default-company-logo.png";
    };

    const paginationRange = computed(() => {
      const range = [];
      const maxVisible = 5;
      const total = Math.max(1, jobStore.totalPages);
      const leftSide = Math.floor(maxVisible / 2);
      const rightSide = maxVisible - leftSide;

      let startPage = Math.max(jobStore.currentPage - leftSide, 1);
      let endPage = Math.min(startPage + maxVisible - 1, total);

      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(endPage - maxVisible + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      return range;
    });

    const fetchJobs = async (page = 1) => {
      if (!authStore.user?.Candidates?.id) {
        toast.error("Vui lòng đăng nhập để xem công việc đã ứng tuyển");
        router.push("/login");
        return;
      }

      if (page < 1 || (jobStore.totalPages > 0 && page > jobStore.totalPages)) {
        page = 1;
      }

      try {
        await jobStore.fetchJobApply(
          authStore.user.Candidates.id,
          page,
          jobStore.pageSize
        );
      } catch (err) {
        toast.error(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    const viewJob = (jobSlug) => {
      if (!jobSlug) {
        toast.error("Thông tin công việc không hợp lệ");
        return;
      }
      router.push(`/job/${jobSlug}`);
    };

    const viewCV = (cvUrl) => {
      if (!cvUrl || typeof cvUrl !== "string") {
        toast.error("Không tìm thấy CV hoặc CV không hợp lệ");
        return;
      }
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      window.open(`${baseUrl}/uploads/${encodeURIComponent(cvUrl)}`, "_blank");
    };

    const goBack = () => {
      router.push("/");
    };

    // Redirect to login if not authenticated
    watch(
      () => authStore.isAuthenticated,
      (isAuthenticated) => {
        if (!isAuthenticated) {
          router.push("/login");
        } else if (
          authStore.user?.Candidates?.id &&
          !jobStore.jobs.length &&
          !jobStore.isLoading
        ) {
          fetchJobs(1);
        }
      },
      { immediate: true }
    );

    return {
      jobStore,
      formatDate,
      getCompanyLogo,
      handleImageError,
      paginationRange,
      fetchJobs,
      viewJob,
      viewCV,
      goBack,
    };
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.view-btn {
  background-color: #4299e1;
  color: white;
}

.view-btn:hover:not(:disabled) {
  background-color: #3182ce;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
  transform: translateY(-2px);
}

.cv-btn {
  background-color: #10b981;
  color: white;
}

.cv-btn:hover:not(:disabled) {
  background-color: #059669;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 0.9rem;
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
  cursor: not-allowed;
}

.pagination .page-link:hover:not(.disabled):not([disabled]) {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }

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

  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
