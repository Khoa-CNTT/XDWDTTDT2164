<template>
  <div class="job-list">
    <!-- Job Header -->
    <section class="job-header">
      <div class="container text-center">
        <h1 class="header-title">Tìm Việc Làm</h1>
        <nav class="breadcrumb-nav">
          <router-link to="/" class="breadcrumb-link">Trang Chủ</router-link> /
          Danh sách công việc
        </nav>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="sidebar">
            <!-- Tìm kiếm từ khóa -->
            <h5 class="sidebar-title">Tìm kiếm bằng từ khóa</h5>
            <input
              type="text"
              class="sidebar-input"
              placeholder="Tên công việc, kỹ năng..."
              v-model="filters.search"
              @input="applyFilters"
            />

            <!-- Địa chỉ -->
            <h5 class="sidebar-title">Địa chỉ</h5>
            <select
              class="sidebar-select"
              v-model="filters.address"
              @change="applyFilters"
            >
              <option value="">Chọn tỉnh thành phố</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>

            <!-- Danh mục việc làm -->
            <h5 class="sidebar-title">Danh mục việc làm</h5>
            <select
              class="sidebar-select"
              v-model="filters.categoryId"
              @change="applyFilters"
            >
              <option value="">Chọn danh mục việc làm</option>
              <option
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.categoryName }}
              </option>
            </select>

            <!-- Hình thức làm việc -->
            <h5 class="sidebar-title">Hình thức làm việc</h5>
            <select
              class="sidebar-select"
              v-model="filters.jobTypeId"
              @change="applyFilters"
            >
              <option value="">Chọn hình thức làm việc</option>
              <option
                v-for="jobType in jobTypeStore.jobTypes"
                :key="jobType.id"
                :value="jobType.id"
              >
                {{ jobType.jobTypeName }}
              </option>
            </select>

            <!-- Cấp bậc -->
            <h5 class="sidebar-title">Cấp bậc</h5>
            <select
              class="sidebar-select"
              v-model="filters.rankId"
              @change="applyFilters"
            >
              <option value="">Chọn cấp bậc</option>
              <option
                v-for="rank in rankStore.ranks"
                :key="rank.id"
                :value="rank.id"
              >
                {{ rank.rankName }}
              </option>
            </select>

            <!-- Cấp độ kinh nghiệm -->
            <h5 class="sidebar-title">Cấp độ kinh nghiệm</h5>
            <select
              class="sidebar-select"
              v-model="filters.experienceId"
              @change="applyFilters"
            >
              <option value="">Chọn cấp độ kinh nghiệm</option>
              <option
                v-for="experience in experienceStore.experiences"
                :key="experience.id"
                :value="experience.id"
              >
                {{ experience.experienceName }}
              </option>
            </select>

            <!-- Mức lương -->
            <h5 class="sidebar-title">Mức lương (Triệu VNĐ)</h5>
            <select
              class="sidebar-select"
              v-model="filters.salaryId"
              @change="applyFilters"
            >
              <option value="">Chọn mức lương</option>
              <option
                v-for="salary in salaryStore.salaries"
                :key="salary.id"
                :value="salary.id"
              >
                {{ salary.salaryName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Job Listings -->
        <div class="col-lg-9">
          <div class="job-listings">
            <div v-if="jobStore.isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
            </div>
            <div
              v-else-if="jobStore.error"
              class="alert alert-danger text-center"
            >
              {{ jobStore.error }}
            </div>
            <div
              v-else-if="jobStore.jobs.length === 0"
              class="alert alert-info text-center"
            >
              Không tìm thấy công việc phù hợp. Vui lòng thử các bộ lọc khác.
            </div>

            <div v-else>
              <div class="listings-header">
                <p>
                  Hiển thị <strong>{{ jobStore.jobs.length }}</strong> công việc
                </p>
              </div>

              <!-- Job Card -->
              <div v-for="job in jobStore.jobs" :key="job.id">
                <div class="job-card" @click="goToJobDetail(job.jobSlug)">
                  <div class="job-content">
                    <img
                      :src="getCompanyLogo(job.Employers.companyLogo)"
                      :alt="`Logo công ty ${job.Employers.companyName}`"
                      class="job-logo"
                      @error="handleImageError"
                    />
                    <div class="job-info">
                      <router-link
                        :to="`/job/${job.jobSlug}`"
                        class="job-title"
                        @click.stop
                        >{{ job.jobName }}</router-link
                      >
                      <div class="job-tags">
                        <span class="tag"
                          ><i class="fa-solid fa-briefcase me-1"></i
                          >{{ job.Ranks.rankName }}</span
                        >
                        <span class="tag"
                          ><i class="fa-solid fa-location-dot me-1"></i
                          >{{ job.address }}</span
                        >
                        <span class="tag"
                          ><i class="fa-solid fa-clock me-1"></i
                          >{{ formatPostedAt(job.createdAt) }}</span
                        >
                        <span class="tag"
                          ><i class="fa-solid fa-money-bill me-1"></i
                          >{{ job.Salaries.salaryName }}</span
                        >
                      </div>
                      <div class="job-badges">
                        <span class="badge badge-type">{{
                          job.JobTypes.jobTypeName
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    class="save-button"
                    :class="{
                      saved:
                        saveJobStore.jobs.some(
                          (savedJob) => savedJob.jobId === job.id
                        ) && authStore.isAuthenticated,
                    }"
                    @click.stop="toggleSaveJob(job.id)"
                    :disabled="job.isSaving"
                  >
                    <i
                      :class="
                        job.isSaving
                          ? 'fa-solid fa-spinner fa-spin'
                          : saveJobStore.jobs.some(
                              (savedJob) => savedJob.jobId === job.id
                            ) && authStore.isAuthenticated
                          ? 'fa-solid fa-bookmark'
                          : 'fa-regular fa-bookmark'
                      "
                    ></i>
                    {{
                      job.isSaving
                        ? "Đang xử lý..."
                        : saveJobStore.jobs.some(
                            (savedJob) => savedJob.jobId === job.id
                          ) && authStore.isAuthenticated
                        ? "Đã lưu"
                        : "Lưu"
                    }}
                  </button>
                </div>
              </div>

              <!-- Pagination -->
              <nav class="pagination-nav" v-if="jobStore.totalPages > 1">
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="{ disabled: jobStore.currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(jobStore.currentPage - 1)"
                      :disabled="jobStore.currentPage === 1"
                      aria-label="Trang trước"
                    >
                      <i class="fa-solid fa-chevron-left"></i>
                      <span>Trước</span>
                    </button>
                  </li>
                  <li
                    v-for="page in paginationPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === jobStore.currentPage }"
                  >
                    <button class="page-link" @click="changePage(page)">
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
                      @click="changePage(jobStore.currentPage + 1)"
                      :disabled="jobStore.currentPage === jobStore.totalPages"
                      aria-label="Trang sau"
                    >
                      <span>Sau</span>
                      <i class="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useJobStore } from "@stores/useJobStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSaveJobsStore } from "@/stores/useSaveJobStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useJobTypeStore } from "@stores/useJobTypeStore";
import { useRankStore } from "@stores/useRankStore";
import { useExperienceStore } from "@stores/useExperienceStore";
import { useSalaryStore } from "@stores/useSalaryStore";
import { ref, watch, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";

export default {
  name: "JobsList",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const jobStore = useJobStore();
    const saveJobStore = useSaveJobsStore();
    const categoryStore = useCategoryStore();
    const jobTypeStore = useJobTypeStore();
    const rankStore = useRankStore();
    const experienceStore = useExperienceStore();
    const salaryStore = useSalaryStore();

    // Danh sách tỉnh thành phố (có thể thay bằng API)
    const cities = ref([
      "Hà Nội",
      "Đà Nẵng",
      "TP. Hồ Chí Minh",
      "Cần Thơ",
      "Hải Phòng",
      // Thêm các tỉnh thành khác nếu cần
    ]);

    const filters = ref({
      search: "",
      address: "",
      categoryId: "",
      jobTypeId: "",
      rankId: "",
      experienceId: "",
      salaryId: "",
      page: 1,
    });

    const initializeFiltersFromQuery = () => {
      filters.value.search = route.query.search || "";
      filters.value.address = route.query.address || "";
      filters.value.categoryId = route.query.categoryId || "";
      filters.value.jobTypeId = route.query.jobTypeId || "";
      filters.value.rankId = route.query.rankId || "";
      filters.value.experienceId = route.query.experienceId || "";
      filters.value.salaryId = route.query.salaryId || "";
      filters.value.page = parseInt(route.query.page, 10) || 1;
    };

    const updateQueryParams = () => {
      const query = {};
      if (filters.value.search) query.search = filters.value.search;
      if (filters.value.address) query.address = filters.value.address;
      if (filters.value.categoryId) query.categoryId = filters.value.categoryId;
      if (filters.value.jobTypeId) query.jobTypeId = filters.value.jobTypeId;
      if (filters.value.rankId) query.rankId = filters.value.rankId;
      if (filters.value.experienceId)
        query.experienceId = filters.value.experienceId;
      if (filters.value.salaryId) query.salaryId = filters.value.salaryId;
      if (filters.value.page > 1) query.page = filters.value.page.toString();
      router.replace({ query });
    };

    const applyFilters = () => {
      filters.value.page = 1;
      updateQueryParams();
      fetchJobs();
    };

    const fetchJobs = async () => {
      try {
        await jobStore.fetchJobs({
          search: filters.value.search,
          address: filters.value.address,
          categoryId: filters.value.categoryId,
          jobTypeId: filters.value.jobTypeId,
          rankId: filters.value.rankId,
          experienceId: filters.value.experienceId,
          salaryId: filters.value.salaryId,
          page: filters.value.page,
          limit: jobStore.pageSize,
        });
        jobStore.jobs = jobStore.jobs.map((job) => ({
          ...job,
          isSaving: job.isSaving || false,
        }));
      } catch (error) {
        jobStore.error =
          error.response?.data?.message || "Lỗi khi lấy danh sách công việc";
        toast.error(jobStore.error, { autoClose: 3000 });
      }
    };

    const fetchFilterData = async () => {
      try {
        await Promise.all([
          categoryStore.fetchCategories(),
          jobTypeStore.fetchJobTypes(),
          rankStore.fetchRanks(),
          experienceStore.fetchExperiences(),
          salaryStore.fetchSalaries(),
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bộ lọc:", error);
        toast.error("Không thể tải dữ liệu bộ lọc", { autoClose: 3000 });
      }
    };

    const toggleSaveJob = async (jobId) => {
      if (!authStore.isAuthenticated) {
        toast.error("Bạn cần phải đăng nhập để lưu công việc", {
          autoClose: 3000,
        });
        return;
      }

      if (authStore.user.role !== "candidate") {
        toast.error("Chỉ ứng viên mới có thể lưu công việc", {
          autoClose: 3000,
        });
        return;
      }

      const job = jobStore.jobs.find((j) => j.id === jobId);
      if (!job) {
        console.error("Job not found:", jobId);
        return;
      }

      job.isSaving = true;
      jobStore.jobs = jobStore.jobs.map((j) =>
        j.id === jobId ? { ...j, isSaving: true } : j
      );

      try {
        if (saveJobStore.jobs.some((savedJob) => savedJob.jobId === jobId)) {
          await saveJobStore.delJob(jobId);
          toast.success("Đã xóa công việc khỏi danh sách lưu", {
            autoClose: 3000,
          });
        } else {
          await saveJobStore.saveJobs({
            candidateId: authStore.candidateId,
            jobId,
          });
        }
      } catch (error) {
        console.error("Toggle save job failed:", error);
        toast.error("Lỗi khi lưu/xóa công việc", { autoClose: 3000 });
      } finally {
        jobStore.jobs = jobStore.jobs.map((j) =>
          j.id === jobId ? { ...j, isSaving: false } : j
        );
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > jobStore.totalPages) return;
      filters.value.page = page;
      updateQueryParams();
      fetchJobs();
    };

    const goToJobDetail = (jobSlug) => {
      router.push(`/job/${jobSlug}`);
    };

    const paginationPages = computed(() => {
      const pages = [];
      const maxPagesToShow = 5;
      let startPage = Math.max(
        1,
        jobStore.currentPage - Math.floor(maxPagesToShow / 2)
      );
      let endPage = Math.min(
        jobStore.totalPages,
        startPage + maxPagesToShow - 1
      );

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    const getCompanyLogo = (logo) => {
      if (!logo) return "/images/default-company-logo.png";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${logo}`;
    };

    const handleImageError = (event) => {
      event.target.src = "/images/default-company-logo.png";
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

    watch(
      () => route.query,
      () => {
        initializeFiltersFromQuery();
        fetchJobs();
      },
      { immediate: true }
    );

    onMounted(async () => {
      await fetchFilterData();
      if (authStore.isAuthenticated && authStore.user.Candidates) {
        await saveJobStore.fetchSaveJobs();
      }
    });

    return {
      filters,
      cities,
      applyFilters,
      toggleSaveJob,
      changePage,
      paginationPages,
      getCompanyLogo,
      handleImageError,
      jobStore,
      authStore,
      formatPostedAt,
      saveJobStore,
      categoryStore,
      jobTypeStore,
      rankStore,
      experienceStore,
      salaryStore,
      goToJobDetail,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap");

* {
  box-sizing: border-box;
}

.job-list {
  font-family: "Roboto", sans-serif;
  background-color: #f5f7fa;
  padding: 0 0 60px 0;
  color: #2d3748;
}

/* Job Header */
.job-header {
  background: linear-gradient(135deg, #3498db 0%, #2563eb 100%);
  padding: 50px 0;
  margin-bottom: 30px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-family: "Montserrat", sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.breadcrumb-nav {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
}

.breadcrumb-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  text-decoration: underline;
  opacity: 0.9;
}

/* Sidebar */
.sidebar {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 25px;
  position: sticky;
  top: 20px;
  transition: transform 0.3s ease;
}

.sidebar:hover {
  transform: translateY(-5px);
}

.sidebar-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.sidebar-title:first-child {
  margin-top: 0;
}

.sidebar-input,
.sidebar-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.sidebar-input:focus,
.sidebar-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  background-color: #ffffff;
}

.sidebar-input::placeholder {
  color: #94a3b8;
}

.job-listings {
  padding: 10px 20px 20px;
}

.listings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.listings-header p {
  font-size: 1.05rem;
  color: #4b5563;
}

.listings-header strong {
  color: #1e293b;
  font-weight: 600;
}

.job-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
  height: 160px; /* Fixed height for consistency */
  overflow: hidden;
  width: 100%;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.job-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
}

.job-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 16px;
  border: 1px solid #e2e8f0;
  padding: 4px;
  background: #ffffff;
  flex-shrink: 0;
}

.job-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.job-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.job-title:hover {
  color: #3b82f6;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.job-tags .tag {
  background: #f8fafc;
  color: #64748b;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Prevent tags from stretching too wide */
}

.job-tags .tag i {
  margin-right: 5px;
  color: #94a3b8;
}

.job-badges {
  display: flex;
  gap: 8px;
  overflow: hidden;
}

.badge {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-type {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
}

.save-button {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.save-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.save-button.saved {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.save-button i {
  font-size: 0.85rem;
}

/* Pagination */
.pagination-nav {
  margin-top: 35px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0;
}

.page-item {
  list-style: none;
}

.page-link {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.page-item.active .page-link {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.page-item.disabled .page-link {
  background: #f8fafc;
  color: #94a3b8;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 992px) {
  .header-title {
    font-size: 2.2rem;
  }

  .sidebar {
    margin-bottom: 30px;
  }

  .job-logo {
    width: 50px;
    height: 50px;
  }

  .job-card {
    height: 140px;
  }

  .job-title {
    font-size: 1rem;
  }

  .job-tags .tag,
  .badge {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  .save-button {
    font-size: 0.85rem;
    padding: 6px 14px;
  }
}

@media (max-width: 768px) {
  .job-header {
    padding: 40px 0;
    margin-bottom: 20px;
  }

  .header-title {
    font-size: 2rem;
  }

  .sidebar {
    position: relative;
    top: 0;
  }

  .listings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .job-card {
    flex-direction: column;
    align-items: flex-start;
    height: 220px;
  }

  .job-content {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }

  .save-button {
    margin-top: 12px;
    align-self: flex-end;
  }

  .job-title {
    font-size: 0.95rem;
  }

  .job-tags .tag,
  .badge {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}

@media (max-width: 576px) {
  .job-header {
    padding: 30px 0;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .breadcrumb-nav {
    font-size: 0.9rem;
  }

  .sidebar-title {
    font-size: 1.1rem;
  }

  .job-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-logo {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
    margin-right: 0;
  }

  .job-tags {
    gap: 6px;
  }

  .job-tags .tag,
  .badge {
    padding: 4px 6px;
    font-size: 0.65rem;
  }

  .save-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .page-link {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .job-card {
    height: 240px;
  }

  .job-title {
    font-size: 0.9rem;
  }
}

/* Extra Enhancements */
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Ripple effect for buttons */
.save-button {
  position: relative;
  overflow: hidden;
}

.save-button::after {
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

.save-button:active::after {
  transform: scale(20);
  opacity: 0;
}

/* Focus states for accessibility */
.sidebar-input:focus,
.sidebar-select:focus,
.page-link:focus,
.save-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Empty state for job listings */
.job-listings:empty::after {
  content: "Không tìm thấy công việc phù hợp. Vui lòng thử các bộ lọc khác.";
  display: block;
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  font-size: 1.1rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
  margin: 20px 0;
}
</style>
