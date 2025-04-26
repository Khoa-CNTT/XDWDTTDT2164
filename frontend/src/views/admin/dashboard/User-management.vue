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
                  <button
                    class="btn btn-warning me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                    @click="selectUser(user)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn btn-danger" @click="blockUser(user.id)">
                    <i class="fa-solid fa-ban"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!userStore.users.length">
                <td colspan="7" class="text-center py-3">
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
    async blockUser(userId) {
      if (!confirm("Bạn có chắc muốn chặn người dùng này?")) return;
      try {
        await this.userStore.blockUser(userId);
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
/* General container */
.user-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc; /* Light background for depth */
  border-radius: 12px;
  min-height: 100vh;
  margin-top: 0; /* Remove default margin */
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b; /* Dark slate for contrast */
  margin-bottom: 15px;
}

.back-link {
  font-size: 0.95rem;
  color: #2563eb; /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: #1e40af; /* Darker blue on hover */
  transform: translateX(-3px); /* Subtle shift */
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background: #ffffff;
  margin-top: 20px;
  overflow: hidden;
}

.card-header {
  background: #eff6ff; /* Light blue header */
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.title-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Table */
.card-body {
  padding: 25px;
}

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
  border-color: #e2e8f0; /* Light border */
}

.table th {
  background: #f1f5f9; /* Light slate header */
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc; /* Subtle hover effect */
  transition: background 0.2s ease;
}

.table td {
  color: #334155; /* Dark slate text */
}

/* Badges */
.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.badge.bg-success {
  background: #d1fae5; /* Light green */
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2; /* Light red */
  color: #991b1b;
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-warning {
  background: #f59e0b; /* Amber */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-warning:hover {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(245, 158, 11, 0.2);
}

.btn-danger {
  background: #ef4444; /* Red */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

.btn-primary {
  background: #2563eb; /* Vibrant blue */
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background: #1e40af;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background: #6b7280; /* Gray */
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: #ffffff;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Pagination */
.pagination .page-link {
  border-radius: 8px;
  margin: 0 5px;
  color: #334155;
  font-size: 0.9rem;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.pagination .page-item.active .page-link {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.pagination .page-item.disabled .page-link {
  color: #9ca3af;
  background: #f8fafc;
  border-color: #e2e8f0;
}

.pagination .page-link:hover:not(.disabled) {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

/* Modal */
.modal-dialog {
  max-width: 700px; /* Wider for form layout */
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

.modal-header {
  background: #f1f5f9; /* Light slate */
  border-bottom: 1px solid #e2e8f0;
  padding: 15px 20px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
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
  padding: 20px;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
}

/* Form */
.modal-body label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
  display: block;
}

.form-control,
.form-select {
  border: 1px solid #d1d5db; /* Light gray */
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.form-control:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.row {
  margin-bottom: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .user-management {
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

  .modal-dialog {
    margin: 20px;
  }

  .modal-body {
    padding: 15px;
  }

  .row {
    flex-direction: column;
    gap: 15px;
  }

  .col-6,
  .col-12 {
    width: 100%; /* Full-width inputs on mobile */
  }
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .btn-warning,
  .btn-danger {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .pagination .page-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
