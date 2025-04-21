<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="mb-0">Hồ sơ công ty!</h2>
    </div>

    <!-- Trạng thái loading -->
    <div v-if="userStore.isLoading" class="text-center">
      <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin công ty...
    </div>
    <!-- Trạng thái lỗi -->
    <div v-else-if="userStore.error" class="text-center text-danger">
      {{ userStore.error }}
    </div>
    <!-- Hiển thị form hồ sơ -->
    <div v-else class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h5 class="mb-4">Hồ sơ của tôi</h5>

        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="position-relative d-inline-block text-center">
            <div
              class="border border-dashed rounded-3"
              style="
                width: 150px;
                height: 150px;
                position: relative;
                cursor: pointer;
              "
              @click="$refs.uploadImage.click()"
            >
              <div
                class="d-flex flex-column align-items-center justify-content-center h-100"
              >
                <img
                  v-if="previewLogo || userStore.employer?.companyLogo"
                  :src="getImageUrl(userStore.employer?.companyLogo)"
                  alt="Company Logo"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
                <div
                  v-else
                  class="d-flex flex-column align-items-center justify-content-center h-100"
                >
                  <i class="fas fa-arrow-up fa-2x text-muted mb-2"></i>
                  <span class="text-muted">Chèn ảnh</span>
                </div>
              </div>
            </div>
            <input
              type="file"
              id="uploadImage"
              ref="uploadImage"
              class="d-none"
              accept=".jpg, .png"
              @change="previewImage"
            />
          </div>

          <div class="ms-4 flex-grow-1">
            <small class="text-muted d-block mb-2">
              Kích thước tệp tối đa là 1MB, Kích thước tối thiểu: 330x300 và các
              tệp phù hợp: .jpg & .png
            </small>
          </div>
        </div>

        <form @submit.prevent="saveProfile">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Tên công ty</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="for software"
                  v-model="form.companyName"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Mã số thuế</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="12345678"
                  v-model="form.companyTaxCode"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Website</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="https://example.com"
                  v-model="form.companyWebsite"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label"
                  >Số lượng nhân viên trong công ty</label
                >
                <input
                  type="text"
                  class="form-control"
                  placeholder="50 - 100"
                  v-model="form.companySize"
                />
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label class="form-label">Mô tả</label>
                <textarea
                  class="form-control"
                  rows="4"
                  placeholder="Mô tả về công ty của bạn"
                  v-model="form.companyDescription"
                ></textarea>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label class="form-label">Địa chỉ đầy đủ</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Địa chỉ"
                  v-model="form.companyAddress"
                />
              </div>
            </div>

            <div>
              <button type="submit" class="btn btn-primary px-5 w-30">
                Lưu
              </button>
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
import { useUserStore } from "@stores/useUserStore";
import { toast } from "vue3-toastify";

export default {
  name: "CompanyProfile",
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      form: {
        companyName: "",
        companyTaxCode: "",
        companyWebsite: "",
        companySize: "",
        companyDescription: "",
        companyAddress: "",
      },
      previewLogo: null, // Để hiển thị preview ảnh logo trước khi upload
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có ảnh
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${imagePath}`;
    },
    async fetchEmployerInfo() {
      try {
        await this.userStore.fetchEmployerInfo();
        // Cập nhật form với dữ liệu từ API
        this.form = { ...this.userStore.employer };
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhà tuyển dụng:", error);
      }
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        // Kiểm tra kích thước tệp (tối đa 1MB)
        if (file.size > 1 * 1024 * 1024) {
          toast.error("Kích thước tệp vượt quá 1MB!");
          return;
        }
        // Kiểm tra loại tệp
        if (!file.type.match(/image\/(jpg|png)/)) {
          toast.error("Chỉ hỗ trợ tệp .jpg và .png!");
          return;
        }
        // Preview ảnh
        this.previewLogo = URL.createObjectURL(file);
        // Gọi API để upload ảnh (giả định)
        this.uploadLogo(file);
      }
    },
    async uploadLogo(file) {
      try {
        const formData = new FormData();
        formData.append("logo", file);
        // Giả định có API upload logo: /api/employer/upload-logo
        // const response = await uploadLogoApi(formData);
        // this.userStore.employer.companyLogo = response.data.logoUrl;
        console.log("Upload ảnh logo:", file.name);
      } catch (error) {
        console.error("Lỗi khi upload ảnh logo:", error);
        toast.error("Lỗi khi upload ảnh logo!");
      }
    },
    async saveProfile() {
      try {
        // Giả định có API update thông tin: /api/employer/update
        // const response = await updateEmployerInfoApi(this.form);
        console.log("Lưu thông tin công ty:", this.form);
        toast.success("Cập nhật hồ sơ thành công!");
        // Cập nhật lại thông tin trong store
        this.userStore.employer = { ...this.form };
      } catch (error) {
        console.error("Lỗi khi lưu thông tin công ty:", error);
        toast.error("Lỗi khi lưu thông tin công ty!");
      }
    },
  },
  mounted() {
    this.fetchEmployerInfo(); // Gọi API khi component được mount
  },
};
</script>

<style scoped>
/* Container chính */
.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
}

h5.mb-4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
}

/* Form group và label */
.form-group {
  margin-bottom: 1.75rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 0.5rem;
  display: block;
}

/* Input và textarea */
.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  outline: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

/* Phần upload ảnh */
.position-relative {
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.border-dashed {
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  background: #f9f9f9;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.border-dashed:hover {
  border-color: #0d6efd;
  background: #f0f6ff;
}

.border-dashed i {
  color: #888;
  transition: color 0.3s ease;
}

.border-dashed:hover i {
  color: #0d6efd;
}

.border-dashed span {
  font-size: 0.85rem;
  color: #666;
}

img {
  border-radius: 12px;
}

/* Thông tin ảnh */
small.text-muted {
  font-size: 0.8rem;
  color: #777;
  line-height: 1.5;
}

/* Nút Lưu */
.btn-primary {
  background-color: #0d6efd;
  border: none;
  padding: 0.75rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background-color: #0a58ca;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Trạng thái loading */
.text-center i {
  font-size: 1.5rem;
  color: #0d6efd;
}

/* Trạng thái lỗi */
.text-danger {
  font-size: 1rem;
  color: #dc3545;
  background: #f8d7da;
  padding: 1rem;
  border-radius: 8px;
  display: inline-block;
}

/* Footer */
.text-center.mt-4 small {
  font-size: 0.85rem;
  color: #888;
  letter-spacing: 0.5px;
}

/* Responsive */
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

  .position-relative {
    width: 120px;
    height: 120px;
  }

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
  }
}

@media (max-width: 576px) {
  .col-md-6 {
    width: 100%;
  }

  .form-control {
    font-size: 0.95rem;
  }

  .form-label {
    font-size: 0.9rem;
  }
}
</style>
