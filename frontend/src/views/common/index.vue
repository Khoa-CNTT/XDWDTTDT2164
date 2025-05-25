<template>
  <div class="job-board">
    <!-- Slide -->
    <section class="banner-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h1 class="banner-title">
              Có <span class="highlight">93.178</span> Bài Đăng Ở Đây Cho Bạn!
            </h1>
            <p class="banner-desc">Tìm việc làm và cơ hội nghề nghiệp</p>
            <div class="search-form">
              <input
                type="text"
                class="search-input"
                placeholder="Tìm kiếm việc làm..."
                v-model="searchQuery"
              />
              <button class="search-button" @click="searchJobs">
                Tìm việc
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <img
              alt="Người chuyên nghiệp"
              class="banner-image"
              src="../../../src/assets/images/banner-person-1.png"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Danh mục Công việc phổ biến -->
    <section class="category-section">
      <div class="container">
        <h2 class="section-title text-center">Danh mục công việc phổ biến</h2>
        <div v-if="isLoading" class="category-loading text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh mục...
        </div>
        <div v-else-if="error" class="category-error alert alert-danger">
          {{ error }}
        </div>
        <div v-else class="row">
          <div
            class="col-lg-4 col-md-6 mb-4"
            v-for="category in categories"
            :key="category.id"
          >
            <div class="category-card" @click="goToCategory(category.id)">
              <img
                :src="`https://res.cloudinary.com/dh1i7su2f/image/upload/${category.categoryImage}`"
                alt=""
                style="width: 50px; height: 50px; object-fit: cover"
              />
              <div style="padding-left: 10px">
                <h5 class="category-name">{{ category.categoryName }}</h5>
                <p class="category-jobs">
                  ({{ category.Jobs.length }} vị trí đăng mới)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Công việc phổ biến -->
    <section class="jobs-section">
      <div class="container">
        <h2 class="section-title text-center">Công việc phổ biến</h2>
        <p class="section-desc text-center">
          Biết giá trị của bạn và tìm được công việc đáp ứng điều kiện cuộc sống
          của bạn
        </p>
        <div v-if="jobsLoading" class="jobs-loading text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải công việc...
        </div>
        <div v-else-if="jobsError" class="jobs-error alert alert-danger">
          {{ jobsError }}
        </div>
        <div v-else class="row">
          <div
            class="col-lg-4 col-md-6 mb-4"
            v-for="job in displayedJobs"
            :key="job.id"
          >
            <div class="job-card" @click="goToJobDetail(job.jobSlug)">
              <div class="job-info">
                <img
                  alt="Logo công ty"
                  class="job-logo"
                  :src="
                    `https://res.cloudinary.com/dh1i7su2f/image/upload/${job.Employers.companyLogo}` ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXZlaUXIWozu3xqknYB3S9nknCPGFPAEVZLA&s'
                  "
                />
                <div>
                  <h5 class="job-title">{{ job.jobName }}</h5>
                  <p class="job-meta">
                    <i class="fa-regular fa-building"></i>
                    {{ job.Employers.companyName }} -
                    <i class="fa-solid fa-location-dot"></i>
                    {{ job.address }} - <i class="fa-solid fa-sack-dollar"></i>
                    {{ job.Salaries.salaryName }}
                  </p>
                  <p class="job-time">
                    <i class="fa-solid fa-clock"></i> {{ job.time }}
                  </p>
                </div>
              </div>
              <div class="job-badges">
                <span class="badge badge-type">{{
                  job.JobTypes.jobTypeName
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="visibleJobs < jobs.length" class="text-center mt-4">
          <button class="view-more-button" @click="showMore">Xem thêm</button>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <img
              alt="Người làm việc trên laptop"
              class="cta-image"
              src="../../../src/assets/images/woman-working.jpg"
            />
          </div>
          <div class="col-lg-6">
            <h2 class="section-title">
              Hàng triệu công việc. Tìm người phù hợp với bạn
            </h2>
            <p class="section-desc">
              Tìm kiếm tất cả các vị trí mở trên web. Nhận được chất lượng ứng
              viên hàng đầu. Đọc đánh giá và hơn 600.000 công ty trên toàn thế
              giới
            </p>
            <button class="cta-button">Bắt đầu</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getCategoriesApi } from "@/apis/category";
import { getJobsApi } from "@/apis/job";
import { toast } from "vue3-toastify";

export default {
  name: "SuperioJobBoard",
  data() {
    return {
      searchQuery: "", // Lưu giá trị input tìm kiếm
      isLoading: false,
      error: null,
      categories: [],
      jobs: [],
      jobsLoading: false,
      jobsError: null,
      visibleJobs: 6,
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      testimonials: [
        {
          title: "Thiết kế tuyệt vời",
          content:
            "Nhờ nền tảng này, tôi đã tìm được công việc mơ ước chỉ trong thời gian ngắn. Giao diện thân thiện và đội ngũ hỗ trợ rất chuyên nghiệp!",
          name: "Thái Mai Quang",
          position: "Lập trình viên Web",
        },
        {
          title: "Dịch vụ tuyệt vời",
          content:
            "Tôi đã tìm được công việc lý tưởng qua nền tảng này. Quy trình mượt mà và hiệu quả. Rất khuyến khích cho bất kỳ ai đang tìm cơ hội việc làm chất lượng.",
          name: "Nguyễn Văn A",
          position: "Nhà thiết kế UX",
        },
        {
          title: "Hỗ trợ xuất sắc",
          content:
            "Đội ngũ chăm sóc khách hàng rất tận tâm trong suốt hành trình tìm việc của tôi. Họ cung cấp lời khuyên quý giá và kết nối tôi với các nhà tuyển dụng tuyệt vời.",
          name: "Trần Thị B",
          position: "Chuyên viên Marketing",
        },
      ],
    };
  },
  computed: {
    displayedJobs() {
      return this.jobs.slice(0, this.visibleJobs);
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchJobs({ page: 1, limit: 8 });
  },
  methods: {
    searchJobs() {
      const query = this.searchQuery.trim();
      if (query) {
        this.$router.push({
          path: "/list",
          query: { search: query },
        });
        this.searchQuery = ""; // Reset input sau khi tìm kiếm
      } else {
        toast.warning("Vui lòng nhập tên công việc để tìm kiếm!");
      }
    },
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await getCategoriesApi();
        console.log("Response từ getCategoriesApi:", response);
        if (!response || !response.data) {
          throw new Error("Dữ liệu danh mục không hợp lệ");
        }
        this.categories = response.data;
      } catch (error) {
        console.error("Lấy danh sách danh mục thất bại:", error);
        const errorMessage =
          error.response?.data?.message || "Lỗi khi lấy danh sách danh mục!";
        toast.error(errorMessage);
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchJobs(query) {
      this.setLoadingState(true);
      this.resetError();
      try {
        const response = await getJobsApi(query);
        console.log("Response từ getJobsApi:", response);
        if (!response || !response.data) {
          throw new Error("Dữ liệu bài đăng không hợp lệ");
        }
        this.jobs = response.data.jobs;
        this.totalPages = response.data.totalJobs;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
      } catch (error) {
        this.handleError(error, "Lỗi khi lấy danh sách bài đăng");
      } finally {
        this.setLoadingState(false);
      }
    },
    setLoadingState(state) {
      this.jobsLoading = state;
    },
    resetError() {
      this.jobsError = null;
    },
    handleError(error, defaultMessage) {
      console.error("Lỗi:", error);
      const errorMessage = error.response?.data?.message || defaultMessage;
      toast.error(errorMessage);
      this.jobsError = errorMessage;
    },
    showMore() {
      this.visibleJobs = this.jobs.length;
    },
    goToCategory(categoryId) {
      this.$router.push({
        path: "/list",
        query: { categoryId },
      });
    },
    goToJobDetail(jobSlug) {
      this.$router.push({
        path: `/job/${jobSlug}`,
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

.job-board {
  font-family: "Poppins", Arial, sans-serif;
  background-color: #f8f9fa;
}

/* Banner Section */
.banner-section {
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  padding: 60px 10px;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 20px;
}

.banner-title .highlight {
  color: #007bff;
}

.banner-desc {
  font-size: 1.2rem;
  color: #555555;
  margin-bottom: 30px;
}

.search-form {
  display: flex;
  gap: 10px;
  max-width: 500px;
}

.search-input {
  padding: 12px 20px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  flex-grow: 1;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.search-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.search-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.banner-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* Category Section */
.category-section {
  padding: 60px 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 40px;
}

.category-loading {
  padding: 30px;
  font-size: 1.2rem;
  color: #555555;
}

.category-loading i {
  font-size: 1.5rem;
  color: #007bff;
  margin-right: 10px;
}

.category-error {
  margin: 20px auto;
  max-width: 600px;
  padding: 15px;
  font-size: 1rem;
  border-radius: 8px;
}

.category-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; /* Indicate clickability */
  min-height: 100px; /* Ensure consistent height */
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-jobs {
  font-size: 0.9rem;
  color: #555555;
  margin: 0;
}

/* Jobs Section */
.jobs-section {
  padding: 60px 0;
  background: #f1f3f5;
}

.section-desc {
  font-size: 1.2rem;
  color: #555555;
  margin-bottom: 40px;
}

.jobs-loading {
  padding: 30px;
  font-size: 1.2rem;
  color: #555555;
}

.jobs-loading i {
  font-size: 1.5rem;
  color: #007bff;
  margin-right: 10px;
}

.jobs-error {
  margin: 20px auto;
  max-width: 600px;
  padding: 15px;
  font-size: 1rem;
  border-radius: 8px;
}

.job-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer; /* Indicate clickability */
  min-height: 200px; /* Ensure consistent height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.job-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.job-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 5px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.job-time {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 5px 0 0;
}

.job-meta i,
.job-time i {
  margin-right: 5px;
}

.job-badges {
  display: flex;
  gap: 10px;
}

.badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-type {
  background: #007bff;
  color: #ffffff;
}

.view-more-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.view-more-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* CTA Section */
.cta-section {
  padding: 60px 0;
}

.cta-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cta-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.cta-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 992px) {
  .banner-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .job-card,
  .category-card {
    padding: 15px;
  }

  .job-logo {
    width: 50px;
    height: 50px;
  }

  .category-card {
    min-height: 90px;
  }

  .job-card {
    min-height: 180px;
  }
}

@media (max-width: 768px) {
  .banner-section {
    padding: 40px 0;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-desc {
    font-size: 1rem;
  }

  .search-form {
    flex-direction: column;
  }

  .search-input,
  .search-button {
    width: 100%;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-desc {
    font-size: 1rem;
  }

  .job-title,
  .category-name {
    font-size: 1.1rem;
  }

  .job-meta,
  .job-time,
  .category-jobs {
    font-size: 0.8rem;
  }

  .category-card {
    min-height: 80px;
  }

  .job-card {
    min-height: 160px;
  }
}

@media (max-width: 576px) {
  .banner-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .job-card,
  .category-card {
    padding: 10px;
  }

  .job-logo {
    width: 40px;
    height: 40px;
  }

  .category-card {
    min-height: 70px;
  }

  .job-card {
    min-height: 140px;
  }

  .cta-image {
    margin-bottom: 20px;
  }
}
</style>
