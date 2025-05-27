<template>
  <div class="list-skills">
    <h2>Danh Sách Kỹ Năng</h2>
    <router-link to="/" class="mb-3 d-inline-block">
      Quay trở lại trang chủ?
    </router-link>
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Kỹ Năng</h5>
        <button
          class="btn btn-primary mt-2"
          data-bs-toggle="modal"
          data-bs-target="#add-modal"
          style="width: 150px; height: 40px"
          :disabled="skillStore.isLoading"
        >
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="skillStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-else-if="skillStore.skills.length === 0" class="text-center">
          Không có kỹ năng nào.
        </div>
        <div v-else>
          <table class="table table-bordered table-hover">
            <thead>
              <tr class="text-center align-middle">
                <th>STT</th>
                <th>Tên kỹ năng</th>
                <th>Mã code</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="(skill, index) in skillStore.skills" :key="skill.id">
                <td>
                  {{
                    (skillStore.currentPage - 1) * skillStore.pageSize +
                    index +
                    1
                  }}
                </td>
                <td>{{ skill.skillName }}</td>
                <td>{{ skill.skillSlug || "N/A" }}</td>
                <td>{{ skill.Categories?.categoryName || "N/A" }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      skill.deletedAt
                        ? 'bg-danger text-light'
                        : 'bg-success text-light',
                    ]"
                  >
                    {{ skill.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-success me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-modal"
                    @click="loadSkillForUpdate(skill)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn btn-danger me-2"
                    @click="deleteSkill(skill.id)"
                    :disabled="skillStore.isLoading"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <nav v-if="skillStore.totalPages > 1" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li
                class="page-item"
                :class="{ disabled: skillStore.currentPage === 1 }"
              >
                <button class="page-link" @click="previousPage">
                  Trang trước
                </button>
              </li>
              <li
                v-for="page in paginationRange"
                :key="page"
                class="page-item"
                :class="{
                  active: skillStore.currentPage === page,
                  disabled: page === '...',
                }"
              >
                <button
                  class="page-link"
                  @click="page !== '...' && goToPage(page)"
                >
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{
                  disabled: skillStore.currentPage === skillStore.totalPages,
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

  <!-- Modal thêm mới -->
  <div
    class="modal fade"
    id="add-modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Thêm mới kỹ năng
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên kỹ năng</label>
            <input
              type="text"
              class="form-control"
              v-model="newSkill.skillName"
              :disabled="skillStore.isLoading"
              @input="clearError('skillName')"
            />
            <small v-if="errors.skillName" class="text-danger">
              {{ errors.skillName }}
            </small>
          </div>
          <div class="mt-2">
            <label class="mb-2">Danh mục công việc</label>
            <select
              class="form-select"
              v-model="newSkill.categoryId"
              :disabled="skillStore.isLoading || categories.length === 0"
              @change="clearError('categoryId')"
            >
              <option value="" disabled>Chọn danh mục công việc</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <small v-if="errors.categoryId" class="text-danger">
              {{ errors.categoryId }}
            </small>
            <small v-if="categories.length === 0" class="text-danger">
              Không có danh mục công việc nào.
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="skillStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="addNewSkill"
            :disabled="skillStore.isLoading"
          >
            <span v-if="skillStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
            </span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal cập nhật -->
  <div
    class="modal fade"
    id="update-modal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Cập nhật kỹ năng
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <label class="mb-2">Tên kỹ năng</label>
            <input
              type="text"
              class="form-control"
              v-model="updateSkill.skillName"
              :disabled="skillStore.isLoading"
              @input="clearError('updateSkillName')"
            />
            <small v-if="errors.updateSkillName" class="text-danger">
              {{ errors.updateSkillName }}
            </small>
          </div>
          <div class="mt-2">
            <label class="mb-2">Danh mục công việc</label>
            <select
              class="form-select"
              v-model="updateSkill.categoryId"
              :disabled="skillStore.isLoading || categories.length === 0"
              @change="clearError('updateCategoryId')"
            >
              <option value="" disabled>Chọn danh mục công việc</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.categoryName }}
              </option>
            </select>
            <small v-if="errors.updateCategoryId" class="text-danger">
              {{ errors.updateCategoryId }}
            </small>
            <small v-if="categories.length === 0" class="text-danger">
              Không có danh mục công việc nào.
            </small>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            :disabled="skillStore.isLoading"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateSkillDetails"
            :disabled="skillStore.isLoading"
          >
            <span v-if="skillStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang cập nhật...
            </span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSkillStore } from "@stores/useSkillStore";
import { useCategoryStore } from "@stores/useCategoryStore";
import { toast } from "vue3-toastify";

export default {
  name: "ListSkills",
  setup() {
    const categoryStore = useCategoryStore();
    const skillStore = useSkillStore();
    return { skillStore, categoryStore };
  },
  data() {
    return {
      newSkill: {
        skillName: "",
        categoryId: "",
      },
      updateSkill: {
        id: null,
        skillName: "",
        categoryId: "",
      },
      categories: [],
      errors: {
        skillName: "",
        categoryId: "",
        updateSkillName: "",
        updateCategoryId: "",
      },
    };
  },
  computed: {
    paginationRange() {
      const total = this.skillStore.totalPages;
      const current = this.skillStore.currentPage;
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);
      if (total <= 1) return range;

      for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
      ) {
        range.push(i);
      }

      if (total > 1) range.push(total);

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
  },
  methods: {
    async fetchCategories() {
      try {
        await this.categoryStore.fetchCategories();
        this.categories = this.categoryStore.categories;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        this.categories = [];
        toast.error("Lỗi khi lấy danh sách danh mục!");
      }
    },

    async fetchSkills(page = 1) {
      try {
        await this.skillStore.fetchSkills(page, this.skillStore.pageSize);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kỹ năng:", error);
        toast.error("Lỗi khi lấy danh sách kỹ năng!");
      }
    },

    previousPage() {
      if (this.skillStore.currentPage > 1) {
        this.fetchSkills(this.skillStore.currentPage - 1);
      }
    },

    nextPage() {
      if (this.skillStore.currentPage < this.skillStore.totalPages) {
        this.fetchSkills(this.skillStore.currentPage + 1);
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.skillStore.totalPages) {
        this.fetchSkills(page);
      }
    },

    validateNewSkill() {
      this.clearErrors();
      let isValid = true;

      if (!this.newSkill.skillName.trim()) {
        this.errors.skillName = "Tên kỹ năng không được để trống.";
        isValid = false;
      }

      if (!this.newSkill.categoryId) {
        this.errors.categoryId = "Vui lòng chọn danh mục công việc.";
        isValid = false;
      }

      return isValid;
    },

    clearError(field) {
      this.errors[field] = "";
    },

    clearErrors() {
      this.errors = {
        skillName: "",
        categoryId: "",
        updateSkillName: "",
        updateCategoryId: "",
      };
    },

    async addNewSkill() {
      if (!this.validateNewSkill()) return;

      const skillData = {
        skillName: this.newSkill.skillName,
        categoryId: this.newSkill.categoryId,
      };

      try {
        await this.skillStore.addNewSkill(skillData);
        this.resetForm();
        await this.fetchSkills(this.skillStore.currentPage); // Tải lại trang hiện tại

        const modalElement = document.getElementById("add-modal");
        if (modalElement) {
          const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            bootstrap.Modal.getOrCreateInstance(modalElement);
          modal.hide();
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới kỹ năng:", error);
      }
    },

    resetForm() {
      this.newSkill = { skillName: "", categoryId: "" };
      this.clearErrors();
    },

    validateUpdateSkill() {
      this.clearErrors();
      let isValid = true;

      if (!this.updateSkill.skillName.trim()) {
        this.errors.updateSkillName = "Tên kỹ năng không được để trống.";
        isValid = false;
      }

      if (!this.updateSkill.categoryId) {
        this.errors.updateCategoryId = "Vui lòng chọn danh mục công việc.";
        isValid = false;
      }

      return isValid;
    },

    async updateSkillDetails() {
      if (!this.validateUpdateSkill()) return;

      const skillData = {
        skillName: this.updateSkill.skillName,
        categoryId: this.updateSkill.categoryId,
      };

      try {
        await this.skillStore.updateSkill(this.updateSkill.id, skillData);
        this.resetUpdateForm();
        await this.fetchSkills(this.skillStore.currentPage); // Tải lại trang hiện tại

        const modalElement = document.getElementById("update-modal");
        if (modalElement) {
          const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            bootstrap.Modal.getOrCreateInstance(modalElement);
          modal.hide();
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật kỹ năng:", error);
        toast.error("Lỗi khi cập nhật kỹ năng!");
      }
    },

    resetUpdateForm() {
      this.updateSkill = { id: null, skillName: "", categoryId: "" };
      this.clearErrors();
    },

    loadSkillForUpdate(skill) {
      this.updateSkill = {
        id: skill.id,
        skillName: skill.skillName || "",
        categoryId: skill.categoryId || "",
      };
    },

    async deleteSkill(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) return;

      try {
        await this.skillStore.deleteSkill(id);
        // Nếu danh sách rỗng sau khi xóa, chuyển về trang trước hoặc trang 1
        if (
          this.skillStore.skills.length === 1 &&
          this.skillStore.currentPage > 1
        ) {
          await this.fetchSkills(this.skillStore.currentPage - 1);
        } else {
          await this.fetchSkills(this.skillStore.currentPage);
        }
      } catch (error) {
        console.error("Lỗi khi xóa kỹ năng:", error);
        toast.error("Lỗi khi xóa kỹ năng!");
      }
    },
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchSkills();
  },
};
</script>

<style scoped>
/* General container */
.list-skills {
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

a.mb-3.d-inline-block {
  font-size: 0.95rem;
  color: #2563eb;
  /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

a.mb-3.d-inline-block:hover {
  color: #1e40af;
  /* Darker blue on hover */
  transform: translateX(-3px);
  /* Subtle shift */
}

a.mb-3.d-inline-block::before {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #2563eb;
  /* Vibrant blue */
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background: #1e40af;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(37, 99, 235, 0.2);
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.btn-success {
  background: #10b981;
  /* Green */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.2);
}

.btn-danger {
  background: #ef4444;
  /* Red */
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

.btn-danger:disabled {
  background: #fca5a5;
  cursor: not-allowed;
}

/* Loading and empty states */
.text-center {
  padding: 30px;
  color: #64748b;
  /* Muted slate */
}

.text-center i {
  font-size: 1.5rem;
  color: #fff;
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

/* Modal */
.modal-dialog {
  max-width: 500px;
  /* Compact for skill forms */
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  /* Stronger shadow */
}

.modal-header {
  background: #f1f5f9;
  /* Light slate */
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

.btn-secondary {
  background: #6b7280;
  /* Gray */
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: #ffffff;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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
  border: 1px solid #d1d5db;
  /* Light gray */
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

.form-control:disabled,
.form-select:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.text-danger {
  font-size: 0.85rem;
  color: #dc2626;
  /* Bright red */
  margin-top: 5px;
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .list-skills {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .btn-primary {
    width: 100%;
    /* Full-width button on mobile */
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
}

@media (max-width: 576px) {
  .table {
    font-size: 0.85rem;
  }

  .btn-success,
  .btn-danger {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }

  .page-link {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
