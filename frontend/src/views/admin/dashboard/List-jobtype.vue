<template>
  <div class="list-jobtype">
    <h2 class="mt-5">Danh Sách Loại Công Việc</h2>
    <router-link to="/" class="mb-3 d-inline-block"
      >Quay trở lại trang chủ?</router-link
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
                    jobType.deletedAt ? 'bg-danger' : 'bg-success',
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
              <form @submit.prevent>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Tên loại công việc</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Công nghệ thông tin"
                      v-model="newJobType.categoryName"
                      :disabled="categoryStore.isLoading"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Hình ảnh</label>
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
                  </div>
                </div>
              </form>
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
            type="button"
            class="btn btn-primary"
            @click="addNewJobType"
            :disabled="categoryStore.isLoading"
          >
            <span v-if="categoryStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang thêm...
            </span>
            <span v-else>Thêm mới</span>
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
              <form @submit.prevent>
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
              </form>
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
            type="button"
            class="btn btn-primary"
            @click="updateJobTypeDetails"
            :disabled="categoryStore.isLoading"
          >
            <span v-if="categoryStore.isLoading">
              <i class="fas fa-spinner fa-spin me-2"></i>Đang cập nhật...
            </span>
            <span v-else>Cập nhật</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCategoryStore } from "@stores/useCategoryStore";

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
      defaultImage: "https://via.placeholder.com/100", // Hình ảnh mặc định nếu ảnh lỗi
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có ảnh
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${imagePath}`;
    },
    async fetchJobTypes() {
      try {
        await this.categoryStore.fetchCategories();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại công việc:", error);
      }
    },

    // Xử lý thêm mới
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newJobType.imageFile = file;
        this.newJobType.imageUrl = URL.createObjectURL(file);
      }
    },
    async addNewJobType() {
      if (!this.newJobType.categoryName) {
        alert("Vui lòng nhập tên loại công việc");
        return;
      }
      if (!this.newJobType.imageFile) {
        alert("Vui lòng chọn hình ảnh");
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("categoryName", this.newJobType.categoryName);
      formData.append("image", this.newJobType.imageFile);
      try {
        await this.categoryStore.addNewCategory(formData);
        this.resetForm();

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("add-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi thêm mới loại công việc:", error);
      }
    },
    resetForm() {
      this.newJobType = {
        categoryName: "",
        imageUrl: null,
        imageFile: null,
      };
    },

    // Xử lý cập nhật
    loadJobTypeForUpdate(jobType) {
      this.updateJobType = {
        id: jobType.id,
        categoryName: jobType.categoryName,
        imageUrl: jobType.image,
        imageFile: null,
      };
    },
    triggerFileInputUpdate() {
      this.$refs.fileInputUpdate.click();
    },
    handleImageUploadUpdate(event) {
      const file = event.target.files[0];
      if (file) {
        this.updateJobType.imageFile = file;
        this.updateJobType.imageUrl = URL.createObjectURL(file);
      }
    },
    async updateJobTypeDetails() {
      // Tạo FormData để gửi dữ liệu
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

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("update-modal")
        );
        modal.hide();
      } catch (error) {
        console.error("Lỗi khi cập nhật loại công việc:", error);
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
      } catch (error) {
        console.error("Lỗi khi xóa loại công việc:", error);
      }
    },

    // Xử lý lỗi hình ảnh
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
  },
  mounted() {
    this.fetchJobTypes(); // Tải danh sách khi component được mount
  },
};
</script>

<style scoped>
.list-jobtype {
  padding: 20px;
}

.title-header {
  padding-top: 10px;
  padding-bottom: 10px;
}

.img-logo {
  width: 100px;
  white-space: nowrap;
}

/* Style cho card trong modal */
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

.image-upload-container {
  border: 1px dashed #ced4da;
  border-radius: 4px;
  padding: 15px;
}

.upload-actions {
  display: flex;
  gap: 10px;
}

.empty-preview {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #adb5bd;
  text-align: center;
}

.empty-preview i {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
}

.preview-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
}

.image-preview p {
  margin-bottom: 15px;
  color: #6c757d;
  text-align: center;
}

.btn:disabled {
  opacity: 0.65;
}
</style>
