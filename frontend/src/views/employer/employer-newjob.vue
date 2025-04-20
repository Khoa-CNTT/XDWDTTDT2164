<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="title">Thêm một công việc mới!</h1>
      <router-link to="/" class="back-link">Trở lại trang chủ?</router-link>
    </div>

    <!-- Tabs -->
    <div class="tabs mb-4">
      <div class="tab active">
        <i class="fas fa-briefcase me-2"></i>Đăng công việc
      </div>
      <div class="tab disabled">
        <i class="fas fa-credit-card me-2"></i>Thanh toán
      </div>
    </div>

    <!-- Form -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h2 class="subtitle mb-4">Tiêu đề công việc</h2>

        <form @submit.prevent="submitForm">
          <!-- Mô tả -->
          <div class="form-group mb-4">
            <label for="description">Mô tả</label>
            <QuillEditor
              v-model:content="form.description"
              content-type="html"
              theme="snow"
              :toolbar="[
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ size: ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                ['clean'],
              ]"
              placeholder="Mô tả công việc..."
              class="quill-editor"
            />
          </div>

          <!-- Các trường nhập liệu -->
          <div class="row g-4">
            <!-- Danh mục việc làm -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="category">Danh mục việc làm</label>
                <select
                  id="category"
                  v-model="form.category"
                  class="form-control"
                >
                  <option value="" disabled>Chọn danh mục</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <!-- Mức lương -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="salary">Mức lương</label>
                <select id="salary" v-model="form.salary" class="form-control">
                  <option value="" disabled>Chọn mức lương</option>
                  <option value="34 - 40 triệu">34 - 40 triệu</option>
                  <option value="40 - 50 triệu">40 - 50 triệu</option>
                  <option value="50 - 60 triệu">50 - 60 triệu</option>
                </select>
              </div>
            </div>

            <!-- Kỹ năng -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="skills">Kỹ năng</label>
                <select
                  id="skills"
                  v-model="form.skills"
                  multiple
                  class="form-control skills-select"
                >
                  <option
                    v-for="skill in skillOptions"
                    :key="skill"
                    :value="skill"
                  >
                    {{ skill }}
                  </option>
                </select>
                <small class="text-muted d-block mt-1">
                  Giữ phím Ctrl (Windows) hoặc Command (Mac) để chọn nhiều kỹ
                  năng.
                </small>
              </div>
            </div>

            <!-- Hình thức làm việc -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="workType">Hình thức làm việc</label>
                <select
                  id="workType"
                  v-model="form.workType"
                  class="form-control"
                >
                  <option value="" disabled>Chọn hình thức</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <!-- Số lượng người tuyển -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantity">Số lượng người tuyển</label>
                <select
                  id="quantity"
                  v-model="form.quantity"
                  class="form-control"
                >
                  <option value="" disabled>Chọn chuyên môn</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>

            <!-- Kinh nghiệm -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="experience">Kinh nghiệm</label>
                <select
                  id="experience"
                  v-model="form.experience"
                  class="form-control"
                >
                  <option value="" disabled>Chọn kinh nghiệm</option>
                  <option value="1 năm">1 năm</option>
                  <option value="2 năm">2 năm</option>
                  <option value="3 năm">3 năm</option>
                </select>
              </div>
            </div>

            <!-- Cấp bậc -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="level">Cấp bậc</label>
                <select id="level" v-model="form.level" class="form-control">
                  <option value="" disabled>Chọn cấp bậc</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                </select>
              </div>
            </div>

            <!-- Ngày hết hạn ứng tuyển -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="deadline">Ngày hết hạn ứng tuyển</label>
                <input
                  type="date"
                  id="deadline"
                  v-model="form.deadline"
                  class="form-control"
                />
              </div>
            </div>

            <!-- Địa chỉ -->
            <div class="col-12">
              <div class="form-group">
                <label for="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  v-model="form.address"
                  placeholder="Địa chỉ công ty"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- Nút Tiếp tục -->
          <div class="mt-4">
            <button type="submit" class="btn btn-primary">Tiếp tục</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "AddJob",
  components: { QuillEditor },
  data() {
    return {
      form: {
        description: "",
        category: "",
        salary: "",
        skills: [],
        workType: "",
        quantity: "",
        experience: "",
        level: "",
        deadline: "",
        address: "",
      },
      skillOptions: [
        "React",
        "NestJS",
        "NodeJS",
        "VueJS",
        "Angular",
        "Java",
        "Python",
      ],
    };
  },
  methods: {
    submitForm() {
      // Kiểm tra dữ liệu
      if (!this.form.description || this.form.description === "<p><br></p>") {
        toast.error("Vui lòng nhập mô tả công việc!");
        return;
      }
      if (!this.form.category) {
        toast.error("Vui lòng chọn danh mục việc làm!");
        return;
      }
      if (!this.form.salary) {
        toast.error("Vui lòng chọn mức lương!");
        return;
      }
      if (this.form.skills.length === 0) {
        toast.error("Vui lòng chọn ít nhất một kỹ năng!");
        return;
      }
      if (!this.form.workType) {
        toast.error("Vui lòng chọn hình thức làm việc!");
        return;
      }
      if (!this.form.quantity) {
        toast.error("Vui lòng chọn số lượng người tuyển!");
        return;
      }
      if (!this.form.experience) {
        toast.error("Vui lòng chọn kinh nghiệm!");
        return;
      }
      if (!this.form.level) {
        toast.error("Vui lòng chọn cấp bậc!");
        return;
      }
      if (!this.form.deadline) {
        toast.error("Vui lòng chọn ngày hết hạn ứng tuyển!");
        return;
      }
      if (!this.form.address.trim()) {
        toast.error("Vui lòng nhập địa chỉ!");
        return;
      }

      // Log dữ liệu form (giả định gửi API)
      console.log("Dữ liệu công việc:", this.form);
      toast.success("Đã gửi thông tin công việc! Đang chuyển hướng...");

      // Giả định chuyển sang tab Thanh toán
      this.$router.push("/employer-dashboard/employer-job-payment");
    },
  },
};
</script>

<style scoped>
/* Container chính */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f5f9ff;
}

/* Tiêu đề */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

/* Link trở lại */
.back-link {
  font-size: 0.95rem;
  color: #6c757d;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #0d6efd;
  text-decoration: none;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  background: #e9ecef;
  cursor: not-allowed;
}

.tab.active {
  background: #0d6efd;
  color: #fff;
  cursor: default;
}

.tab i {
  font-size: 1.1rem;
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

/* Tiêu đề phụ */
.subtitle {
  font-size: 1.5rem;
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

label {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
  display: block;
}

/* Input, Select */
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

/* Quill Editor */
.quill-editor {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.quill-editor :deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
  background: #f9f9f9;
  padding: 0.5rem 1rem;
}

.quill-editor :deep(.ql-container) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 200px; /* Tăng chiều cao lên 200px */
  font-size: 1.1rem; /* Tăng font chữ cho khu vực nhập liệu */
  color: #333;
}

.quill-editor :deep(.ql-editor) {
  padding: 1rem; /* Tăng padding để nội dung thoáng hơn */
  min-height: 200px; /* Đồng bộ với container */
}

.quill-editor :deep(.ql-editor.ql-blank::before) {
  color: #999;
  font-style: normal;
  font-size: 1.1rem; /* Đồng bộ font chữ với editor */
}

.quill-editor :deep(.ql-toolbar.ql-snow .ql-picker-label) {
  color: #333;
}

.quill-editor :deep(.ql-toolbar.ql-snow .ql-picker-options) {
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.quill-editor :deep(.ql-toolbar.ql-snow .ql-formats) {
  margin-right: 0.75rem;
}

.quill-editor :deep(.ql-snow .ql-stroke) {
  stroke: #666;
}

.quill-editor :deep(.ql-snow .ql-fill) {
  fill: #666;
}

/* Select đa chọn cho Kỹ năng */
.skills-select {
  height: 120px; /* Chiều cao để hiển thị nhiều lựa chọn */
}

/* Text hướng dẫn */
.text-muted {
  font-size: 0.85rem;
  color: #6c757d;
}

/* Nút Tiếp tục */
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

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 0.75rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1.25rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }

  .form-control {
    font-size: 0.95rem;
  }

  .quill-editor :deep(.ql-container),
  .quill-editor :deep(.ql-editor) {
    min-height: 150px; /* Giảm chiều cao trên màn hình vừa */
    font-size: 1rem; /* Giảm font chữ để phù hợp */
  }

  .quill-editor :deep(.ql-editor.ql-blank::before) {
    font-size: 1rem;
  }

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
  }

  .skills-select {
    height: 100px;
  }
}

@media (max-width: 576px) {
  .col-md-6 {
    width: 100%;
  }

  .form-control {
    font-size: 0.9rem;
  }

  .form-group label {
    font-size: 0.95rem;
  }

  .quill-editor :deep(.ql-container),
  .quill-editor :deep(.ql-editor) {
    min-height: 120px; /* Giảm chiều cao trên màn hình nhỏ */
    font-size: 0.95rem; /* Giảm font chữ để phù hợp */
  }

  .quill-editor :deep(.ql-editor.ql-blank::before) {
    font-size: 0.95rem;
  }

  .skills-select {
    height: 80px;
  }
}
</style>
