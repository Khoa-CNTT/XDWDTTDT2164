<template>
  <div class="company-management">
    <h2>Danh Sách Công Ty</h2>
    <router-link to="/" class="mb-3 d-inline-block"> Quay trở lại trang chủ?</router-link>
    <div class="card mt-5">
      <div class="card-header">
        <h5 class="title-header">Danh Sách Công Ty</h5>
      </div>
      <div class="card-body">
        <!-- Trạng thái loading -->
        <div v-if="userStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách công ty...
        </div>
        <!-- Trạng thái lỗi -->
        <div v-else-if="userStore.error" class="text-center text-danger">
          {{ userStore.error }}
        </div>
        <!-- Không có công ty -->
        <div v-else-if="userStore.employers.length === 0" class="text-center">
          Không có công ty nào.
        </div>
        <!-- Hiển thị danh sách công ty -->
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Mã công ty</th>
                <th>Tên công ty</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Kiểm duyệt</th>
                <th>Ngày khởi tạo</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(employer, index) in userStore.employers" :key="employer.id">
                <td>
                  {{
                    (userStore.currentPage - 1) * userStore.pageSize + index + 1
                  }}
                </td>
                <td>{{ employer.companyTaxCode || "N/A" }}</td>
                <td>{{ employer.companyName || "N/A" }}</td>
                <td>{{ employer.phoneNumber || "N/A" }}</td>
                <td>
                  <span :class="[
                    'badge',
                    employer.deletedAt ? 'bg-danger text-light' : 'bg-success text-light',
                  ]">
                    {{ employer.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <span :class="[
                    'badge',
                    employer.isApproved ? 'bg-success' : 'bg-warning',
                  ]">
                    {{
                      employer.isApproved ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"
                    }}
                  </span>
                </td>
                <td>{{ formatDate(employer.createdAt) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="userStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: userStore.currentPage === 1 }">
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li v-for="page in userStore.totalPages" :key="page" class="page-item"
                :class="{ active: userStore.currentPage === page }">
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{
                disabled: userStore.currentPage === userStore.totalPages,
              }">
                <button class="page-link" @click="nextPage">Trang sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@stores/useUserStore";

export default {
  name: "CompanyManagement",
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  methods: {
    async fetchEmployers(page = 1) {
      try {
        await this.userStore.fetchEmployers(page, this.userStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà tuyển dụng:", error);
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
    previousPage() {
      if (this.userStore.currentPage > 1) {
        this.fetchEmployers(this.userStore.currentPage - 1);
      }
    },
    nextPage() {
      if (this.userStore.currentPage < this.userStore.totalPages) {
        this.fetchEmployers(this.userStore.currentPage + 1);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.userStore.totalPages) {
        this.fetchEmployers(page);
      }
    },
  },
  mounted() {
    this.fetchEmployers(); // Gọi API khi component được mount
  },
};
</script>

<style scoped>
/* General container */
.company-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc;
  /* Light background for depth */
  border-radius: 12px;
  min-height: 100vh;
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  /* Dark slate for contrast */
  margin-bottom: 15px;
}

.mb-3.d-inline-block {
  font-size: 0.95rem;
  color: #2563eb;
  /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.mb-3.d-inline-block:hover {
  color: #1e40af;
  /* Darker blue on hover */
  transform: translateX(-3px);
  /* Subtle shift */
}

.mb-3.d-inline-block::before {
  content: "\f060";
  /* Font Awesome arrow-left */
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  /* Soft shadow */
  background: #ffffff;
  margin-top: 20px;
  overflow: hidden;
}

.card-header {
  background: #eff6ff;
  /* Light blue header */
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.title-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Card body */
.card-body {
  padding: 25px;
}

/* Loading and empty states */
.text-center {
  padding: 30px;
  color: #64748b;
  /* Muted slate */
}

.text-center i {
  font-size: 1.5rem;
  color: #2563eb;
}

.text-danger {
  font-size: 0.95rem;
  color: #dc2626;
  /* Bright red */
  padding: 30px;
}

/* Table */
.table-responsive {
  overflow-x: auto;
}

.table {
  margin-bottom: 0;
  font-size: 0.95rem;
  border-collapse: separate;
  border-spacing: 0;
}

.table th,
.table td {
  vertical-align: middle;
  padding: 12px 15px;
  border-color: #e2e8f0;
  /* Light border */
}

.table th {
  background: #f1f5f9;
  /* Light slate header */
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc;
  /* Subtle hover effect */
  transition: background 0.2s ease;
}

.table td {
  color: #334155;
  /* Dark slate text */
}

/* Badges */
.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.badge.bg-success {
  background: #d1fae5;
  /* Light green */
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2;
  /* Light red */
  color: #991b1b;
}

.badge.bg-warning {
  background: #fef3c7;
  /* Light yellow */
  color: #92400e;
}

/* Pagination */
.pagination {
  margin-top: 30px;
}

.page-item .page-link {
  border-radius: 8px;
  margin: 0 5px;
  padding: 8px 14px;
  font-size: 0.9rem;
  color: #475569;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.page-item.active .page-link {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.page-item:not(.disabled) .page-link:hover {
  background: #dbeafe;
  border-color: #2563eb;
  color: #2563eb;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .company-management {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 15px;
  }

  .table th,
  .table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .text-center,
  .text-danger {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .badge {
    font-size: 0.8rem;
    padding: 5px 10px;
  }

  .page-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }
}
</style>
