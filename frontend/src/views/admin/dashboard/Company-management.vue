<template>
  <div class="company-management">
    <h2>Danh Sách Công Ty</h2>
    <router-link to="/" class="mb-3 d-inline-block">
      Quay trở lại trang chủ?
    </router-link>
    <div class="card mt-5">
      <div class="card-header">
        <h5 class="title-header">Danh Sách Công Ty</h5>
      </div>
      <div class="card-body">
        <!-- Loading state -->
        <div v-if="userStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách công ty...
        </div>
        <!-- Error state -->
        <div v-else-if="userStore.error" class="text-center text-danger">
          {{ userStore.error }}
        </div>
        <!-- Empty state -->
        <div v-else-if="userStore.employers.length === 0" class="text-center">
          Không có công ty nào.
        </div>
        <!-- Company list -->
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Mã công ty</th>
                <th>Tên công ty</th>
                <th>Trạng thái</th>
                <th>Kiểm duyệt</th>
                <th>Ngày khởi tạo</th>
                <th>Thao tác</th>
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
                <td>
                  <span
                    :class="[
                      'badge',
                      employer.deletedAt
                        ? 'bg-danger text-light'
                        : 'bg-success text-light',
                    ]"
                  >
                    {{ employer.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <span
                    style="color: white"
                    :class="[
                      'badge',
                      {
                        'bg-success': employer.isApproved === 'Đã kiểm duyệt',
                        'bg-danger': employer.isApproved === 'Đã từ chối',
                        'bg-warning': employer.isApproved === 'Chờ kiểm duyệt',
                      },
                    ]"
                  >
                    {{ employer.isApproved }}
                  </span>
                </td>
                <td>{{ formatDate(employer.createdAt) }}</td>
                <td>
                  <!-- Action buttons for pending approval -->
                  <div
                    v-if="employer.isApproved === 'Chờ kiểm duyệt'"
                    class="action-buttons"
                  >
                    <button
                      @click="approveCompany(employer.id)"
                      class="btn btn-sm btn-success me-2"
                      :disabled="isProcessing"
                    >
                      <i class="fas fa-check me-1"></i> Duyệt
                    </button>
                    <button
                      @click="rejectCompany(employer.id)"
                      class="btn btn-sm btn-danger"
                      :disabled="isProcessing"
                    >
                      <i class="fas fa-times me-1"></i> Từ chối
                    </button>
                  </div>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav
            v-if="userStore.totalItems >= 8 && userStore.totalPages > 1"
            aria-label="Page navigation"
          >
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: userStore.currentPage === 1 }"
              >
                <button class="page-link" @click="goToPage(1)">Đầu</button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: userStore.currentPage === 1 }"
              >
                <button class="page-link" @click="previousPage">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li
                v-for="page in paginationPages"
                :key="page"
                class="page-item"
                :class="{
                  active: userStore.currentPage === page,
                  disabled: page === '...',
                }"
              >
                <button
                  v-if="page !== '...'"
                  class="page-link"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span v-else class="page-link">...</span>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: userStore.currentPage === userStore.totalPages,
                }"
              >
                <button class="page-link" @click="nextPage">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: userStore.currentPage === userStore.totalPages,
                }"
              >
                <button
                  class="page-link"
                  @click="goToPage(userStore.totalPages)"
                >
                  Cuối
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
      ref="confirmModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalLabel">{{ modalTitle }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn"
              :class="modalActionBtnClass"
              @click="confirmAction"
            >
              {{ modalActionBtnText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@stores/useUserStore";
import { ref, computed } from "vue";
import { Modal } from "bootstrap";
import { toast } from "vue3-toastify";

export default {
  name: "CompanyManagement",
  setup() {
    const userStore = useUserStore();
    const isProcessing = ref(false);
    const confirmModal = ref(null);
    const modalTitle = ref("");
    const modalMessage = ref("");
    const modalActionBtnText = ref("");
    const modalActionBtnClass = ref("");
    const pendingAction = ref(null);
    const pendingCompanyId = ref(null);

    return {
      userStore,
      isProcessing,
      confirmModal,
      modalTitle,
      modalMessage,
      modalActionBtnText,
      modalActionBtnClass,
      pendingAction,
      pendingCompanyId,
    };
  },
  computed: {
    paginationPages() {
      const currentPage = this.userStore.currentPage;
      const totalPages = this.userStore.totalPages;
      const maxPagesToShow = 5;
      const pages = [];

      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        let startPage = Math.max(
          2,
          currentPage - Math.floor(maxPagesToShow / 2)
        );
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 2);

        if (endPage >= totalPages - 1) {
          startPage = Math.max(2, totalPages - maxPagesToShow + 2);
          endPage = totalPages - 1;
        }

        if (startPage > 2) {
          pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < totalPages - 1) {
          pages.push("...");
        }

        pages.push(totalPages);
      }

      return pages;
    },
  },
  methods: {
    async fetchEmployers(page = 1) {
      try {
        await this.userStore.fetchEmployers(page, this.userStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công ty:", error);
        toast.error("Lỗi khi tải danh sách công ty!");
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      try {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      } catch {
        return "N/A";
      }
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
      if (
        page >= 1 &&
        page <= this.userStore.totalPages &&
        page !== this.userStore.currentPage
      ) {
        this.fetchEmployers(page);
      }
    },
    approveCompany(companyId) {
      this.modalTitle = "Xác nhận duyệt";
      this.modalMessage = "Bạn có chắc chắn muốn duyệt công ty này?";
      this.modalActionBtnText = "Duyệt";
      this.modalActionBtnClass = "btn-success";
      this.pendingAction = "Đã kiểm duyệt";
      this.pendingCompanyId = companyId;

      const modal = new Modal(this.confirmModal);
      modal.show();
    },
    rejectCompany(companyId) {
      this.modalTitle = "Xác nhận từ chối";
      this.modalMessage = "Bạn có chắc chắn muốn từ chối công ty này?";
      this.modalActionBtnText = "Từ chối";
      this.modalActionBtnClass = "btn-danger";
      this.pendingAction = "Đã từ chối";
      this.pendingCompanyId = companyId;

      const modal = new Modal(this.confirmModal);
      modal.show();
    },
    async confirmAction() {
      if (!this.pendingAction || !this.pendingCompanyId) {
        toast.error("Không xác định được hành động hoặc ID công ty.");
        return;
      }

      this.isProcessing = true;

      try {
        const data =
          this.pendingAction === "Đã kiểm duyệt"
            ? { status: true }
            : { status: false };

        const response = await this.userStore.approveEmployer(
          this.pendingCompanyId,
          data
        );

        if (response && response.status === "success") {
          toast.success(
            `Công ty đã được ${
              this.pendingAction === "Đã kiểm duyệt" ? "duyệt" : "từ chối"
            } thành công!`
          );
          await this.fetchEmployers(this.userStore.currentPage);
        } else {
          throw new Error("Phản hồi từ API không hợp lệ");
        }

        const modal = Modal.getInstance(this.confirmModal);
        modal.hide();
      } catch (error) {
        console.error(
          `Lỗi khi ${
            this.pendingAction === "Đã kiểm duyệt" ? "duyệt" : "từ chối"
          } công ty:`,
          error
        );
        toast.error(`Lỗi: ${error.message || "Không thể xử lý yêu cầu"}`);
      } finally {
        this.isProcessing = false;
      }
    },
  },
  mounted() {
    this.fetchEmployers();
  },
};
</script>

<style scoped>
.company-management {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 100vh;
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}

.mb-3.d-inline-block {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.mb-3.d-inline-block:hover {
  color: #1e40af;
  transform: translateX(-3px);
}

.mb-3.d-inline-block::before {
  content: "\f060";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  margin-top: 20px;
  overflow: hidden;
}

.card-header {
  background: #eff6ff;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.title-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 25px;
}

.text-center {
  padding: 30px;
  color: #64748b;
}

.text-center i {
  font-size: 1.5rem;
  color: #2563eb;
}

.text-danger {
  font-size: 0.95rem;
  color: #dc2626;
  padding: 30px;
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
  border-color: #e2e8f0;
}

.table th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table-hover tbody tr:hover {
  background: #f8fafc;
  transition: background 0.2s ease;
}

.table td {
  color: #334155;
}

.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 12px;
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

.badge.bg-warning {
  background: #fef3c7;
  color: #92400e;
}

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
  min-width: 40px;
  text-align: center;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.btn-sm {
  font-size: 0.85rem;
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-success {
  background: #10b981;
  border-color: #10b981;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
}

.btn-danger {
  background: #ef4444;
  border-color: #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .me-2 {
    margin-right: 0 !important;
    margin-bottom: 8px;
  }
}

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
