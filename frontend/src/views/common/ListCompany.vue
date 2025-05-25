<template>
  <div class="company-list">
    <!-- Header -->
    <section class="header">
      <div class="container text-center">
        <h1 class="header-title">Danh Sách Công Ty</h1>
        <nav class="breadcrumb-nav">
          <router-link to="/" class="breadcrumb-link">Trang Chủ</router-link> /
          <span class="current-page">Danh sách công ty</span>
        </nav>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container main-content">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="sidebar">
            <!-- Tìm kiếm từ khóa -->
            <div class="search-box">
              <h5 class="sidebar-title">Tìm kiếm bằng từ khóa</h5>
              <div class="input-with-icon">
                <i class="fa-solid fa-search search-icon"></i>
                <input
                  v-model="filters.search"
                  type="text"
                  class="sidebar-input"
                  placeholder="Tên công ty, ngành nghề..."
                  @input="applyFilters"
                />
              </div>
            </div>

            <!-- Địa chỉ -->
            <div class="filter-box">
              <h5 class="sidebar-title">Địa chỉ</h5>
              <div class="select-wrapper">
                <select
                  v-model="filters.address"
                  class="sidebar-select"
                  @change="applyFilters"
                >
                  <option value="">Chọn tỉnh thành phố</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down select-icon"></i>
              </div>
            </div>

            <!-- Ngành nghề -->
            <div class="filter-box">
              <h5 class="sidebar-title">Ngành nghề</h5>
              <div class="select-wrapper">
                <select
                  v-model="filters.industry"
                  class="sidebar-select"
                  @change="applyFilters"
                  :disabled="categoryStore.isLoading"
                >
                  <option value="">Chọn ngành nghề</option>
                  <option
                    v-for="category in categoryStore.categories"
                    :key="category.id"
                    :value="category.categoryName"
                  >
                    {{ category.categoryName }}
                  </option>
                </select>
                <i class="fa-solid fa-chevron-down select-icon"></i>
                <div v-if="categoryStore.isLoading" class="loading-overlay">
                  <i class="fa-solid fa-spinner fa-spin"></i>
                </div>
              </div>
              <div v-if="categoryStore.error" class="text-danger mt-2">
                {{ categoryStore.error }}
              </div>
            </div>

            <button
              class="apply-filter-btn"
              @click="applyFilters"
              :disabled="categoryStore.isLoading"
            >
              <i class="fa-solid fa-filter me-2"></i>Áp dụng bộ lọc
            </button>
          </div>
        </div>

        <!-- Company Listings -->
        <div class="col-lg-9">
          <div class="company-listings">
            <!-- Loading State -->
            <div v-if="employersStore.isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
            </div>
            <!-- Error State -->
            <div
              v-else-if="employersStore.error"
              class="alert alert-danger text-center"
            >
              {{ employersStore.error }}
            </div>
            <!-- Listings -->
            <div v-else>
              <div class="listings-header">
                <p class="results-count">
                  Hiển thị
                  <strong>{{ employersStore.employers.length }}</strong> công ty
                </p>
              </div>

              <!-- Company Cards Container -->
              <div class="company-cards-container">
                <div
                  v-for="employer in employersStore.employers"
                  :key="employer.id"
                  class="company-card"
                >
                  <div class="company-content">
                    <div class="logo-container">
                      <img
                        :src="getCompanyLogo(employer.companyLogo)"
                        :alt="`Logo công ty ${employer.companyName}`"
                        class="company-logo"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="company-info">
                      <router-link
                        :to="`/company/${employer.companySlug}`"
                        class="company-name"
                        :data-verified="employer.isVerified || false"
                      >
                        {{ employer.companyName || "N/A" }}
                      </router-link>
                      <div class="company-tags">
                        <span class="tag" v-if="employer.industry">
                          <i class="fa-solid fa-briefcase"></i
                          >{{ employer.industry }}
                        </span>
                        <span class="tag" v-if="employer.companyAddress">
                          <i class="fa-solid fa-location-dot"></i
                          >{{ employer.companyAddress }}
                        </span>
                        <span class="tag" v-if="employer.companySize">
                          <i class="fa-solid fa-users"></i
                          >{{ employer.companySize }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="company-actions">
                    <router-link
                      :to="`/company/${employer.companySlug}`"
                      class="detail-button"
                    >
                      Xem chi tiết
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <nav class="pagination-nav" v-if="employersStore.totalPages > 1">
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="{ disabled: employersStore.currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(employersStore.currentPage - 1)"
                      :disabled="employersStore.currentPage === 1"
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
                    :class="{ active: page === employersStore.currentPage }"
                  >
                    <button class="page-link" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{
                      disabled:
                        employersStore.currentPage ===
                        employersStore.totalPages,
                    }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(employersStore.currentPage + 1)"
                      :disabled="
                        employersStore.currentPage === employersStore.totalPages
                      "
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { toast } from "vue3-toastify";

export default {
  name: "CompanyList",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const employersStore = useUserStore();
    const categoryStore = useCategoryStore();

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
      industry: "",
      sort: "newest",
      view: "all",
      page: 1,
    });

    // Initialize filters from URL query parameters
    const initializeFiltersFromQuery = () => {
      filters.value.search = route.query.search || "";
      filters.value.address = route.query.address || "";
      filters.value.industry = route.query.industry || "";
      filters.value.sort = route.query.sort || "newest";
      filters.value.view = route.query.view || "all";
      filters.value.page = parseInt(route.query.page, 10) || 1;
    };

    // Update URL query parameters based on filters
    const updateQueryParams = () => {
      const query = {};
      if (filters.value.search) query.search = filters.value.search;
      if (filters.value.address) query.address = filters.value.address;
      if (filters.value.industry) query.industry = filters.value.industry;
      if (filters.value.sort && filters.value.sort !== "newest")
        query.sort = filters.value.sort;
      if (filters.value.view && filters.value.view !== "all")
        query.view = filters.value.view;
      if (filters.value.page > 1) query.page = filters.value.page.toString();

      router.replace({ query });
    };

    const applyFilters = () => {
      filters.value.page = 1; // Reset to first page on filter change
      updateQueryParams();
      fetchEmployers();
    };

    const fetchEmployers = async () => {
      try {
        await employersStore.fetchAllEmployers({
          search: filters.value.search,
          address: filters.value.address,
          industry: filters.value.industry,
          sort: filters.value.sort,
          view: filters.value.view,
          page: filters.value.page,
          limit: employersStore.pageSize,
        });
      } catch (err) {
        toast.error(employersStore.error || "Lỗi khi lấy danh sách công ty", {
          autoClose: 3000,
        });
      }
    };

    const fetchCategories = async () => {
      try {
        await categoryStore.fetchCategories();
      } catch (error) {
        toast.error("Không thể tải danh sách ngành nghề", { autoClose: 3000 });
      }
    };

    const getCategoryName = (categoryId) => {
      const category = categoryStore.categories.find(
        (cat) => cat.id === categoryId
      );
      return category ? category.categoryName : "N/A";
    };

    const changePage = (page) => {
      if (page < 1 || page > employersStore.totalPages) return;
      filters.value.page = page;
      updateQueryParams();
      fetchEmployers();
    };

    const paginationPages = computed(() => {
      const pages = [];
      const maxPagesToShow = 5;
      let startPage = Math.max(
        1,
        employersStore.currentPage - Math.floor(maxPagesToShow / 2)
      );
      let endPage = Math.min(
        employersStore.totalPages,
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

    // Watch for route changes to update filters (e.g., back/forward navigation)
    watch(
      () => route.query,
      () => {
        initializeFiltersFromQuery();
        fetchEmployers();
      },
      { immediate: true }
    );

    onMounted(async () => {
      await fetchCategories();
      if (authStore.isAuthenticated && authStore.candidateId) {
        // Fetch saved companies if save feature is needed
        // await employersStore.fetchSavedCompanies();
      }
    });

    return {
      employersStore,
      categoryStore,
      filters,
      cities,
      paginationPages,
      applyFilters,
      changePage,
      getCompanyLogo,
      handleImageError,
      getCategoryName,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap");

* {
  box-sizing: border-box;
}

.company-list {
  font-family: "Roboto", sans-serif;
  background-color: #f5f7fa;
  padding: 0 0 60px 0;
  color: #2d3748;
}

/* Header */
.header {
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

.current-page {
  color: rgba(255, 255, 255, 0.8);
}

.main-content {
  margin-top: 30px;
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

.search-box,
.filter-box {
  margin-bottom: 25px;
}

.sidebar-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.input-with-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.sidebar-input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.sidebar-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  background-color: #ffffff;
}

.sidebar-input::placeholder {
  color: #94a3b8;
}

.select-wrapper {
  position: relative;
}

.sidebar-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background-color: #f8fafc;
  appearance: none;
  transition: all 0.3s ease;
}

.sidebar-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  background-color: #ffffff;
}

.select-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.apply-filter-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.apply-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}

.apply-filter-btn:active {
  transform: translateY(0);
}

/* Company Listings */
.company-listings {
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

.results-count {
  font-size: 1.05rem;
  color: #4b5563;
}

.results-count strong {
  color: #1e293b;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background-color: #ffffff;
  appearance: none;
  min-width: 150px;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #4b5563;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

/* Company Cards */
.company-cards-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.company-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  height: 140px; /* Fixed height for consistency */
  overflow: hidden;
  width: 100%;
}

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.company-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
}

.logo-container {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  border: 1px solid #e2e8f0;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.company-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.company-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.company-name {
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

.company-name:hover {
  color: #3b82f6;
}

.company-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden;
}

.company-tags .tag {
  background: #f8fafc;
  color: #64748b;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px; /* Prevent tags from stretching too wide */
}

.company-tags .tag i {
  margin-right: 5px;
  color: #94a3b8;
}

.company-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}

.detail-button {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
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
  display: flex;
  align-items: center;
  gap: 8px;
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

/* Loading & Error States */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
}

.alert-danger {
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  background-color: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

/* Animation for company cards */
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

.company-card:nth-child(1) {
  animation-delay: 0.1s;
}
.company-card:nth-child(2) {
  animation-delay: 0.2s;
}
.company-card:nth-child(3) {
  animation-delay: 0.3s;
}
.company-card:nth-child(4) {
  animation-delay: 0.4s;
}
.company-card:nth-child(5) {
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

/* Focus states for accessibility */
.sidebar-input:focus,
.sidebar-select:focus,
.filter-select:focus,
.page-link:focus,
.apply-filter-btn:focus,
.detail-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Empty state */
.company-cards-container:empty::after {
  content: "Không tìm thấy công ty phù hợp. Vui lòng thử các bộ lọc khác.";
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

/* Responsive */
@media (max-width: 992px) {
  .header-title {
    font-size: 2.2rem;
  }

  .sidebar {
    margin-bottom: 30px;
  }

  .logo-container {
    width: 50px;
    height: 50px;
  }

  .company-card {
    height: 130px;
  }

  .company-name {
    font-size: 1rem;
  }

  .company-tags .tag {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  .detail-button {
    font-size: 0.85rem;
    padding: 6px 14px;
  }
}

@media (max-width: 768px) {
  .header {
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

  .filters {
    width: 100%;
    justify-content: space-between;
  }

  .company-card {
    flex-direction: column;
    align-items: flex-start;
    height: 200px;
  }

  .company-content {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }

  .company-actions {
    margin-top: 12px;
    align-self: flex-end;
  }

  .detail-button {
    width: auto;
  }

  .company-name {
    font-size: 0.95rem;
  }

  .company-tags .tag {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}

@media (max-width: 576px) {
  .header {
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

  .company-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .logo-container {
    margin-bottom: 10px;
    margin-right: 0;
    width: 48px;
    height: 48px;
  }

  .company-tags {
    justify-content: flex-start;
    gap: 6px;
  }

  .company-tags .tag {
    padding: 4px 6px;
    font-size: 0.65rem;
  }

  .filter-select {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .filters {
    flex-direction: column;
    gap: 10px;
  }

  .page-link {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .company-card {
    height: 220px;
  }

  .company-name {
    font-size: 0.9rem;
  }

  .detail-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

/* Additional enhancements */
/* Hover effects for logo */
.logo-container {
  transition: all 0.3s ease;
}

.company-card:hover .logo-container {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Ripple effect for buttons */
.apply-filter-btn,
.detail-button {
  position: relative;
  overflow: hidden;
}

.apply-filter-btn::after,
.detail-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 100%;
  transform: scale(0);
  opacity: 1;
  transition: 0.5s;
}

.apply-filter-btn:active::after,
.detail-button:active::after {
  transform: scale(20);
  opacity: 0;
}

/* Verified badge for verified companies */
.company-name[data-verified="true"]::after {
  content: "✓";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  margin-left: 8px;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
