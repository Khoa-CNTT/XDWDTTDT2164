<template>
  <div class="company-page">
    <!-- Company Header -->
    <div class="company-card">
      <div class="company-header">
        <div class="company-info">
          <img
            :src="getCompanyLogo(employer?.companyLogo)"
            @error="handleImageError"
            alt="Company Logo"
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
                ><i class="fa-solid fa-clock me-1"></i
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
          {{ employer?.companyDescription }}
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
              <span class="label">Thành lập:</span>
              <span class="value">{{ employer?.companyTaxCode }}</span>
            </div>
            <div class="info-item">
              <span class="label">Địa chỉ:</span>
              <span class="value">{{ employer?.companyAddress }}</span>
            </div>
            <a :href="employer?.companyWebsite" class="website-link">{{
              employer?.companyWebsite
            }}</a>
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
          <div class="job-card">
            <div class="job-header">
              <div class="job-info">
                <img
                  :src="getCompanyLogo(employer?.companyLogo)"
                  @error="handleImageError"
                  alt="Company Logo"
                  class="job-logo"
                />
                <div>
                  <h5 class="job-title">{{ job.jobName }}</h5>
                  <div class="job-meta">
                    <span
                      ><i class="fa-solid fa-bag-shopping me-1"></i
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
                      ><i class="fa-solid fa-camera-retro me-1"></i
                      >{{ job.Salaries.salaryName }}</span
                    >
                  </div>
                  <div class="job-status">
                    <span class="badge">{{ job.JobTypes.jobTypeName }}</span>
                  </div>
                </div>
              </div>
              <div class="bookmark">
                <i class="fa-regular fa-bookmark fa-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Show message if no jobs available -->
      <div v-if="jobs.length === 0" class="row mt-4">
        <div class="col-12 text-center">
          <p>Không có công việc nào đang được tuyển dụng.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref } from "vue";
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

    onMounted(async () => {
      const slug = route.params.slug;
      try {
        await userStore.fetchDetailEmployer(slug);
        employer.value = userStore.employer.employer;
        jobs.value = userStore.employer.jobs;

        console.log({
          employer: employer.value,
          jobs: jobs.value,
        });
      } catch (error) {
        console.log(error);
      }
    });

    return {
      jobs,
      employer,
      getCompanyLogo,
      handleImageError,
      formatPostedAt,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

.company-page {
  font-family: "Poppins", Arial, sans-serif;
  background-color: #f8f9fa;
  padding: 40px 0;
}

/* Company Card */
.company-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 20px;
  overflow: hidden;
}

.company-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f1f3f5;
}

.company-info {
  display: flex;
  align-items: center;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.company-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.company-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 10px;
}

.company-meta span {
  display: flex;
  align-items: center;
}

.company-status .badge {
  background: #007bff;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 10px;
  display: inline-block;
}

.bookmark {
  margin-left: auto;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.bookmark:hover {
  color: #0056b3;
}

/* Company Details */
.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
}

.section-text {
  font-size: 1rem;
  color: #555555;
  line-height: 1.8;
  margin-bottom: 15px;
}

/* Info Card */
.info-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1rem;
}

.info-item .label {
  font-weight: 600;
  color: #333333;
}

.info-item .value {
  color: #555555;
}

.website-link {
  display: block;
  color: #007bff;
  font-size: 1rem;
  text-decoration: none;
  margin-top: 20px;
  transition: color 0.3s ease;
}

.website-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Job Card */
.job-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.job-card:hover {
  transform: translateY(-5px);
}

.job-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f1f3f5;
}

.job-info {
  display: flex;
  align-items: center;
}

.job-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 10px;
}

.job-meta span {
  display: flex;
  align-items: center;
}

.job-status .badge {
  background: #007bff;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 10px;
  margin-top: 10px;
  display: inline-block;
}

.job-status .badge-urgent {
  background: #ffc107;
  color: #333333;
}

/* Responsive */
@media (max-width: 992px) {
  .company-card,
  .job-card {
    margin: 0 15px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-text {
    font-size: 0.9rem;
  }

  .info-card {
    padding: 20px;
  }

  .job-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .company-header,
  .job-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .bookmark {
    margin-left: 0;
    margin-top: 15px;
  }

  .company-meta,
  .job-meta {
    flex-direction: column;
    gap: 10px;
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
    font-size: 1.25rem;
  }

  .company-meta,
  .job-meta {
    font-size: 0.8rem;
  }

  .job-title {
    font-size: 1rem;
  }

  .info-card {
    padding: 15px;
  }

  .info-item {
    font-size: 0.85rem;
  }
}
</style>
