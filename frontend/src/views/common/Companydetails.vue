<template>
  <div class="company-page">
    <!-- Company Header -->
    <div class="company-card">
      <div class="company-header">
        <div class="company-info">
          <img
            :src="getCompanyLogo(employer?.companyLogo)"
            @error="handleImageError"
            :alt="`Logo công ty ${employer?.companyName}`"
            class="company-logo"
          />
          <div>
            <h4 class="company-name">{{ employer?.companyName }}</h4>
            <div class="company-meta">
              <span
                ><i class="fa-solid fa-location-dot me-1"></i
                >{{ employer?.companyAddress }}</span
              >
              <span
                ><i class="fa-solid fa-briefcase me-1"></i
                >{{ employer?.industry }}</span
              >
              <span
                ><i class="fa-solid fa-users me-1"></i
                >{{ employer?.companySize }} nhân viên</span
              >
            </div>
            <div class="company-status">
              <span class="badge">Đang tuyển - {{ jobs.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Details -->
    <div class="container">
      <div class="row mt-5">
        <div class="col-lg-8 col-md-6 mb-4">
          <h4 class="section-title">Về công ty</h4>
          <p class="section-text">{{ employer?.companyDescription }}</p>
        </div>

        <div class="col-lg-4 col-md-6 mb-4">
          <div class="info-card">
            <div class="info-item">
              <span class="label">Ngành chính:</span>
              <span class="value">{{ employer?.industry }}</span>
            </div>
            <div class="info-item">
              <span class="label">Quy mô công ty:</span>
              <span class="value">{{ employer?.companySize }}</span>
            </div>
            <div class="info-item">
              <span class="label">Mã số thuế:</span>
              <span class="value">{{ employer?.companyTaxCode }}</span>
            </div>
            <div class="info-item">
              <span class="label">Địa chỉ:</span>
              <span class="value">{{ employer?.companyAddress }}</span>
            </div>
            <a
              :href="employer?.companyWebsite"
              class="website-link"
              target="_blank"
              rel="noopener noreferrer"
              >{{ employer?.companyWebsite }}</a
            >
          </div>
        </div>
      </div>

      <!-- Job Listings -->
      <h3 class="section-title mt-5">Công việc đang tuyển</h3>
      <div class="row mt-4">
        <div
          v-for="(job, index) in jobs"
          :key="job.id || index"
          class="col-lg-8 mb-4"
          :class="{ 'mt-3': index > 0 }"
        >
          <div class="job-card" @click="goToJobDetail(job.jobSlug)">
            <div class="job-header">
              <div class="job-info">
                <img
                  :src="getCompanyLogo(employer?.companyLogo)"
                  @error="handleImageError"
                  :alt="`Logo công ty ${employer?.companyName}`"
                  class="job-logo"
                />
                <div>
                  <h5 class="job-title">{{ job.jobName }}</h5>
                  <div class="job-meta">
                    <span
                      ><i class="fa-solid fa-briefcase me-1"></i
                      >{{ job.JobTypes.jobTypeName }}</span
                    >
                    <span
                      ><i class="fa-solid fa-location-dot me-1"></i
                      >{{ job.address }}</span
                    >
                    <span
                      ><i class="fa-solid fa-clock me-1"></i
                      >{{ formatPostedAt(job.createdAt) }}</span
                    >
                    <span
                      ><i class="fa-solid fa-money-bill me-1"></i
                      >{{ job.Salaries.salaryName }}</span
                    >
                  </div>
                  <div class="job-status">
                    <span class="badge">{{ job.JobTypes.jobTypeName }}</span>
                  </div>
                </div>
              </div>
              <div class="bookmark" @click.stop="toggleBookmark(job.id)">
                <i
                  :class="[
                    'fa-bookmark',
                    {
                      'fa-solid': job.isBookmarked,
                      'fa-regular': !job.isBookmarked,
                    },
                    'fa-lg',
                  ]"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Show message if no jobs available -->
      <div v-if="jobs.length === 0" class="row mt-4">
        <div class="col-12 text-center">
          <p class="no-jobs">Không có công việc nào đang được tuyển dụng.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

export default {
  name: "companyDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const employer = ref(null);
    const jobs = ref([]);

    const getCompanyLogo = (logo) => {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    };

    const handleImageError = (event) => {
      event.target.src = "/images/default-company-logo.png";
    };

    const formatPostedAt = (postedAt) => {
      if (!postedAt) return "Mới đăng";
      const date = new Date(postedAt);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ngày trước`;
    };

    const goToJobDetail = (jobSlug) => {
      if (jobSlug) {
        router.push(`/job/${jobSlug}`);
      } else {
        toast.error("Không tìm thấy thông tin công việc", { autoClose: 3000 });
      }
    };

    const toggleBookmark = (jobId) => {
      // Placeholder for bookmark functionality
      const job = jobs.value.find((j) => j.id === jobId);
      if (job) {
        job.isBookmarked = !job.isBookmarked;
        toast.info(
          job.isBookmarked ? "Đã lưu công việc" : "Đã bỏ lưu công việc",
          { autoClose: 2000 }
        );
      }
    };

    onMounted(async () => {
      const slug = route.params.slug;
      try {
        await userStore.fetchDetailEmployer(slug);
        employer.value = userStore.employer.employer;
        jobs.value = (userStore.employer.jobs || []).map((job) => ({
          ...job,
          isBookmarked: false, // Initialize bookmark state
        }));
      } catch (error) {
        console.error("Error fetching employer details:", error);
        toast.error("Lỗi khi tải thông tin công ty", { autoClose: 3000 });
      }
    });

    return {
      jobs,
      employer,
      getCompanyLogo,
      handleImageError,
      formatPostedAt,
      goToJobDetail,
      toggleBookmark,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap");

* {
  box-sizing: border-box;
}

.company-page {
  font-family: "Roboto", sans-serif;
  background-color: #f5f7fa;
  padding: 40px 0;
}

/* Company Card */
.company-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin: 0 20px;
  overflow: hidden;
}

.company-header {
  display: flex;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #3498db 0%, #2563eb 100%);
  color: #ffffff;
}

.company-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 20px;
  border: 2px solid #ffffff;
  padding: 4px;
  background: #ffffff;
}

.company-name {
  font-family: "Montserrat", sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 0.95rem;
  margin-top: 10px;
  opacity: 0.9;
}

.company-meta span {
  display: flex;
  align-items: center;
}

.company-meta i {
  margin-right: 6px;
}

.company-status .badge {
  background: #ffffff;
  color: #2563eb;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 12px;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Company Details */
.section-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.section-text {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 15px;
}

/* Info Card */
.info-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.info-item .label {
  font-weight: 600;
  color: #1e293b;
}

.info-item .value {
  color: #4b5563;
  text-align: right;
  max-width: 60%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.website-link {
  display: block;
  color: #3b82f6;
  font-size: 0.95rem;
  text-decoration: none;
  margin-top: 20px;
  transition: color 0.3s ease;
}

.website-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Job Card */
.job-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 140px; /* Fixed height for consistency */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.job-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: #ffffff;
  flex: 1;
}

.job-info {
  display: flex;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
}

.job-logo {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 16px;
  border: 1px solid #e2e8f0;
  padding: 4px;
  background: #ffffff;
  flex-shrink: 0;
}

.job-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 8px;
  overflow: hidden;
}

.job-meta span {
  display: flex;
  align-items: center;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.job-meta i {
  margin-right: 5px;
  color: #94a3b8;
}

.job-status .badge {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 8px;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.bookmark {
  flex-shrink: 0;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
  padding: 8px;
}

.bookmark:hover {
  color: #2563eb;
  transform: scale(1.2);
}

.bookmark i {
  font-size: 1.2rem;
}

.no-jobs {
  font-size: 1.1rem;
  color: #64748b;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

/* Responsive */
@media (max-width: 992px) {
  .company-card,
  .job-card {
    margin: 0 15px;
  }

  .company-name {
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-text {
    font-size: 0.95rem;
  }

  .info-card {
    padding: 20px;
  }

  .job-card {
    height: 130px;
  }

  .job-title {
    font-size: 1.1rem;
  }

  .job-meta span {
    font-size: 0.8rem;
    max-width: 150px;
  }

  .job-status .badge {
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .company-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .company-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .company-logo {
    margin-bottom: 15px;
  }

  .company-meta {
    flex-direction: column;
    gap: 10px;
  }

  .job-header {
    flex-direction: row;
    align-items: flex-start;
  }

  .job-info {
    flex-direction: row;
    align-items: flex-start;
  }

  .job-logo {
    width: 45px;
    height: 45px;
  }

  .job-card {
    height: 160px;
  }

  .bookmark {
    margin-top: 0;
    padding: 6px;
  }

  .info-item {
    font-size: 0.9rem;
  }

  .company-card,
  .job-card {
    margin: 0 10px;
  }
}

@media (max-width: 576px) {
  .company-name {
    font-size: 1.4rem;
  }

  .company-meta {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .section-text {
    font-size: 0.9rem;
  }

  .job-title {
    font-size: 1rem;
  }

  .job-meta span {
    font-size: 0.75rem;
    max-width: 120px;
  }

  .job-status .badge {
    font-size: 0.7rem;
    padding: 5px 10px;
  }

  .job-logo {
    width: 40px;
    height: 40px;
  }

  .job-card {
    height: 180px;
  }

  .info-card {
    padding: 15px;
  }

  .info-item {
    font-size: 0.85rem;
  }

  .bookmark i {
    font-size: 1rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.job-card {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.job-card:nth-child(1) {
  animation-delay: 0.1s;
}
.job-card:nth-child(2) {
  animation-delay: 0.2s;
}
.job-card:nth-child(3) {
  animation-delay: 0.3s;
}
.job-card:nth-child(4) {
  animation-delay: 0.4s;
}
.job-card:nth-child(5) {
  animation-delay: 0.5s;
}

/* Accessibility */
.job-card:focus,
.bookmark:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Ripple effect for bookmark */
.bookmark {
  position: relative;
  overflow: hidden;
}

.bookmark::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 100%;
  transform: scale(0);
  opacity: 1;
  transition: 0.5s;
}

.bookmark:active::after {
  transform: scale(20);
  opacity: 0;
}
</style>
