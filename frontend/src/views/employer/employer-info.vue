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
                  v-if="logoPreview"
                  :src="logoPreview"
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
              @change="handleImageChange"
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
              <button
                type="submit"
                class="btn btn-primary px-5 w-30"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Đang lưu..." : "Lưu" }}
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
import { useAuthStore } from "@stores/useAuthStore";
import { toast } from "vue3-toastify";
import { updateEmployerProfile } from "@/apis/user";

export default {
  name: "CompanyProfile",
  setup() {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    return { userStore, authStore };
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
      logoFile: null,
      logoPreview: null,
      isSubmitting: false,
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return "https://via.placeholder.com/150";
      return `https://res.cloudinary.com/dh1i7su2f/image/upload/${imagePath}`;
    },
    async fetchEmployerInfo() {
      try {
        // Retry logic to wait for authStore.user to be populated
        const maxRetries = 3;
        let retries = 0;
        let employerId = null;

        while (retries < maxRetries) {
          if (this.authStore.user && this.authStore.user.Employers) {
            employerId = this.authStore.user.Employers.id;
            break;
          }
          console.log(
            `Retry ${retries + 1}/${maxRetries}: authStore.user not ready`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
          retries++;
        }

        if (!employerId) {
          throw new Error(
            "Không thể truy cập thông tin người dùng hoặc nhà tuyển dụng sau nhiều lần thử"
          );
        }

        console.log("Đang lấy thông tin nhà tuyển dụng với ID:", employerId);
        await this.userStore.fetchEmployerInfo(employerId);

        const employer = this.userStore.employer;
        if (employer) {
          this.form = {
            companyName: employer.companyName || "",
            companyTaxCode: employer.companyTaxCode || "",
            companyWebsite: employer.companyWebsite || "",
            companySize: employer.companySize || "",
            companyDescription: employer.companyDescription || "",
            companyAddress: employer.companyAddress || "",
          };

          if (employer.companyLogo) {
            this.logoPreview = this.getImageUrl(employer.companyLogo);
          }
        } else {
          console.warn("Không tìm thấy dữ liệu nhà tuyển dụng trong userStore");
          toast.error("Không tìm thấy thông tin công ty. Vui lòng thử lại!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhà tuyển dụng:", error);
        toast.error("Không thể tải thông tin công ty. Vui lòng thử lại sau!");
      }
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 1 * 1024 * 1024) {
        toast.error("Kích thước tệp vượt quá 1MB!");
        return;
      }

      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        toast.error("Chỉ hỗ trợ tệp .jpg và .png!");
        return;
      }

      this.logoFile = file;
      this.logoPreview = URL.createObjectURL(file);
    },
    async saveProfile() {
      try {
        this.isSubmitting = true;

        const formData = new FormData();
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key]);
        });

        if (this.logoFile) {
          formData.append("companyLogo", this.logoFile);
        }

        if (process.env.NODE_ENV === "development") {
          for (let [key, value] of formData.entries()) {
            console.log(
              `${key}: ${value instanceof File ? value.name : value}`
            );
          }
        }

        const employerId =
          this.userStore.employer?.id || this.authStore.user?.Employers?.id;

        if (!employerId) {
          throw new Error("Không thể xác định ID nhà tuyển dụng");
        }

        console.log("Đang cập nhật hồ sơ với employerId:", employerId);
        const response = await updateEmployerProfile(employerId, formData);

        if (response && response.data) {
          this.userStore.employer = response.data;
          if (response.data.companyLogo) {
            this.logoPreview = this.getImageUrl(response.data.companyLogo);
          }
          this.logoFile = null;
          toast.success("Cập nhật hồ sơ thành công!");
        }
      } catch (error) {
        console.error("Lỗi khi lưu thông tin công ty:", error);
        toast.error("Lỗi khi lưu thông tin công ty. Vui lòng thử lại!");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  watch: {
    // Watch authStore.user for changes and refetch if Employers data becomes available
    "authStore.user": {
      handler(newUser) {
        if (newUser && newUser.Employers && !this.userStore.employer) {
          console.log("authStore.user updated, refetching employer info");
          this.fetchEmployerInfo();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    console.log("authStore:", this.authStore);
    console.log("userStore:", this.userStore);
    this.fetchEmployerInfo();
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

.btn-primary:hover:not(:disabled) {
  background-color: #0a58ca;
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.65;
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
