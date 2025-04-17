<template>
  <div class="company-management">
    <h2>Danh Sách Công Ty</h2>
    <router-link to="/" class="mb-3 d-inline-block"
      >Quay trở lại trang chủ?</router-link
    >
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
              <tr
                v-for="(employer, index) in userStore.employers"
                :key="employer.id"
              >
                <td>
                  {{
                    (userStore.currentPage - 1) * userStore.pageSize + index + 1
                  }}
                </td>
                <td>{{ employer.companyTaxCode || "N/A" }}</td>
                <td>{{ employer.companyName || "N/A" }}</td>
                <td>{{ employer.phoneNumber || "N/A" }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      employer.deletedAt ? 'bg-danger' : 'bg-success',
                    ]"
                  >
                    {{ employer.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <span
                    :class="[
                      'badge',
                      employer.isApproved ? 'bg-success' : 'bg-warning',
                    ]"
                  >
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
              <li
                class="page-item"
                :class="{ disabled: userStore.currentPage === 1 }"
              >
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in userStore.totalPages"
                :key="page"
                class="page-item"
                :class="{ active: userStore.currentPage === page }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: userStore.currentPage === userStore.totalPages,
                }"
              >
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
.company-management {
  padding: 20px;
}

.title-header {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Style cho card */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: none;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px;
}

.card-header h5 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.card-body {
  padding: 20px;
}

/* Style cho phân trang */
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  cursor: pointer;
}

/* Style cho thông báo lỗi */
.text-danger {
  font-size: 0.875rem;
}
</style>
