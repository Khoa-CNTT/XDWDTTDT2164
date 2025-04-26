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
          <!-- Tên bài đăng -->
          <div class="col-12">
            <div class="form-group">
              <label for="jobName">Tên bài đăng</label>
              <input
                type="text"
                id="jobName"
                v-model.trim="form.jobName"
                placeholder="Tên bài đăng công việc"
                class="form-control"
                required
                aria-required="true"
                maxlength="100"
              />
            </div>
          </div>

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
              aria-required="true"
            />
          </div>

          <!-- Yêu cầu ứng viên -->
          <div class="form-group mb-4">
            <label for="candidateRequirements">Yêu cầu ứng viên</label>
            <QuillEditor
              v-model:content="form.candidateRequirements"
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
              placeholder="Yêu cầu ứng viên..."
              class="quill-editor"
              aria-required="true"
            />
          </div>

          <!-- Quyền lợi -->
          <div class="form-group mb-4">
            <label for="benefit">Quyền lợi</label>
            <QuillEditor
              v-model:content="form.benefit"
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
              placeholder="Quyền lợi..."
              class="quill-editor"
              aria-required="true"
            />
          </div>

          <!-- Thời gian làm việc -->
          <div class="form-group mb-4">
            <label for="workTime">Thời gian làm việc</label>
            <QuillEditor
              v-model:content="form.workTime"
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
              placeholder="Thời gian làm việc..."
              class="quill-editor"
              aria-required="true"
            />
          </div>

          <!-- Các trường nhập liệu -->
          <div class="row g-4">
            <!-- Danh mục việc làm -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="categoryId">Danh mục việc làm</label>
                <select
                  id="categoryId"
                  v-model="form.categoryId"
                  class="form-control"
                  required
                  aria-required="true"
                  @change="fetchSkillsByCategory"
                >
                  <option value="" disabled>Chọn danh mục</option>
                  <option
                    v-for="category in categoryStore.categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Mức lương -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="salary">Mức lương</label>
                <select
                  id="salary"
                  v-model="form.salaryId"
                  class="form-control"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Chọn mức lương</option>
                  <option
                    v-for="salary in salaryStore.salaries"
                    :key="salary.id"
                    :value="salary.id"
                  >
                    {{ salary.salaryName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Kỹ năng -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="skills">Kỹ năng</label>
                <select
                  id="skills"
                  v-model="form.skillIds"
                  multiple
                  class="form-control skills-select"
                  required
                  aria-required="true"
                  aria-multiselectable="true"
                >
                  <option
                    v-for="skill in skillStore.skills"
                    :key="skill.id"
                    :value="skill.id"
                  >
                    {{ skill.skillName }}
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
                  v-model="form.jobTypeId"
                  class="form-control"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Chọn hình thức</option>
                  <option
                    v-for="jobType in jobTypeStore.jobTypes"
                    :key="jobType.id"
                    :value="jobType.id"
                  >
                    {{ jobType.jobTypeName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Số lượng người tuyển -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantity">Số lượng người tuyển</label>
                <input
                  type="number"
                  id="quantity"
                  v-model.number="form.numberOfRecruits"
                  placeholder="Số lượng người tuyển"
                  class="form-control"
                  min="1"
                  max="100"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <!-- Kinh nghiệm -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="experience">Kinh nghiệm</label>
                <select
                  id="experience"
                  v-model="form.experienceId"
                  class="form-control"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Chọn kinh nghiệm</option>
                  <option
                    v-for="experience in experienceStore.experiences"
                    :key="experience.id"
                    :value="experience.id"
                  >
                    {{ experience.experienceName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Cấp bậc -->
            <div class="col-md-6">
              <div class="form-group">
                <label for="level">Cấp bậc</label>
                <select
                  id="level"
                  v-model="form.rankId"
                  class="form-control"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Chọn cấp bậc</option>
                  <option
                    v-for="rank in rankStore.ranks"
                    :key="rank.id"
                    :value="rank.id"
                  >
                    {{ rank.rankName }}
                  </option>
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
                  v-model="form.expire"
                  class="form-control"
                  :min="minDate"
                  required
                  aria-required="true"
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
                  v-model.trim="form.address"
                  placeholder="Địa chỉ công ty"
                  class="form-control"
                  required
                  aria-required="true"
                  maxlength="200"
                />
              </div>
            </div>
          </div>

          <!-- Nút Tiếp tục -->
          <div class="mt-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Đang gửi..." : "Tiếp tục" }}
            </button>
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
import { useCategoryStore } from "@stores/useCategoryStore";
import { useSalaryStore } from "@stores/useSalaryStore";
import { useSkillStore } from "@stores/useSkillStore";
import { useJobTypeStore } from "@stores/useJobTypeStore";
import { useExperienceStore } from "@stores/useExperienceStore";
import { useRankStore } from "@stores/useRankStore";
import { useJobStore } from "@stores/useJobStore";

export default {
  name: "AddJob",
  components: { QuillEditor },
  setup() {
    const categoryStore = useCategoryStore();
    const salaryStore = useSalaryStore();
    const skillStore = useSkillStore();
    const jobTypeStore = useJobTypeStore();
    const experienceStore = useExperienceStore();
    const rankStore = useRankStore();
    const jobStore = useJobStore();
    return {
      categoryStore,
      salaryStore,
      skillStore,
      jobTypeStore,
      experienceStore,
      rankStore,
      jobStore,
    };
  },
  data() {
    return {
      form: {
        jobName: "",
        description: "",
        candidateRequirements: "",
        benefit: "",
        workTime: "",
        categoryId: "",
        salaryId: "",
        skillIds: [],
        jobTypeId: "",
        numberOfRecruits: "",
        experienceId: "",
        rankId: "",
        expire: "",
        address: "",
      },
      isSubmitting: false,
      minDate: new Date().toISOString().split("T")[0], // Today's date as minimum
    };
  },
  async mounted() {
    await this.fetchJobTypes();
  },
  methods: {
    async fetchJobTypes() {
      try {
        await Promise.all([
          this.categoryStore.fetchCategories(),
          this.salaryStore.fetchSalaries(),
          this.jobTypeStore.fetchJobTypes(),
          this.experienceStore.fetchExperiences(),
          this.rankStore.fetchRanks(),
        ]);
        if (!this.categoryStore.categories.length) {
          toast.error("Không có danh mục việc làm nào được tải!");
        }
        if (!this.salaryStore.salaries.length) {
          toast.error("Không có mức lương nào được tải!");
        }
        if (!this.jobTypeStore.jobTypes.length) {
          toast.error("Không có hình thức làm việc nào được tải!");
        }
        if (!this.experienceStore.experiences.length) {
          toast.error("Không có kinh nghiệm nào được tải!");
        }
        if (!this.rankStore.ranks.length) {
          toast.error("Không có cấp bậc nào được tải!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu danh mục!");
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    },
    async fetchSkillsByCategory() {
      if (!this.form.categoryId) {
        this.skillStore.skills = []; // Clear skills if no category is selected
        return;
      }
      try {
        await this.skillStore.fetchSkillByCategoryIds(this.form.categoryId);
        if (!this.skillStore.skills.length) {
          toast.warn("Không có kỹ năng nào phù hợp với danh mục này!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy danh sách kỹ năng!");
        console.error("Lỗi khi lấy kỹ năng:", error);
      }
    },
    async submitForm() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      // Validate fields
      if (!this.form.jobName.trim()) {
        toast.error("Vui lòng nhập tên bài đăng công việc!");
        this.isSubmitting = false;
        return;
      }
      if (this.form.jobName.length > 100) {
        toast.error("Tên bài đăng không được vượt quá 100 ký tự!");
        this.isSubmitting = false;
        return;
      }
      if (
        !this.form.description ||
        this.form.description === "<p><br></p>" ||
        this.form.description.trim() === ""
      ) {
        toast.error("Vui lòng nhập mô tả công việc!");
        this.isSubmitting = false;
        return;
      }
      if (
        !this.form.candidateRequirements ||
        this.form.candidateRequirements === "<p><br></p>" ||
        this.form.candidateRequirements.trim() === ""
      ) {
        toast.error("Vui lòng nhập mô tả công việc!");
        this.isSubmitting = false;
        return;
      }
      if (
        !this.form.benefit ||
        this.form.benefit === "<p><br></p>" ||
        this.form.benefit.trim() === ""
      ) {
        toast.error("Vui lòng nhập mô tả công việc!");
        this.isSubmitting = false;
        return;
      }
      if (
        !this.form.workTime ||
        this.form.workTime === "<p><br></p>" ||
        this.form.workTime.trim() === ""
      ) {
        toast.error("Vui lòng nhập mô tả công việc!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.categoryId) {
        toast.error("Vui lòng chọn danh mục việc làm!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.salaryId) {
        toast.error("Vui lòng chọn mức lương!");
        this.isSubmitting = false;
        return;
      }
      if (this.form.skillIds.length === 0) {
        toast.error("Vui lòng chọn ít nhất một kỹ năng!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.jobTypeId) {
        toast.error("Vui lòng chọn hình thức làm việc!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.numberOfRecruits || this.form.numberOfRecruits < 1) {
        toast.error("Vui lòng nhập số lượng người tuyển hợp lệ!");
        this.isSubmitting = false;
        return;
      }
      if (this.form.numberOfRecruits > 100) {
        toast.error("Số lượng người tuyển không được vượt quá 100!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.experienceId) {
        toast.error("Vui lòng chọn kinh nghiệm!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.rankId) {
        toast.error("Vui lòng chọn cấp bậc!");
        this.isSubmitting = false;
        return;
      }
      if (
        !this.form.expire ||
        new Date(this.form.expire) < new Date(this.minDate)
      ) {
        toast.error("Vui lòng chọn ngày hết hạn ứng tuyển hợp lệ!");
        this.isSubmitting = false;
        return;
      }
      if (!this.form.address.trim()) {
        toast.error("Vui lòng nhập địa chỉ!");
        this.isSubmitting = false;
        return;
      }
      if (this.form.address.length > 200) {
        toast.error("Địa chỉ không được vượt quá 200 ký tự!");
        this.isSubmitting = false;
        return;
      }

      try {
        await this.jobStore.createNewJob(this.form);
        toast.success("Đã gửi thông tin công việc! Đang chuyển hướng...");
        this.$router.push("/employer-dashboard/employer-job-payment");
      } catch (error) {
        toast.error("Lỗi khi thêm mới bài đăng công việc!");
        console.error("Lỗi khi thêm mới bài đăng công việc:", error);
      } finally {
        this.isSubmitting = false;
      }
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
  min-height: 150px;
  font-size: 1rem;
  color: #333;
}

.quill-editor :deep(.ql-editor) {
  padding: 1rem;
  min-height: 150px;
}

.quill-editor :deep(.ql-editor.ql-blank::before) {
  color: #999;
  font-style: normal;
  font-size: 1rem;
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
  height: 100px;
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

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
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
    min-height: 120px;
    font-size: 0.95rem;
  }

  .quill-editor :deep(.ql-editor.ql-blank::before) {
    font-size: 0.95rem;
  }

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
  }

  .skills-select {
    height: 80px;
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
    min-height: 100px;
    font-size: 0.9rem;
  }

  .quill-editor :deep(.ql-editor.ql-blank::before) {
    font-size: 0.9rem;
  }

  .skills-select {
    height: 60px;
  }
}
</style>
