<template>
  <div class="user-management mt-3">
    <h2>Danh Sách Người Dùng</h2>
    <router-link to="/" class="back-link">
      <i class="fas fa-arrow-left me-1"></i>Quay trở lại trang chủ
    </router-link>

    <!-- Thông báo lỗi -->
    <div v-if="userStore.error" class="alert alert-danger mt-3" role="alert">
      {{ userStore.error }}
    </div>

    <!-- Card bảng người dùng -->
    <div class="card mt-5">
      <div class="card-header">
        <h5 class="title-header">Danh Sách Người Dùng</h5>
      </div>
      <div class="card-body">
        <!-- Trạng thái tải -->
        <div v-if="userStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <!-- Bảng người dùng -->
        <div v-else class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Trạng thái khóa</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(user, index) in userStore.users" :key="user.id">
                <td>
                  {{
                    (userStore.currentPage - 1) * userStore.pageSize + index + 1
                  }}
                </td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phoneNumber }}</td>
                <td>{{ translateRole(user.role) }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      user.emailVerify
                        ? 'bg-success text-light'
                        : 'bg-danger text-light',
                    ]"
                  >
                    {{ user.emailVerify ? "Đã kích hoạt" : "Chưa kích hoạt" }}
                  </span>
                </td>
                <td>
                  <span
                    :class="[
                      'badge',
                      user.isBlocked
                        ? 'bg-danger text-light'
                        : 'bg-success text-light',
                    ]"
                  >
                    {{ user.isBlocked ? "Đã khóa" : "Đang hoạt động" }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-warning me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                    @click="selectUser(user)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    :class="[
                      'btn',
                      user.isBlocked ? 'btn-success' : 'btn-danger',
                    ]"
                    @click="blockUser(user.id, user.isBlocked)"
                  >
                    <i
                      :class="[
                        'fa-solid',
                        user.isBlocked ? 'fa-lock-open' : 'fa-ban',
                      ]"
                    ></i>
                    {{ user.isBlocked ? "Mở khóa" : "Khóa" }}
                  </button>
                </td>
              </tr>
              <tr v-if="!userStore.users.length">
                <td colspan="8" class="text-center py-3">
                  Không có người dùng nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <nav class="mt-4" v-if="userStore.totalPages > 1">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: userStore.currentPage === 1 }"
        >
          <button
            class="page-link"
            @click="fetchUsers(userStore.currentPage - 1, userStore.pageSize)"
          >
            Trước
          </button>
        </li>
        <li
          class="page-item"
          v-for="page in userStore.totalPages"
          :key="page"
          :class="{ active: userStore.currentPage === page }"
        >
          <button
            class="page-link"
            @click="fetchUsers(page, userStore.pageSize)"
          >
            {{ page }}
          </button>
        </li>
        <li
          class="page-item"
          :class="{ disabled: userStore.currentPage === userStore.totalPages }"
        >
          <button
            class="page-link"
            @click="fetchUsers(userStore.currentPage + 1, userStore.pageSize)"
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal cập nhật -->
    <div
      class="modal fade"
      id="update-modal"
      tabindex="-1"
      aria-labelledby="updateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="updateModalLabel">
              Cập nhật người dùng
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-12">
                <label>Tên người dùng</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedUser.fullName"
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <label>Số điện thoại</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedUser.phoneNumber"
                  disabled
                />
              </div>
              <div class="col-6">
                <label>Email</label>
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedUser.email"
                  disabled
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <label for="role" class="form-label">Quyền</label>
                <select
                  class="form-select"
                  id="role"
                  v-model="selectedUser.role"
                >
                  <option value="admin">Quản trị viên</option>
                  <option value="candidate">Ứng viên</option>
                  <option value="employer">Nhà tuyển dụng</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Đóng
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateUser"
              :disabled="isUpdating || !selectedUser"
            >
              <span
                v-if="isUpdating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@stores/useUserStore";

export default {
  name: "UserManagement",
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      selectedUser: {
        id: null,
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "candidate",
      },
      isUpdating: false,
    };
  },
  created() {
    this.userStore.fetchUsers(
      this.userStore.currentPage,
      this.userStore.pageSize
    );
  },
  methods: {
    translateRole(role) {
      const roleMap = {
        admin: "Quản trị viên",
        candidate: "Ứng viên",
        employer: "Nhà tuyển dụng",
      };
      return roleMap[role] || role;
    },
    selectUser(user) {
      this.selectedUser = {
        id: user.id,
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "candidate",
      };
    },
    async updateUser() {
      if (!this.selectedUser || !this.selectedUser.id) return;
      this.isUpdating = true;
      try {
        await this.userStore.updateUser(this.selectedUser.id, {
          fullName: this.selectedUser.fullName,
          role: this.selectedUser.role,
        });
        this.$nextTick(() => {
          const modal = document.getElementById("update-modal");
          const bsModal = bootstrap.Modal.getInstance(modal);
          bsModal.hide();
        });
      } catch (error) {
        // Error handled in store
      } finally {
        this.isUpdating = false;
      }
    },
    async blockUser(userId, isBlocked) {
      const action = isBlocked ? "mở khóa" : "khóa";
      if (!confirm(`Bạn có chắc muốn ${action} người dùng này?`)) return;
      try {
        // Gửi dữ liệu boolean: true để khóa, false để mở khóa
        const response = await this.userStore.setBlockUser(userId, !isBlocked);
        if (response.status === "success") {
          // Cập nhật lại danh sách người dùng
          await this.userStore.fetchUsers(
            this.userStore.currentPage,
            this.userStore.pageSize
          );
        }
      } catch (error) {
        // Error handled in store
      }
    },
    async fetchUsers(page, limit) {
      await this.userStore.fetchUsers(page, limit);
    },
  },
};
</script>

<style scoped>
/* General Container */
.user-management {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 1rem;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

/* Header */
h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  position: relative;
}

h2::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 5rem;
  height: 0.25rem;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  border-radius: 0.125rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.back-link:hover {
  color: #1d4ed8;
  background: #f1f5f9;
  transform: translateX(-0.25rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Alert */
.alert-danger {
  background: #fee2e2;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #991b1b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Card */
.card {
  border: none;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(90deg, #f1f5f9, #f8fafc);
  border-bottom: 1px solid #e5e7eb;
  padding: 1.25rem;
}

.title-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-body {
  padding: 1.5rem;
}

/* Table */
.table-responsive {
  overflow-x: auto;
  border-radius: 0.5rem;
}

.table {
  margin: 0;
  font-size: 0.875rem;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
}

.table th,
.table td {
  padding: 0.75rem;
  border-color: #e5e7eb;
  vertical-align: middle;
}

.table th {
  background: #f1f5f9;
  color: #4b5563;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.table td {
  color: #1f2937;
}

.table-hover tbody tr:hover {
  background: #f8fafc;
  transition: background 0.2s ease;
}

/* Badges */
.badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.bg-success {
  background: #d1fae5;
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2;
  color: #991b1b;
}

/* Buttons */
.btn {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-warning {
  background: #f59e0b;
  border: none;
  color: #ffffff;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
}

.btn-danger {
  background: #ef4444;
  border: none;
  color: #ffffff;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
}

.btn-success {
  background: #10b981;
  border: none;
  color: #ffffff;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-primary {
  background: #3b82f6;
  border: none;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #6b7280;
  border: none;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(107, 114, 128, 0.3);
}

/* Pagination */
.pagination {
  gap: 0.5rem;
}

.pagination .page-link {
  border-radius: 0.5rem;
  color: #1f2937;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.pagination .page-item.active .page-link {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.pagination .page-item.disabled .page-link {
  color: #9ca3af;
  background: #f8fafc;
  border-color: #e5e7eb;
}

.pagination .page-link:hover:not(.disabled) {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

/* Modal */
.modal-dialog {
  max-width: 720px;
}

.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: #f1f5f9;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

/* Form */
.modal-body label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control,
.form-select {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-control:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.row {
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .user-management {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .table th,
  .table td {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .btn {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .modal-dialog {
    margin: 1rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .row {
    flex-direction: column;
    gap: 1rem;
  }

  .col-6,
  .col-12 {
    width: 100%;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 1.5rem;
  }

  .table {
    font-size: 0.75rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .pagination .page-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
