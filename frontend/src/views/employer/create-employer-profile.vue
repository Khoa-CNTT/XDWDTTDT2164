<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="mb-0">Thêm mới hồ sơ công ty</h2>
    </div>

    <!-- Success message -->
    <div v-if="showSuccess" class="alert alert-success">
      <i class="fas fa-check-circle me-2"></i>Hồ sơ công ty đã được tạo thành
      công!
    </div>

    <!-- Error message -->
    <div v-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
    </div>

    <!-- Form thêm mới hồ sơ -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h5 class="form-title">Thông tin công ty</h5>

        <div class="upload-container mb-4">
          <div class="upload-section">
            <div class="logo-upload-area" @click="$refs.uploadImage.click()">
              <div class="logo-display">
                <img
                  v-if="previewLogo"
                  :src="previewLogo"
                  alt="Company Logo"
                  class="logo-preview"
                />
                <div v-else class="upload-placeholder">
                  <i class="fas fa-building fa-2x icon-building"></i>
                  <i class="fas fa-plus icon-plus"></i>
                  <span class="upload-text">Thêm logo công ty</span>
                </div>
              </div>
            </div>
            <input
              type="file"
              id="uploadImage"
              ref="uploadImage"
              class="d-none"
              accept=".jpg,.png,.webp"
              @change="previewImage"
            />
          </div>

          <div class="upload-info">
            <p class="upload-instructions">
              <i class="fas fa-info-circle me-2"></i>
              Tải lên logo công ty để tạo ấn tượng tốt với ứng viên
            </p>
            <small class="upload-requirements">
              Kích thước tệp tối đa là 1MB, Kích thước tối thiểu: 330x300 và các
              tệp phù hợp: .jpg & .png
            </small>
          </div>
        </div>

        <form @submit.prevent="saveProfile">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-building me-2 text-primary"></i>Tên công ty
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên công ty"
                  v-model="form.companyName"
                  required
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-id-card me-2 text-primary"></i>Mã số thuế
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập mã số thuế"
                  v-model="form.companyTaxCode"
                  required
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-phone me-2 text-primary"></i>Số điện thoại
                  <span class="required">*</span>
                </label>
                <input
                  type="tel"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                  v-model="form.phone"
                  required
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-globe me-2 text-primary"></i>Website
                </label>
                <input
                  type="url"
                  class="form-control"
                  placeholder="https://example.com"
                  v-model="form.website"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-users me-2 text-primary"></i>Quy mô công ty
                </label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="Nhập vào quy mô công ty"
                  v-model="form.companySize"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-industry me-2 text-primary"></i>Lĩnh vực hoạt
                  động
                  <span class="required">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="form.companyIndustry"
                  required
                  :disabled="categoryStore.isLoading"
                >
                  <option value="" disabled selected>Chọn lĩnh vực</option>
                  <option
                    v-for="category in categoryStore.categories"
                    :key="category.id"
                    :value="category.categoryName"
                  >
                    {{ category.categoryName }}
                  </option>
                </select>
                <small v-if="categoryStore.error" class="text-danger">
                  {{ categoryStore.error }}
                </small>
                <div v-if="categoryStore.isLoading" class="text-muted mt-1">
                  <i class="fas fa-spinner fa-spin me-1"></i> Đang tải danh sách
                  lĩnh vực...
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-map-marker-alt me-2 text-primary"></i>Thành
                  phố
                </label>
                <select class="form-select" v-model="form.companyCity">
                  <option value="" disabled selected>Chọn thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Huế">Huế</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-align-left me-2 text-primary"></i>Mô tả công
                  ty
                  <span class="required">*</span>
                </label>
                <textarea
                  class="form-control"
                  rows="5"
                  placeholder="Mô tả về lịch sử, sứ mệnh, tầm nhìn và văn hóa công ty của bạn"
                  v-model="form.companyDescription"
                  required
                ></textarea>
                <div class="description-hint">
                  Mô tả chi tiết sẽ giúp ứng viên hiểu rõ hơn về công ty của bạn
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-map-marked-alt me-2 text-primary"></i>Địa chỉ
                  đầy đủ
                  <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện"
                  v-model="form.companyAddress"
                  required
                />
              </div>
            </div>

            <div class="col-12">
              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-outline-secondary me-3"
                  @click="cancel"
                >
                  <i class="fas fa-times me-2"></i>Hủy bỏ
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="
                    isLoading ||
                    !authStore.isAuthenticated ||
                    categoryStore.isLoading
                  "
                >
                  <i class="fas fa-plus-circle me-2"></i>
                  {{ isLoading ? "Đang lưu..." : "Tạo hồ sơ công ty" }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="text-center mt-4">
      <small class="text-muted">© 2025 NLM - Trường Đại Học Duy Tân</small>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/useAuthStore";
import { useCategoryStore } from "@/stores/useCategoryStore"; // Import useCategoryStore
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { createEmployerProfile } from "@/apis/user";

export default {
  name: "EmployerProfileCreate",
  setup() {
    const authStore = useAuthStore();
    const categoryStore = useCategoryStore(); // Khởi tạo categoryStore
    const router = useRouter();

    return {
      authStore,
      categoryStore,
      router,
    };
  },
  data() {
    return {
      error: null,
      showSuccess: false,
      isLoading: false,
      previewLogo: null,
      form: {
        companyName: "",
        companyTaxCode: "",
        phone: "",
        website: "",
        companySize: "",
        companyIndustry: "",
        companyCity: "",
        companyDescription: "",
        companyAddress: "",
        companyLogo: null,
      },
    };
  },
  async mounted() {
    // Kiểm tra nếu đã có hồ sơ
    if (
      this.authStore.isAuthenticated &&
      this.authStore.user?.Employers &&
      Object.keys(this.authStore.user.Employers).length > 0
    ) {
      toast.info(
        "Bạn đã có hồ sơ nhà tuyển dụng. Vui lòng chỉnh sửa hồ sơ hiện tại."
      );
      this.router.push("/employer-dashboard/employer-info");
    }

    // Gọi API lấy danh sách category
    await this.categoryStore.fetchCategories();
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        this.error = "Kích thước file vượt quá 1MB";
        return;
      }

      // Check file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        this.error = "Chỉ chấp nhận file .jpg, .png hoặc .webp";
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          this.error = `Kích thước ảnh quá nhỏ (${img.width}x${img.height}). Tối thiểu là 100x100.`;
          URL.revokeObjectURL(img.src);
          return;
        }

        this.error = null;
        this.form.companyLogo = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewLogo = e.target.result;
        };
        reader.readAsDataURL(file);
      };
    },
    validateForm() {
      this.error = null;

      if (!this.authStore.isAuthenticated) {
        this.error = "Vui lòng đăng nhập để tạo hồ sơ";
        return false;
      }

      if (
        this.authStore.user?.employer &&
        Object.keys(this.authStore.user.employer).length > 0
      ) {
        this.error =
          "Bạn đã có hồ sơ nhà tuyển dụng. Vui lòng chỉnh sửa hồ sơ hiện tại.";
        this.router.push("/employer-management");
        return false;
      }

      if (!this.form.companyName) {
        this.error = "Vui lòng nhập tên công ty";
        return false;
      }

      if (!this.form.companyTaxCode) {
        this.error = "Vui lòng nhập mã số thuế";
        return false;
      }

      if (!this.form.phone) {
        this.error = "Vui lòng nhập số điện thoại";
        return false;
      } else if (!/^\d{10,11}$/.test(this.form.phone)) {
        this.error = "Số điện thoại không hợp lệ";
        return false;
      }

      if (!this.form.companyIndustry) {
        this.error = "Vui lòng chọn lĩnh vực hoạt động";
        return false;
      }

      if (!this.form.companyDescription) {
        this.error = "Vui lòng nhập mô tả công ty";
        return false;
      }

      if (!this.form.companyAddress) {
        this.error = "Vui lòng nhập địa chỉ công ty";
        return false;
      }

      if (!this.form.companyLogo) {
        this.error = "Vui lòng tải lên logo công ty";
        return false;
      }

      return true;
    },
    async saveProfile() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      this.error = null;

      const formData = new FormData();
      formData.append("companyName", this.form.companyName);
      formData.append("companyTaxCode", this.form.companyTaxCode);
      formData.append("phone", this.form.phone);
      formData.append("companyWebsite", this.form.website || "");
      formData.append("companySize", this.form.companySize || "");
      formData.append("industry", this.form.companyIndustry || "");
      formData.append("companyCity", this.form.companyCity || "");
      formData.append("companyDescription", this.form.companyDescription);
      formData.append("companyAddress", this.form.companyAddress);
      if (this.form.companyLogo) {
        formData.append("avatar", this.form.companyLogo);
      }

      try {
        const response = await createEmployerProfile(formData);
        this.showSuccess = true;

        // Reset form and redirect after 3 seconds
        setTimeout(() => {
          this.showSuccess = false;
          this.form = {
            companyName: "",
            companyTaxCode: "",
            phone: "",
            website: "",
            companySize: "",
            companyIndustry: "",
            companyCity: "",
            companyDescription: "",
            companyAddress: "",
            companyLogo: null,
          };
          this.previewLogo = null;
          toast.success("Hồ sơ công ty đã được tạo thành công!");
          this.router.push("/employer-dashboard/employer-info");
        }, 3000);
      } catch (err) {
        this.error =
          err.response?.data?.message || "Đã xảy ra lỗi khi tạo hồ sơ";
        console.error("Error creating employer profile:", err);
      } finally {
        this.isLoading = false;
      }
    },
    cancel() {
      this.form = {
        companyName: "",
        companyTaxCode: "",
        phone: "",
        website: "",
        companySize: "",
        companyIndustry: "",
        companyCity: "",
        companyDescription: "",
        companyAddress: "",
        companyLogo: null,
      };
      this.previewLogo = null;
      this.error = null;
      this.router.push("/employer-management");
    },
  },
};
</script>
<style scoped>
/* Container chính */
.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: "Roboto", sans-serif;
}

/* Card chứa form */
.card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

/* Tiêu đề */
h2.mb-0 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
}

h2.mb-0::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #0d6efd, #0dcaf0);
  border-radius: 2px;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  display: block;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

/* Upload section */
.upload-container {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.upload-section {
  flex-shrink: 0;
}

.logo-upload-area {
  width: 150px;
  height: 150px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo-upload-area:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.logo-display {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  position: relative;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  color: #0d6efd;
}

.icon-building {
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.logo-upload-area:hover .icon-building {
  transform: scale(1.1);
}

.icon-plus {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #0d6efd;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 2px solid white;
}

.upload-text {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: center;
  padding: 0 10px;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.upload-info {
  flex-grow: 1;
}

.upload-instructions {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.upload-requirements {
  display: block;
  color: #6c757d;
  font-size: 0.8rem;
  line-height: 1.5;
}

/* Form styling */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.required {
  color: #dc3545;
  margin-left: 3px;
}

.form-control,
.form-select {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #495057;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  outline: none;
}

.form-control::placeholder {
  color: #adb5bd;
  font-size: 0.9rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.description-hint {
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
  background-color: transparent;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #5a6268;
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.alert-danger {
  background-color: #f8d7da;
  color: #842029;
  border-left: 4px solid #dc3545;
}

.alert-success {
  background-color: #d1e7dd;
  color: #0f5132;
  border-left: 4px solid #198754;
}

/* Footer */
.text-center.mt-4 small {
  font-size: 0.85rem;
  color: #6c757d;
  letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 991px) {
  .upload-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .upload-info {
    text-align: center;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1.5rem 0.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  h2.mb-0 {
    font-size: 1.75rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .form-control,
  .form-select {
    font-size: 0.95rem;
  }

  .form-label {
    font-size: 0.9rem;
  }
}
</style>
