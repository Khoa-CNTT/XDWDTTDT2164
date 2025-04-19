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
        <div v-if="jobStore.isLoading" class="text-center mb-4">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách ứng viên...
        </div>

        <!-- Error State -->
        <div v-else-if="jobStore.error" class="alert alert-danger">
          {{ jobStore.error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!jobStore.applicants?.length" class="text-center">
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
              <tr v-for="applicant in jobStore.applicants" :key="applicant.id">
                <td>{{ applicant.fullName || "N/A" }}</td>
                <td>{{ applicant.phone || "N/A" }}</td>
                <td>
                  {{ applicant.matchRate ? `${applicant.matchRate}%` : "N/A" }}
                </td>
                <td>
                  <span
                    :class="[
                      'badge rounded-pill px-3',
                      applicant.rating === 'Tạm chấp nhận'
                        ? 'bg-warning text-dark'
                        : 'bg-secondary',
                    ]"
                  >
                    {{ applicant.rating || "Chưa đánh giá" }}
                  </span>
                </td>
                <td>{{ applicant.status || "Chưa xem" }}</td>
                <td>
                  <a
                    v-if="applicant.cvUrl"
                    :href="applicant.cvUrl"
                    target="_blank"
                    class="btn btn-link text-decoration-none p-0 me-4"
                  >
                    Xem CV
                  </a>
                  <button
                    class="btn btn-link text-decoration-none p-0"
                    @click="rateApplicant(applicant.id)"
                  >
                    Đánh Giá
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobStore } from "@stores/useJobStore";
import { toast } from "vue3-toastify";

export default {
  name: "ApplicantList",
  setup() {
    const jobStore = useJobStore();
    return { jobStore };
  },
  methods: {
    async fetchApplicants() {
      const jobId = this.$route.params.jobId;
      if (!jobId) {
        this.jobStore.error = "Không tìm thấy ID công việc.";
        return;
      }
      try {
        await this.jobStore.fetchApplicants(jobId, 1, 10);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng viên:", error);
      }
    },
    rateApplicant(applicantId) {
      // Placeholder cho logic đánh giá
      toast.info(
        `Chức năng đánh giá ứng viên ${applicantId} đang được phát triển!`
      );
    },
  },
  mounted() {
    this.fetchApplicants();
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
</style>
