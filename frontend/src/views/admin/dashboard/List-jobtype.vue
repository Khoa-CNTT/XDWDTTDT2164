<template>
  <div class="list-jobtype">
    <h2>Danh Sách Loại Công Việc</h2>
    <router-link to="/" class="mb-3 d-inline-block">
      Quay trở lại trang chủ?</router-link
    >
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between">
        <h5 class="title-header mt-2">Danh Sách Loại Công Việc</h5>
        <button
          class="btn btn-primary mt-2"
          data-bs-toggle="modal"
          data-bs-target="#add-modal"
          style="width: 150px; height: 40px"
          :disabled="categoryStore.isLoading"
        >
          Thêm mới
        </button>
      </div>
      <div class="card-body">
        <div v-if="categoryStore.isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div
          v-else-if="categoryStore.categories.length === 0"
          class="text-center"
        >
          Không có loại công việc nào.
        </div>
        <table v-else class="table table-bordered table-hover">
          <thead>
            <tr class="text-center align-middle">
              <th>STT</th>
              <th>Tên công việc</th>
              <th>Slug công việc</th>
              <th>Hình ảnh</th>
              <th>Trạng thái</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="text-center align-middle">
            <tr
              v-for="(jobType, index) in categoryStore.categories"
              :key="jobType.id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ jobType.categoryName }}</td>
              <td>{{ jobType.categorySlug || "N/A" }}</td>
              <td>
                <img
                  class="img-logo"
                  :src="getImageUrl(jobType.categoryImage)"
                  alt="logo-jobtype"
                  @error="handleImageError"
                />
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    jobType.deletedAt
                      ? 'bg-danger text-light'
                      : 'bg-success text-light',
                  ]"
                >
                  {{ jobType.deletedAt ? "Không hoạt động" : "Hoạt động" }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-success me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#update-modal"
                  @click="loadJobTypeForUpdate(jobType)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="btn btn-danger me-2"
                  @click="deleteJobType(jobType.id)"
                  :disabled="categoryStore.isLoading"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Thêm mới loại công việc
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="card">
            <div class="card-header">
              <h5>Thông tin loại công việc</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addNewJobType">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label"
                      >Tên loại công việc
                      <span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Công nghệ thông tin"
                      v-model="newJobType.categoryName"
                      :disabled="categoryStore.isLoading"
                    />
                    <div v-if="errors.categoryName" class="text-danger mt-1">
                      {{ errors.categoryName }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label"
                    >Hình ảnh <span class="text-danger">*</span></label
                  >
                  <div class="image-upload-container">
                    <div class="upload-actions mb-3">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="triggerFileInput"
                        :disabled="categoryStore.isLoading"
                      >
                        <i class="fas fa-image"></i> Chọn ảnh
                      </button>
                      <input
                        type="file"
                        ref="fileInput"
                        style="display: none"
                        @change="handleImageUpload"
                        accept="image/*"
                      />
                    </div>
                    <div class="image-preview">
                      <p>Hình ảnh hiển thị</p>
                      <div v-if="newJobType.imageUrl" class="preview-image">
                        <img :src="newJobType.imageUrl" alt="Preview" />
                      </div>
                      <div v-else class="empty-preview">
                        <i class="fas fa-image"></i>
                        <span>Chưa có hình ảnh</span>
                      </div>
                    </div>
                    <div v-if="errors.imageFile" class="text-danger mt-1">
                      {{ errors.imageFile }}
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    :disabled="categoryStore.isLoading"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="categoryStore.isLoading"
                  >
                    <span v-if="categoryStore.isLoading">
                      <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
                    </span>
                    <span v-else>Thêm mới</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Cập nhật loại công việc
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="card">
            <div class="card-header">
              <h5>Thông tin loại công việc</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateJobTypeDetails">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Tên loại công việc</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nhập tên công việc (không bắt buộc)"
                      v-model="updateJobType.categoryName"
                      :disabled="categoryStore.isLoading"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Hình ảnh (Không bắt buộc)</label>
                  <div class="image-upload-container">
                    <div class="upload-actions mb-3">
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="triggerFileInputUpdate"
                        :disabled="categoryStore.isLoading"
                      >
                        <i class="fas fa-image"></i> Chọn ảnh
                      </button>
                      <input
                        type="file"
                        ref="fileInputUpdate"
                        style="display: none"
                        @change="handleImageUploadUpdate"
                        accept="image/*"
                      />
                    </div>
                    <div class="image-preview">
                      <p>Hình ảnh hiển thị</p>
                      <div v-if="updateJobType.imageUrl" class="preview-image">
                        <img :src="updateJobType.imageUrl" alt="Preview" />
                      </div>
                      <div v-else class="empty-preview">
                        <i class="fas fa-image"></i>
                        <span>Chưa có hình ảnh</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    :disabled="categoryStore.isLoading"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="categoryStore.isLoading"
                  >
                    <span v-if="categoryStore.isLoading">
                      <i class="fas fa-spinner fa-spin me-2"></i>Đang cập
                      nhật...
                    </span>
                    <span v-else>Cập nhật</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCategoryStore } from "@stores/useCategoryStore";
import { toast } from "vue3-toastify";

export default {
  name: "ListJobType",
  setup() {
    const categoryStore = useCategoryStore();
    return { categoryStore };
  },
  data() {
    return {
      newJobType: {
        categoryName: "",
        imageUrl: null,
        imageFile: null,
      },
      updateJobType: {
        id: null,
        categoryName: "",
        imageUrl: null,
        imageFile: null,
      },
      errors: {
        categoryName: "",
        imageFile: "",
      },
      defaultImage: "https://via.placeholder.com/100",
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/150";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${imagePath}`;
    },
    async fetchJobTypes() {
      try {
        await this.categoryStore.fetchCategories();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại công việc:", error);
        toast.error("Không thể tải danh sách loại công việc!");
      }
    },

    // Xử lý thêm mới
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.errors.imageFile =
            "Kích thước hình ảnh không được vượt quá 5MB.";
          this.newJobType.imageFile = null;
          this.newJobType.imageUrl = null;
          return;
        }
        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
          this.errors.imageFile = "Chỉ hỗ trợ các định dạng .jpg, .png, .webp.";
          this.newJobType.imageFile = null;
          this.newJobType.imageUrl = null;
          return;
        }
        this.errors.imageFile = "";
        this.newJobType.imageFile = file;
        this.newJobType.imageUrl = URL.createObjectURL(file);
      }
    },
    validateNewJobType() {
      this.errors = { categoryName: "", imageFile: "" };
      let isValid = true;

      if (!this.newJobType.categoryName.trim()) {
        this.errors.categoryName = "Tên loại công việc không được để trống.";
        isValid = false;
      }

      if (!this.newJobType.imageFile) {
        this.errors.imageFile = "Vui lòng chọn một hình ảnh.";
        isValid = false;
      }

      return isValid;
    },
    async addNewJobType() {
      if (!this.validateNewJobType()) {
        return;
      }

      const formData = new FormData();
      formData.append("categoryName", this.newJobType.categoryName);
      formData.append("image", this.newJobType.imageFile);

      try {
        await this.categoryStore.addNewCategory(formData);
        this.resetForm();

        // Đóng modal với fallback nếu bootstrap không được định nghĩa
        const modalElement = document.getElementById("add-modal");
        if (typeof bootstrap !== "undefined" && modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            bootstrap.Modal.getOrCreateInstance(modalElement).hide();
          }
        } else {
          modalElement.classList.remove("show");
          modalElement.setAttribute("aria-hidden", "true");
          modalElement.removeAttribute("aria-modal");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) backdrop.remove();
        }
      } catch (error) {
        console.error("Lỗi khi thêm mới loại công việc:", error);
        toast.error("Lỗi khi thêm mới loại công việc. Vui lòng thử lại!");
      }
    },
    resetForm() {
      this.newJobType = {
        categoryName: "",
        imageUrl: null,
        imageFile: null,
      };
      this.errors = { categoryName: "", imageFile: "" };
    },

    // Xử lý cập nhật
    loadJobTypeForUpdate(jobType) {
      this.updateJobType = {
        id: jobType.id,
        categoryName: jobType.categoryName,
        imageUrl: this.getImageUrl(jobType.categoryImage),
        imageFile: null,
      };
    },
    triggerFileInputUpdate() {
      this.$refs.fileInputUpdate.click();
    },
    handleImageUploadUpdate(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước hình ảnh không được vượt quá 5MB.");
          this.updateJobType.imageFile = null;
          this.updateJobType.imageUrl = this.getImageUrl(
            this.updateJobType.imageUrl
          );
          return;
        }
        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
          toast.error("Chỉ hỗ trợ các định dạng .jpg, .png, .webp.");
          this.updateJobType.imageFile = null;
          this.updateJobType.imageUrl = this.getImageUrl(
            this.updateJobType.imageUrl
          );
          return;
        }
        this.updateJobType.imageFile = file;
        this.updateJobType.imageUrl = URL.createObjectURL(file);
      }
    },
    async updateJobTypeDetails() {
      const formData = new FormData();
      formData.append("categoryName", this.updateJobType.categoryName);
      if (this.updateJobType.imageFile) {
        formData.append("image", this.updateJobType.imageFile);
      }

      try {
        await this.categoryStore.updateCategory(
          this.updateJobType.id,
          formData
        );
        this.resetUpdateForm();

        // Đóng modal với fallback nếu bootstrap không được định nghĩa
        const modalElement = document.getElementById("update-modal");
        if (typeof bootstrap !== "undefined" && modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            bootstrap.Modal.getOrCreateInstance(modalElement).hide();
          }
        } else {
          modalElement.classList.remove("show");
          modalElement.setAttribute("aria-hidden", "true");
          modalElement.removeAttribute("aria-modal");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) backdrop.remove();
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật loại công việc:", error);
        toast.error("Lỗi khi cập nhật loại công việc. Vui lòng thử lại!");
      }
    },
    resetUpdateForm() {
      this.updateJobType = {
        id: null,
        categoryName: "",
        imageUrl: null,
        imageFile: null,
      };
    },

    // Xử lý xóa
    async deleteJobType(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa loại công việc này?")) {
        return;
      }
      try {
        await this.categoryStore.deleteCategory(id);
        toast.success("Xóa loại công việc thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa loại công việc:", error);
        toast.error("Lỗi khi xóa loại công việc. Vui lòng thử lại!");
      }
    },

    // Xử lý lỗi hình ảnh
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
  },
  mounted() {
    this.fetchJobTypes();
  },
};
</script>

<style scoped>
/* General container */
.list-jobtype {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 100vh;
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}

a.mb-3.d-inline-block {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

a.mb-3.d-inline-block:hover {
  color: #1e40af;
  transform: translateX(-3px);
}

a.mb-3.d-inline-block::before {
  content: "\f060";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Card */
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

/* Image in table */
.img-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.img-logo:hover {
  transform: scale(1.05);
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
  color: #065f46;
}

.badge.bg-danger {
  background: #fee2e2;
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
}

.text-center i {
  font-size: 1.5rem;
  color: #fff;
}

/* Modal */
.modal-dialog {
  max-width: 700px;
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: #f1f5f9;
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
  padding: 0;
}

.modal-footer {
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background: #6b7280;
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

/* Modal card */
.modal-body .card {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.modal-body .card-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 15px 20px;
}

.modal-body .card-header h5 {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 0;
}

.modal-body .card-body {
  padding: 20px;
}

/* Form */
.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.form-control {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

.form-control:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.text-danger {
  font-size: 0.85rem;
}

/* Image upload */
.image-upload-container {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
  transition: border-color 0.2s ease;
}

.image-upload-container:hover {
  border-color: #93c5fd;
}

.upload-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-outline-primary {
  border-color: #2563eb;
  color: #2563eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-outline-primary:disabled {
  border-color: #93c5fd;
  color: #93c5fd;
  cursor: not-allowed;
}

.image-preview {
  margin-top: 20px;
  text-align: center;
}

.image-preview p {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 15px;
  font-weight: 500;
}

.preview-image img {
  max-width: 100%;
  max-height: 180px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease;
}

.preview-image img:hover {
  transform: scale(1.02);
}

.empty-preview {
  padding: 30px;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-preview i {
  font-size: 2rem;
  color: #94a3b8;
}

.empty-preview span {
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .list-jobtype {
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
  }

  .table th,
  .table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .img-logo {
    width: 60px;
    height: 60px;
  }

  .modal-dialog {
    margin: 20px;
  }

  .modal-body .card-body {
    padding: 15px;
  }

  .upload-actions {
    flex-direction: column;
    align-items: center;
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

  .preview-image img {
    max-height: 150px;
  }

  .empty-preview {
    padding: 20px;
  }

  .empty-preview i {
    font-size: 1.5rem;
  }
}
</style>
