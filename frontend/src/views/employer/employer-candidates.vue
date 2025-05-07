<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h4 class="mb-1">Danh sách ứng viên</h4>
      <router-link
        to="/employer-dashboard/employer-workmanagement"
        class="text-decoration-none text-muted small"
        >Trở lại danh sách công việc?</router-link
      >
    </div>

    <!-- Applicants Section -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h5 class="mb-4">Ứng viên</h5>

        <!-- Loading State -->
        <div v-if="applyJobStore.isLoading" class="text-center mb-4">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách ứng viên...
        </div>

        <!-- Error State -->
        <div v-else-if="applyJobStore.error" class="alert alert-danger">
          {{ applyJobStore.error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!applyJobStore.candidates?.length" class="text-center">
          Không có ứng viên nào.
        </div>

        <!-- Table -->
        <div v-else class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th class="text-primary border-0">Tên ứng viên</th>
                <th class="text-primary border-0">Số điện thoại</th>
                <th class="text-primary border-0">Tỷ lệ phù hợp</th>
                <th class="text-primary border-0">Đánh giá</th>
                <th class="text-primary border-0">Trạng thái</th>
                <th class="text-primary border-0">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="applicant in applyJobStore.candidates"
                :key="applicant.id"
              >
                <td>{{ applicant.Candidates.Users.fullName || "N/A" }}</td>
                <td>{{ applicant.Candidates.Users.phoneNumber || "N/A" }}</td>
                <td>
                  {{
                    applicant.matchScore ? `${applicant.matchScore}%` : "N/A"
                  }}
                </td>
                <td>
                  <span
                    :class="[
                      'badge rounded-pill px-3',
                      applicant.isSuitable === 'Tạm chấp nhận'
                        ? 'bg-warning text-dark'
                        : 'bg-secondary',
                    ]"
                  >
                    {{ applicant.isSuitable || "Chưa đánh giá" }}
                  </span>
                </td>
                <td>{{ applicant.status || "Chưa xem" }}</td>
                <td>
                  <router-link
                    :to="`/employer-dashboard/employer-candidate-detail/${applicant.id}`"
                    class="btn btn-link text-decoration-none p-0 me-4"
                  >
                    Xem chi tiết CV
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="applyJobStore.totalPages > 1" class="mt-4">
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: applyJobStore.currentPage === 1 }"
              >
                <button
                  class="page-link"
                  @click="fetchCandidates(applyJobStore.currentPage - 1)"
                >
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in paginationPages"
                :key="page"
                class="page-item"
                :class="{ active: applyJobStore.currentPage === page }"
              >
                <button class="page-link" @click="fetchCandidates(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled:
                    applyJobStore.currentPage === applyJobStore.totalPages,
                }"
              >
                <button
                  class="page-link"
                  @click="fetchCandidates(applyJobStore.currentPage + 1)"
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
import { useApplyStore } from "@stores/useApplyStore";
import { toast } from "vue3-toastify";

export default {
  name: "ApplicantList",
  setup() {
    const applyJobStore = useApplyStore();
    return { applyJobStore };
  },
  computed: {
    paginationPages() {
      const total = this.applyJobStore.totalPages;
      const current = this.applyJobStore.currentPage;
      const maxPagesToShow = 5;
      const pages = [];

      let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(total, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    async fetchCandidates(page = 1) {
      const jobId = this.$route.params.jobId;
      if (!jobId) {
        this.applyJobStore.error = "Không tìm thấy ID công việc.";
        toast.error("Không tìm thấy ID công việc. Vui lòng thử lại.");
        this.$router.push("/employer-dashboard/employer-workmanagement");
        return;
      }
      try {
        await this.applyJobStore.fetchCandidates(
          jobId,
          page,
          this.applyJobStore.pageSize || 10
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng viên:", error);
        toast.error("Không thể tải danh sách ứng viên. Vui lòng thử lại sau.");
      }
    },
    rateApplicant(applicantId) {
      toast.info(
        `Chức năng đánh giá ứng viên ${applicantId} đang được phát triển!`
      );
    },
  },
  mounted() {
    this.fetchCandidates();
  },
};
</script>

<style scoped>
.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.table > :not(caption) > * > * {
  padding: 1rem;
  border-bottom-color: #dee2e6;
}

.badge {
  font-weight: normal;
}

.btn-link {
  color: #0d6efd;
}

.btn-link:hover {
  color: #0a58ca;
}

.text-primary {
  color: #0d6efd !important;
}

.page-link {
  color: #6c757d;
  border: none;
  padding: 0.5rem 1rem;
}

.page-link:hover {
  color: #000;
  background: none;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  color: white;
}

.page-item.disabled .page-link {
  color: #d3d3d3;
  cursor: not-allowed;
}
</style>
