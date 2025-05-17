<template>
  <div class="description-job">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2>Xem Chi Tiết Bài Đăng</h2>
      <router-link to="/admin-dashboard/post-management" class="back-link">
        <i class="fas fa-arrow-left me-2"></i>Quay trở lại
      </router-link>
    </div>

    <!-- Loading state -->
    <div v-if="jobStore.isLoading" class="text-center mt-5">
      <i class="fas fa-spinner fa-spin me-2"></i>Đang tải chi tiết bài đăng...
    </div>

    <!-- Error state -->
    <div v-else-if="jobStore.error" class="alert alert-danger mt-5">
      <i class="fas fa-exclamation-circle me-2"></i>{{ jobStore.error }}
    </div>

    <!-- Job details -->
    <div v-else-if="jobStore.job" class="card mt-4">
      <div class="card-header text-center">
        <h1>Mô Tả Chi Tiết Công Việc</h1>
      </div>
      <div class="card-body">
        <div class="company-info d-flex align-items-center">
          <img
            class="img-logo me-3"
            :src="
              getCompanyLogo(jobStore.job.Employers.companyLogo) ||
              'https://via.placeholder.com/200x120'
            "
            alt="logo-company"
          />
          <div>
            <h4>{{ jobStore.job.Employers.companyName || "N/A" }}</h4>
            <p>
              <i class="fas fa-map-marker-alt me-1"></i>
              {{ jobStore.job.Employers.companyAddress || "N/A" }}
            </p>
          </div>
        </div>
        <hr />
        <div class="job-details mt-4">
          <h4>Tiêu Đề Công Việc</h4>
          <p class="text-muted">{{ jobStore.job.jobName || "N/A" }}</p>
        </div>
        <div class="job-details mt-4">
          <h4>Mô Tả Công Việc</h4>
          <p class="description-text">{{ plainDescription }}</p>
        </div>
        <div class="job-details mt-4">
          <h4>Yêu Cầu Ứng Viên</h4>
          <p class="description-text">{{ plainCandidateRequirements }}</p>
        </div>
        <div class="job-details mt-4">
          <h4>Quyền Lợi</h4>
          <p class="description-text">{{ plainBenefit }}</p>
        </div>
        <div class="job-details mt-4">
          <h4>Thời Gian Làm Việc</h4>
          <p class="description-text">{{ plainWorkTime }}</p>
        </div>
        <div class="job-details mt-4">
          <h4>Địa Chỉ Làm Việc</h4>
          <p class="description-text">{{ jobStore.job.address || "N/A" }}</p>
        </div>
        <hr />
        <div class="job-requirements mt-4">
          <h4>Yêu Cầu Công Việc</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Danh mục việc làm</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.Categories.categoryName || 'N/A'"
                readonly
              />
              <label class="form-label">Mức lương</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.Salaries.salaryName || 'N/A'"
                readonly
              />
              <label class="form-label">Kỹ năng</label>
              <input
                type="text"
                class="form-control"
                :value="
                  jobStore.job.JobSkills?.map(
                    (skill) => skill.Skills.skillName
                  ) || 'N/A'
                "
                readonly
              />
              <label class="form-label">Cấp bậc</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.Ranks.rankName || 'N/A'"
                readonly
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Hình thức việc làm</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.JobTypes.jobTypeName || 'N/A'"
                readonly
              />
              <label class="form-label">Số lượng người tuyển</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.numberOfRecruits || 'N/A'"
                readonly
              />
              <label class="form-label">Kinh nghiệm</label>
              <input
                type="text"
                class="form-control"
                :value="jobStore.job.Experiences.experienceName || 'N/A'"
                readonly
              />
              <label class="form-label">Ngày hết hạn ứng tuyển</label>
              <input
                type="date"
                class="form-control"
                :value="formatDate(jobStore.job.expire)"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="card-footer text-end"
        v-if="jobStore.job.isApproved !== 'Đã được duyệt'"
      >
        <button
          class="btn btn-outline-success me-2"
          @click="approveJob"
          :disabled="jobStore.isLoading"
        >
          <i class="fas fa-check me-1"></i>Duyệt
        </button>
        <button
          class="btn btn-outline-danger"
          @click="rejectJob"
          :disabled="jobStore.isLoading"
        >
          <i class="fas fa-times me-1"></i>Từ chối
        </button>
      </div>
      <div class="card-footer text-end" v-else>
        <span class="text-success">
          <i class="fas fa-check-circle me-1"></i>Bài đăng đã được duyệt
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center mt-5">
      <i class="fas fa-exclamation-triangle me-2"></i>Không có dữ liệu bài đăng.
    </div>
  </div>
</template>

<script>
import { useJobStore } from "@stores/useJobStore";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { htmlToText } from "html-to-text";
import { verifyJobApi } from "../../../apis/job";

export default {
  name: "JobDetailView",
  setup() {
    const jobStore = useJobStore();
    const route = useRoute();
    const router = useRouter();
    return { jobStore, route, router };
  },
  computed: {
    plainDescription() {
      const html = this.jobStore.job?.description || "N/A";
      return this.convertToPlainText(html);
    },
    plainCandidateRequirements() {
      const html = this.jobStore.job?.candidateRequirements || "N/A";
      return this.convertToPlainText(html);
    },
    plainBenefit() {
      const html = this.jobStore.job?.benefit || "N/A";
      return this.convertToPlainText(html);
    },
    plainWorkTime() {
      const html = this.jobStore.job?.workTime || "N/A";
      return this.convertToPlainText(html);
    },
  },
  methods: {
    getCompanyLogo(logo) {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    },
    convertToPlainText(html) {
      if (html === "N/A") return html;
      return htmlToText(html, {
        wordwrap: false,
        preserveNewlines: true,
        tags: {
          ul: {
            format: "block",
            options: { leadingLineBreaks: 1, lineBreak: "\n- " },
          },
          ol: {
            format: "block",
            options: { leadingLineBreaks: 1, lineBreak: "\n1. " },
          },
          p: { format: "block", options: { leadingLineBreaks: 1 } },
          br: { format: "inline", options: { lineBreak: "\n" } },
        },
      }).trim();
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    },
    async approveJob() {
      if (!confirm("Xác nhận duyệt bài đăng này?")) return;
      try {
        await verifyJobApi(this.route.params.jobId, "Đã được duyệt");
        toast.success("Bài đăng đã được duyệt!");
        this.router.push("/admin-dashboard/post-management");
      } catch (error) {
        toast.error("Lỗi khi duyệt bài đăng: " + error.message);
      }
    },
    async rejectJob() {
      if (!confirm("Xác nhận từ chối bài đăng này?")) return;
      try {
        await verifyJobApi(this.route.params.jobId, "Đã bị từ chối");
        toast.success("Bài đăng đã bị từ chối.");
        this.router.push("/admin-dashboard/post-management");
      } catch (error) {
        toast.error("Lỗi khi từ chối bài đăng: " + error.message);
      }
    },
  },
  async mounted() {
    const jobId = this.route.params.jobId;
    if (jobId) {
      await this.jobStore.fetchJobDetailForEmployer(jobId);
      console.log(this.jobStore.job);
    } else {
      this.jobStore.error = "Không tìm thấy ID bài đăng";
      toast.error(this.jobStore.error);
    }
  },
};
</script>

<style scoped>
/* General container */
.description-job {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "Roboto", sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.back-link {
  font-size: 0.95rem;
  color: #0d6efd;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.back-link:hover {
  color: #0a58ca;
  transform: translateX(-3px);
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
  padding: 1.5rem;
}

.card-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.card-body {
  padding: 2rem;
}

.card-footer {
  border-top: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  background: #ffffff;
}

/* Company info */
.company-info {
  gap: 1.5rem;
  flex-wrap: wrap;
}

.img-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.img-logo:hover {
  transform: scale(1.03);
}

.company-info h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.company-info p {
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Divider */
hr {
  border-top: 1px solid #dee2e6;
  margin: 1.5rem 0;
}

/* Job details */
.job-details h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.job-details p {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 0;
}

.description-text {
  white-space: pre-wrap;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

/* Job requirements */
.job-requirements .row {
  margin-top: 1rem;
}

.job-requirements .form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.job-requirements .form-control {
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  background: #f8f9fa;
  color: #495057;
}

.job-requirements .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

/* Footer buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-outline-success {
  border-color: #28a745;
  color: #28a745;
}

.btn-outline-success:hover {
  background: #28a745;
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-outline-success:disabled {
  border-color: #6c757d;
  color: #6c757d;
  cursor: not-allowed;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-outline-danger:disabled {
  border-color: #6c757d;
  color: #6c757d;
  cursor: not-allowed;
}

.text-success {
  font-size: 0.95rem;
  font-weight: 500;
}

/* Loading and error states */
.text-center {
  padding: 2rem;
  color: #495057;
}

.text-center i {
  font-size: 1.5rem;
  color: #0d6efd;
}

.alert-danger {
  background: #f8d7da;
  color: #842029;
  border-left: 4px solid #dc3545;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .description-job {
    padding: 1.5rem 0.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-header h1 {
    font-size: 1.25rem;
  }

  .img-logo {
    width: 140px;
    height: 84px;
  }

  .company-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-requirements .row {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 1.5rem;
  }

  .job-details h4,
  .job-requirements h4 {
    font-size: 1.1rem;
  }

  .description-text,
  .form-control,
  .form-label {
    font-size: 0.9rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
