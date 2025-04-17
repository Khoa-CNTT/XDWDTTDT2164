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
.container-fluid {
  max-width: 1200px;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.text-danger {
  font-size: 0.875rem;
}

.w-30 {
  width: 30%;
}
</style>
