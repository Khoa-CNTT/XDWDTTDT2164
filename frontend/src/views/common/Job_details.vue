<template>
  <div class="job-detail">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>
    <!-- Job Content -->
    <div v-else-if="job">
      <!-- Job Header Section -->
      <section class="job-header">
        <div class="container">
          <div class="header-content">
            <img
              :src="getCompanyLogo(job.Employers?.companyLogo)"
              alt="Logo công ty"
              class="header-logo"
              @error="handleImageError"
            />
            <div class="header-info">
              <h1 class="job-title">{{ job.jobName || "Không có tiêu đề" }}</h1>
              <div class="job-tags">
                <span class="tag" v-if="job.Ranks?.rankName">
                  <i class="fa-solid fa-briefcase me-1"></i
                  >{{ job.Ranks.rankName }}
                </span>
                <span class="tag" v-if="job.address">
                  <i class="fa-solid fa-location-dot me-1"></i>{{ job.address }}
                </span>
                <span class="tag" v-if="job.expire">
                  <i class="fa-solid fa-clock me-1"></i
                  >{{ formatDate(job.expire) }}
                </span>
                <span class="tag" v-if="job.Salaries?.salaryName">
                  <i class="fa-solid fa-money-bill me-1"></i
                  >{{ job.Salaries.salaryName }}
                </span>
              </div>
              <div class="job-badges">
                <span class="badge badge-type">{{
                  job.JobTypes?.jobTypeName || "N/A"
                }}</span>
                <span v-if="job.urgency" class="badge badge-urgent">{{
                  job.urgency
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Job Description Section -->
      <section class="job-description">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <h2 class="section-title">Chi tiết tin tuyển dụng</h2>

              <h3 class="subsection-title">Mô tả công việc</h3>
              <div
                class="description-text"
                v-html="job.description || 'Không có mô tả'"
              ></div>

              <h3 class="subsection-title">Yêu cầu ứng viên</h3>
              <div
                class="description-text"
                v-html="job.candidateRequirements || 'Không có mô tả'"
              ></div>

              <h3 class="subsection-title">Quyền lợi</h3>
              <div
                class="description-text"
                v-html="job.benefit || 'Không có mô tả'"
              ></div>

              <h3 class="subsection-title">Thời gian làm việc</h3>
              <div
                class="description-text"
                v-html="job.workTime || 'Không có mô tả'"
              ></div>
            </div>

            <div class="col-lg-4">
              <!-- Job Overview Card -->
              <div class="overview-card">
                <h4 class="card-title">Tổng quan về công việc</h4>
                <ul class="overview-list">
                  <li>
                    <span
                      ><i class="fa-solid fa-calendar-days me-2"></i>Ngày
                      đăng:</span
                    >
                    <span>{{ formatDate(job.createdAt) }}</span>
                  </li>
                  <li>
                    <span
                      ><i class="fa-solid fa-clock me-2"></i>Ngày hết hạn:</span
                    >
                    <span>{{ formatDate(job.expire) }}</span>
                  </li>
                  <li>
                    <span
                      ><i class="fa-solid fa-location-dot me-2"></i>Địa
                      chỉ:</span
                    >
                    <span>{{ job.address || "N/A" }}</span>
                  </li>
                  <li>
                    <span
                      ><i class="fa-solid fa-briefcase me-2"></i>Công việc tuyển
                      dụng:</span
                    >
                    <span>{{ job.jobName || "N/A" }}</span>
                  </li>
                  <li>
                    <span
                      ><i class="fa-solid fa-money-bill me-2"></i>Mức
                      lương:</span
                    >
                    <span class="highlight">{{
                      job.Salaries?.salaryName || "N/A"
                    }}</span>
                  </li>
                </ul>
              </div>

              <!-- Company Info Card -->
              <div class="company-card">
                <h4 class="card-title">Thông tin về công ty</h4>
                <div class="company-info">
                  <img
                    :src="getCompanyLogo(job.Employers?.companyLogo)"
                    alt="Logo công ty"
                    class="company-logo"
                    @error="handleImageError"
                  />
                  <div>
                    <h5 class="company-name">
                      {{ job.Employers?.companyName || "N/A" }}
                    </h5>
                    <router-link
                      :to="`/company/${job.Employers?.id}`"
                      class="company-link"
                    >
                      Xem chi tiết công ty
                    </router-link>
                  </div>
                </div>
                <ul class="company-list">
                  <li>
                    <span>Ngành chính:</span>
                    <span>{{ job.Employers?.companyTaxCode || "N/A" }}</span>
                  </li>
                  <li>
                    <span>Quy mô:</span>
                    <span>{{ job.Employers?.companySize || "N/A" }}</span>
                  </li>
                  <li>
                    <span>Địa chỉ:</span>
                    <span>{{ job.Employers?.companyAddress || "N/A" }}</span>
                  </li>
                </ul>
                <a
                  :href="job.Employers?.companyWebsite || '#'"
                  class="website-link"
                  target="_blank"
                >
                  {{ job.Employers?.companyWebsite || "N/A" }}
                </a>
              </div>

              <!-- Action Buttons -->
              <button
                class="apply-button"
                @click="openApplyModal"
                :disabled="saveJobStore.isLoading || applyLoading"
                data-bs-toggle="modal"
                data-bs-target="#applyJobModal"
                aria-label="Ứng tuyển ngay cho công việc"
              >
                <i class="fas fa-paper-plane me-2"></i>Ứng tuyển ngay
              </button>
              <button
                class="save-button"
                :class="{ saved: isJobSaved }"
                @click="toggleSaveJob(job.id)"
                :disabled="saveJobStore.isLoading"
              >
                <i
                  :class="isJobSaved ? 'fas fa-heart' : 'far fa-heart'"
                  class="me-2"
                ></i>
                {{ isJobSaved ? "Đã lưu" : "Lưu công việc" }}
              </button>

              <!-- Social Share -->
              <div class="social-share">
                <p class="share-title">Chia sẻ công việc:</p>
                <div class="share-buttons">
                  <button
                    class="share-button facebook"
                    @click="share('facebook')"
                  >
                    <i class="fab fa-facebook-f"></i>
                  </button>
                  <button
                    class="share-button twitter"
                    @click="share('twitter')"
                  >
                    <i class="fab fa-twitter"></i>
                  </button>
                  <button
                    class="share-button linkedin"
                    @click="share('linkedin')"
                  >
                    <i class="fab fa-linkedin-in"></i>
                  </button>
                  <button
                    class="share-button whatsapp"
                    @click="share('whatsapp')"
                  >
                    <i class="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Jobs Section -->
      <section class="related-jobs" v-if="relatedJobs.length">
        <div class="container">
          <h2 class="section-title">Công việc liên quan</h2>
          <div class="row">
            <div
              class="col-md-4 mb-4"
              v-for="relatedJob in relatedJobs"
              :key="relatedJob.id"
            >
              <div class="related-job-card">
                <div class="job-info">
                  <img
                    :src="getCompanyLogo(relatedJob.Employers?.companyLogo)"
                    alt="Logo công ty"
                    class="job-logo"
                    @error="handleImageError"
                  />
                  <div>
                    <router-link
                      :to="`/jobs/${relatedJob.slug}`"
                      class="job-title"
                    >
                      {{ relatedJob.jobName }}
                    </router-link>
                    <div class="job-tags">
                      <span class="tag" v-if="relatedJob.address">{{
                        relatedJob.address
                      }}</span>
                      <span class="tag" v-if="relatedJob.postedAt">{{
                        formatPostedAt(relatedJob.postedAt)
                      }}</span>
                      <span
                        class="tag"
                        v-if="relatedJob.Salaries?.salaryName"
                        >{{ relatedJob.Salaries.salaryName }}</span
                      >
                    </div>
                    <div class="job-badges">
                      <span class="badge badge-type">{{
                        relatedJob.JobTypes?.jobTypeName || "N/A"
                      }}</span>
                      <span
                        class="badge badge-urgent"
                        v-if="relatedJob.status"
                        >{{ relatedJob.status }}</span
                      >
                    </div>
                  </div>
                </div>
                <button
                  class="save-job-button"
                  :class="{
                    saved: saveJobStore.jobs.some(
                      (job) => job.id === relatedJob.id
                    ),
                  }"
                  @click="toggleSaveJob(relatedJob.id)"
                  :disabled="saveJobStore.isLoading"
                >
                  <i
                    :class="
                      saveJobStore.jobs.some((job) => job.id === relatedJob.id)
                        ? 'fas fa-bookmark'
                        : 'far fa-bookmark'
                    "
                  ></i>
                  {{
                    saveJobStore.jobs.some((job) => job.id === relatedJob.id)
                      ? "Đã lưu"
                      : "Lưu"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Apply Job Modal -->
      <div
        class="modal fade"
        id="applyJobModal"
        tabindex="-1"
        aria-labelledby="applyJobModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="applyJobModalLabel">
                Ứng tuyển: {{ job.jobName || "Công việc" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent>
                <div class="mb-3">
                  <label for="introduction" class="form-label"
                    >Giới thiệu bản thân *</label
                  >
                  <textarea
                    v-model="applicationForm.introduction"
                    class="form-control"
                    id="introduction"
                    rows="5"
                    placeholder="Viết một đoạn giới thiệu ngắn về bản thân và lý do bạn phù hợp với vị trí này"
                    :class="{
                      'is-invalid': applicationForm.errors.introduction,
                    }"
                    required
                  ></textarea>
                  <div
                    v-if="applicationForm.errors.introduction"
                    class="invalid-feedback"
                  >
                    {{ applicationForm.errors.introduction }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Chọn CV *</label>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="cvOption"
                      id="uploadCv"
                      value="upload"
                      v-model="applicationForm.cvOption"
                      @change="clearCvSelection"
                    />
                    <label class="form-check-label" for="uploadCv"
                      >Tải lên CV mới</label
                    >
                  </div>
                  <div class="form-check mb-2">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="cvOption"
                      id="profileCv"
                      value="profile"
                      v-model="applicationForm.cvOption"
                      @change="clearCvSelection"
                    />
                    <label class="form-check-label" for="profileCv"
                      >Chọn CV từ hồ sơ</label
                    >
                  </div>

                  <!-- CV Upload -->
                  <div
                    v-if="applicationForm.cvOption === 'upload'"
                    class="mb-3"
                  >
                    <input
                      type="file"
                      class="form-control"
                      id="cvFile"
                      accept=".pdf,.doc,.docx"
                      @change="handleCvUpload"
                      :class="{ 'is-invalid': applicationForm.errors.cvFile }"
                    />
                    <div
                      v-if="applicationForm.errors.cvFile"
                      class="invalid-feedback"
                    >
                      {{ applicationForm.errors.cvFile }}
                    </div>
                    <!-- Link xem CV đã chọn -->
                    <div v-if="applicationForm.previewCvUrl" class="mt-2">
                      <a
                        :href="applicationForm.previewCvUrl"
                        target="_blank"
                        class="text-primary"
                        >Xem lại CV của bạn</a
                      >
                    </div>
                  </div>

                  <!-- Profile CV Selection -->
                  <div
                    v-if="applicationForm.cvOption === 'profile'"
                    class="mb-3"
                  >
                    <select
                      v-model="applicationForm.profileCvId"
                      class="form-select"
                      id="profileCvSelect"
                      :class="{
                        'is-invalid': applicationForm.errors.profileCvId,
                      }"
                    >
                      <option value="" disabled>Chọn một CV từ hồ sơ</option>
                      <option
                        v-for="cv in profileCvs"
                        :key="cv.id"
                        :value="cv.id"
                      >
                        {{ cv.name || `CV ${cv.id}` }} (Cập nhật:
                        {{ formatDate(cv.updatedAt) }})
                      </option>
                    </select>
                    <div
                      v-if="applicationForm.errors.profileCvId"
                      class="invalid-feedback"
                    >
                      {{ applicationForm.errors.profileCvId }}
                    </div>
                    <div v-if="!profileCvs.length" class="text-muted mt-2">
                      Không có CV nào trong hồ sơ. Vui lòng tải lên CV mới.
                    </div>
                  </div>

                  <div
                    v-if="applicationForm.errors.cvOption"
                    class="text-danger"
                  >
                    {{ applicationForm.errors.cvOption }}
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSaveJobsStore } from "@/stores/useSaveJobStore";
import { getDetailJob } from "@/apis/job";
import { toast } from "vue3-toastify";

export default {
  name: "JobDetail",
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const saveJobStore = useSaveJobsStore();

    const job = ref(null);
    const relatedJobs = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const applyLoading = ref(false);
    const profileCvs = ref([]);

    const applicationForm = ref({
      introduction: "",
      cvOption: "", // "upload" or "profile"
      cvFile: null,
      profileCvId: "",
      previewCvUrl: "", // Lưu URL tạm thời để xem CV
      errors: {},
    });

    const isJobSaved = computed(
      () =>
        job.value &&
        saveJobStore.jobs.some((savedJob) => savedJob.id === job.value.id)
    );

    // Hàm kiểm tra trạng thái đăng nhập
    const checkLoginStatus = () => {
      if (!authStore.isAuthenticated || !authStore.user) {
        toast.error("Bạn hãy đăng nhập");
        return false;
      }
      return true;
    };

    const formatDate = (date) => {
      if (!date) return "N/A";
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "N/A";
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      } catch (e) {
        return "N/A";
      }
    };

    const formatPostedAt = (date) => {
      if (!date) return "N/A";
      const now = new Date();
      const posted = new Date(date);
      const diffMs = now - posted;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return `${days} ngày trước`;
    };

    const getCompanyLogo = (logo) => {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    };

    const handleImageError = (event) => {
      event.target.src = "/images/default-company-logo.png";
    };

    const fetchJobDetail = async () => {
      const slug = route.params.slug;
      if (!slug) {
        error.value = "Không tìm thấy công việc";
        toast.error(error.value);
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const response = await getDetailJob(slug);
        if (response.status !== "success" || !response.data) {
          throw new Error("Dữ liệu công việc không hợp lệ");
        }
        job.value = response.data;
        relatedJobs.value = Array.isArray(response.data.relatedJobs)
          ? response.data.relatedJobs
          : [];
      } catch (err) {
        error.value = err.message || "Có lỗi xảy ra khi tải dữ liệu";
        toast.error(error.value);
      } finally {
        loading.value = false;
      }
    };

    const openApplyModal = () => {
      // Kiểm tra trạng thái đăng nhập
      if (!checkLoginStatus()) return;

      // Reset form khi mở modal
      applicationForm.value = {
        introduction: "",
        cvOption: "",
        cvFile: null,
        profileCvId: "",
        previewCvUrl: "",
        errors: {},
      };
    };

    const handleCvUpload = (event) => {
      const file = event.target.files[0];
      if (
        file &&
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        applicationForm.value.errors.cvFile =
          "Vui lòng tải lên file PDF, DOC hoặc DOCX";
        applicationForm.value.cvFile = null;
        applicationForm.value.previewCvUrl = "";
      } else {
        applicationForm.value.cvFile = file;
        applicationForm.value.errors.cvFile = "";
        // Tạo URL tạm thời để xem file
        if (file) {
          // Thu hồi URL cũ nếu có
          if (applicationForm.value.previewCvUrl) {
            URL.revokeObjectURL(applicationForm.value.previewCvUrl);
          }
          applicationForm.value.previewCvUrl = URL.createObjectURL(file);
        } else {
          applicationForm.value.previewCvUrl = "";
        }
      }
    };

    const clearCvSelection = () => {
      // Thu hồi URL tạm thời nếu có
      if (applicationForm.value.previewCvUrl) {
        URL.revokeObjectURL(applicationForm.value.previewCvUrl);
      }
      applicationForm.value.cvFile = null;
      applicationForm.value.profileCvId = "";
      applicationForm.value.previewCvUrl = "";
      applicationForm.value.errors.cvFile = "";
      applicationForm.value.errors.profileCvId = "";
    };

    const toggleSaveJob = async (jobId) => {
      if (!authStore.isAuthenticated || !authStore.candidateId) {
        toast.error("Bạn hãy đăng nhập để lưu công việc");
        return;
      }

      try {
        if (saveJobStore.jobs.some((savedJob) => savedJob.id === jobId)) {
          await saveJobStore.delJob(jobId);
        } else {
          await saveJobStore.saveJobs({
            candidateId: authStore.candidateId,
            jobId,
          });
        }
      } catch (err) {
        console.error("Lỗi khi thao tác với công việc đã lưu:", err);
      }
    };

    const share = (platform) => {
      const url = window.location.href;
      const title = job.value?.jobName || "Công việc";
      let shareUrl;

      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(title)}`;
          break;
        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `${title}: ${url}`
          )}`;
          break;
        default:
          return;
      }

      window.open(shareUrl, "_blank");
    };

    onMounted(async () => {
      try {
        if (authStore.isAuthenticated && authStore.candidateId) {
          await Promise.all([
            saveJobStore.fetchSaveJobs(1, saveJobStore.pageSize),
            fetchProfileCvs(),
          ]);
        }
        await fetchJobDetail();
      } catch (error) {
        console.error("Lỗi khi khởi tạo trang:", error);
      }
    });

    return {
      job,
      relatedJobs,
      loading,
      error,
      saveJobStore,
      applyLoading,
      profileCvs,
      applicationForm,
      isJobSaved,
      checkLoginStatus,
      formatDate,
      formatPostedAt,
      getCompanyLogo,
      handleImageError,
      openApplyModal,
      handleCvUpload,
      clearCvSelection,
      toggleSaveJob,
      share,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap");

.job-detail {
  font-family: "Rubik", sans-serif;
  background-color: #f5f7fa;
  color: #2d3748;
  line-height: 1.6;
}

/* Loading & Error States */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #3182ce;
}

.alert-danger {
  background-color: #fed7d7;
  border-color: #f56565;
  color: #c53030;
  border-radius: 8px;
  padding: 1rem;
}

/* Job Header Section */
.job-header {
  background: linear-gradient(120deg, #3182ce 0%, #4299e1 100%);
  padding: 3rem 0;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-logo {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  background-color: white;
  padding: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.header-logo:hover {
  transform: scale(1.05);
}

.header-info {
  flex: 1;
}

.job-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  letter-spacing: -0.5px;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(5px);
  transition: background 0.3s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tag i {
  font-size: 0.9rem;
}

.job-badges {
  display: flex;
  gap: 12px;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.badge-type {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.badge-urgent {
  background: #fbd38d;
  color: #744210;
}

/* Job Description Section */
.job-description {
  padding: 4rem 0;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 4px;
  background: #3182ce;
  border-radius: 2px;
}

.subsection-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2.5rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.subsection-title::before {
  content: "";
  display: block;
  width: 6px;
  height: 24px;
  background: #3182ce;
  border-radius: 3px;
}

.description-text {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.description-text ul {
  padding-left: 1.25rem;
}

.description-text li {
  margin-bottom: 0.5rem;
}

/* Info Cards */
.overview-card,
.company-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 1.75rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.overview-card:hover,
.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #edf2f7;
}

.overview-list,
.company-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.overview-list li,
.company-list li {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.overview-list li:last-child,
.company-list li:last-child {
  border-bottom: none;
}

.overview-list li span:first-child,
.company-list li span:first-child {
  font-weight: 500;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.overview-list li i,
.company-list li i {
  color: #3182ce;
}

.overview-list .highlight {
  color: #3182ce;
  font-weight: 600;
}

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #edf2f7;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #e2e8f0;
  padding: 4px;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.company-link {
  font-size: 0.95rem;
  color: #3182ce;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: color 0.3s ease;
}

.company-link:hover {
  color: #2b6cb0;
  text-decoration: underline;
}

.company-link::after {
  content: "→";
  transition: transform 0.3s ease;
}

.company-link:hover::after {
  transform: translateX(3px);
}

.website-link {
  display: block;
  font-size: 0.95rem;
  color: #3182ce;
  text-decoration: none;
  text-align: center;
  margin-top: 1.25rem;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.website-link:hover {
  background: #ebf8ff;
  border-color: #90cdf4;
  text-decoration: none;
}

/* Action Buttons */
.apply-button,
.save-button {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.apply-button {
  background: #3182ce;
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(49, 130, 206, 0.4);
}

.apply-button:hover {
  background: #2b6cb0;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(49, 130, 206, 0.5);
}

.apply-button:active {
  transform: translateY(-1px);
}

.apply-button:disabled {
  background: #a0aec0;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.save-button {
  background: white;
  color: #2d3748;
  border: 2px solid #e2e8f0;
}

.save-button:hover {
  border-color: #3182ce;
  color: #3182ce;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.save-button:active {
  transform: translateY(-1px);
}

.save-button.saved {
  background: #ebf8ff;
  color: #3182ce;
  border-color: #90cdf4;
}

.save-button.saved:hover {
  background: #bee3f8;
}

.save-button:disabled {
  background: #f7fafc;
  color: #a0aec0;
  border-color: #e2e8f0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Social Share */
.social-share {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 1.75rem;
  margin-bottom: 2rem;
}

.share-title {
  font-size: 1rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 500;
}

.share-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.share-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.share-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.share-button.facebook {
  background: #3b5998;
  color: white;
}

.share-button.twitter {
  background: #1da1f2;
  color: white;
}

.share-button.linkedin {
  background: #0077b5;
  color: white;
}

.share-button.whatsapp {
  background: #25d366;
  color: white;
}

/* Related Jobs */
.related-jobs {
  padding: 4rem 0;
  background: #edf2f7;
}

.related-job-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
  height: 100%;
}

.related-job-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.job-info {
  display: flex;
  align-items: flex-start;
  width: calc(100% - 100px);
}

.job-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #e2e8f0;
  padding: 4px;
}

.job-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
  margin-bottom: 0.75rem;
  display: block;
  transition: color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.job-title:hover {
  color: #3182ce;
}

.save-job-button {
  background: white;
  border: 2px solid #e2e8f0;
  color: #2d3748;
  padding: 0.5rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-job-button:hover {
  border-color: #3182ce;
  color: #3182ce;
  transform: scale(1.1);
}

.save-job-button.saved {
  background: #ebf8ff;
  color: #3182ce;
  border-color: #90cdf4;
}

.save-job-button.saved:hover {
  background: #bee3f8;
}

.save-job-button:disabled {
  background: #f7fafc;
  color: #a0aec0;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.btn-close {
  background-size: 0.8rem;
  transition: transform 0.3s ease;
}

.btn-close:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.75rem;
}

.form-label {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 10px;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #f56565;
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.2);
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-input {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.175rem;
  border: 2px solid #cbd5e0;
  transition: all 0.2s ease;
}

.form-check-input:checked {
  background-color: #3182ce;
  border-color: #3182ce;
}

.form-check-label {
  font-size: 1rem;
  color: #4a5568;
  padding-left: 0.5rem;
}

.invalid-feedback {
  font-size: 0.9rem;
  color: #e53e3e;
  margin-top: 0.5rem;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.75rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3182ce;
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.4);
}

.btn-primary:hover {
  background: #2b6cb0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(49, 130, 206, 0.5);
}

.btn-primary:disabled {
  background: #a0aec0;
  box-shadow: none;
}

.btn-secondary {
  background: #a0aec0;
  border: none;
  color: white;
}

.btn-secondary:hover {
  background: #718096;
  transform: translateY(-2px);
}

.text-muted {
  color: #718096;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .job-title {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {
  .job-header {
    padding: 2.5rem 0;
  }

  .header-logo {
    width: 100px;
    height: 100px;
  }

  .job-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .subsection-title {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .apply-button,
  .save-button {
    padding: 0.85rem;
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .job-header {
    padding: 2rem 0;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .header-logo {
    margin-right: 0;
  }

  .job-tags {
    justify-content: center;
  }

  .job-badges {
    justify-content: center;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .subsection-title {
    font-size: 1.15rem;
  }

  .description-text {
    font-size: 0.95rem;
  }

  .related-job-card {
    padding: 1.25rem;
  }

  .save-job-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .job-info {
    width: 100%;
  }

  .col-md-4 {
    position: relative;
  }
}

@media (max-width: 576px) {
  .job-header {
    padding: 1.75rem 0;
  }

  .header-logo {
    width: 90px;
    height: 90px;
  }

  .job-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .badge {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .subsection-title {
    font-size: 1.1rem;
  }

  .overview-list li,
  .company-list li {
    flex-direction: column;
    gap: 0.35rem;
    align-items: flex-start;
  }

  .overview-list li span:first-child,
  .company-list li span:first-child {
    margin-bottom: 0.25rem;
  }

  .share-buttons {
    flex-wrap: wrap;
  }

  .company-logo,
  .job-logo {
    width: 50px;
    height: 50px;
  }

  .company-name {
    font-size: 1.15rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body,
  .modal-header,
  .modal-footer {
    padding: 1.25rem;
  }

  .btn {
    font-size: 0.95rem;
    padding: 0.5rem 1.25rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.job-header,
.job-description,
.related-jobs {
  animation: fadeIn 0.6s ease-out;
}

.overview-card,
.company-card,
.related-job-card {
  animation: fadeIn 0.6s ease-out forwards;
}

.overview-card {
  animation-delay: 0.1s;
}

.company-card {
  animation-delay: 0.2s;
}

.social-share {
  animation-delay: 0.3s;
}

/* Enhanced Focus States for Accessibility */
button:focus,
a:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .job-header {
    background: none !important;
    color: #000 !important;
    padding: 1rem 0;
  }

  .tag,
  .badge {
    border: 1px solid #000;
    color: #000 !important;
    background: none !important;
  }

  .apply-button,
  .save-button,
  .share-buttons,
  .related-jobs {
    display: none !important;
  }

  .overview-card,
  .company-card {
    box-shadow: none;
    border: 1px solid #000;
  }
}
</style>
