<template>
  <div class="container py-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="title">Chỉnh sửa công việc</h1>
        <router-link to="/employer-dashboard" class="back-link">
          Trở lại dashboard
        </router-link>
      </div>

      <!-- Form -->
      <div class="card border-0 rounded-4">
        <div class="card-body p-4">
          <h2 class="subtitle mb-4">Thông tin công việc</h2>

          <form @submit.prevent="submitForm">
            <!-- Tên bài đăng -->
            <div class="form-group mb-4">
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
              <small
                v-if="form.jobName.length > 0"
                class="text-muted d-block mt-1"
              >
                {{ form.jobName.length }}/100 ký tự
              </small>
            </div>

            <!-- Mô tả -->
            <div class="form-group mb-4">
              <label for="description">Mô tả công việc</label>
              <QuillEditor
                v-model:content="form.description"
                content-type="html"
                theme="snow"
                :toolbar="editorToolbar"
                placeholder="Mô tả chi tiết về công việc..."
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
                :toolbar="editorToolbar"
                placeholder="Yêu cầu về kỹ năng, kinh nghiệm của ứng viên..."
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
                :toolbar="editorToolbar"
                placeholder="Quyền lợi ứng viên được hưởng..."
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
                :toolbar="editorToolbar"
                placeholder="Thời gian và lịch làm việc..."
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
                    class="form-select"
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
                    class="form-select"
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
                  <div class="skill-select-wrapper">
                    <select
                      id="skills"
                      v-model="form.skillIds"
                      multiple
                      class="form-select skills-select"
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
                      <i class="bi bi-info-circle me-1"></i>
                      Giữ phím Ctrl (Windows) hoặc Command (Mac) để chọn nhiều
                      kỹ năng
                    </small>
                  </div>
                  <div
                    v-if="form.skillIds.length > 0"
                    class="selected-skills mt-2"
                  >
                    <span
                      class="badge bg-primary me-1 mb-1"
                      v-for="skillId in form.skillIds"
                      :key="skillId"
                    >
                      {{ getSkillName(skillId) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Hình thức làm việc -->
              <div class="col-md-6">
                <div class="form-group">
                  <label for="workType">Hình thức làm việc</label>
                  <select
                    id="workType"
                    v-model="form.jobTypeId"
                    class="form-select"
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
                    class="form-select"
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
                    class="form-select"
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
                  <small
                    v-if="form.address.length > 0"
                    class="text-muted d-block mt-1"
                  >
                    {{ form.address.length }}/200 ký tự
                  </small>
                </div>
              </div>
            </div>

            <!-- Nút Cập nhật và Hủy -->
            <div class="mt-4 d-flex gap-3">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span
                  v-if="isSubmitting"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ isSubmitting ? "Đang cập nhật..." : "Cập nhật" }}
              </button>
              <router-link
                to="/employer-dashboard"
                class="btn btn-outline-secondary"
              >
                Hủy
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSalaryStore } from "@/stores/useSalaryStore";
import { useSkillStore } from "@/stores/useSkillStore";
import { useJobTypeStore } from "@/stores/useJobTypeStore";
import { useExperienceStore } from "@/stores/useExperienceStore";
import { useRankStore } from "@/stores/useRankStore";
import { useJobStore } from "@/stores/useJobStore";
import { useAuthStore } from "@/stores/useAuthStore";

export default {
  name: "EditJob",
  components: { QuillEditor },

  beforeRouteEnter(to, from, next) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated || authStore.user.role !== "employer") {
      toast.error("Chỉ nhà tuyển dụng được phép chỉnh sửa công việc!");
      next("/login");
    } else {
      next();
    }
  },

  setup() {
    const route = useRoute();
    const router = useRouter();

    const categoryStore = useCategoryStore();
    const salaryStore = useSalaryStore();
    const skillStore = useSkillStore();
    const jobTypeStore = useJobTypeStore();
    const experienceStore = useExperienceStore();
    const rankStore = useRankStore();
    const jobStore = useJobStore();

    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const minDate = ref(new Date().toISOString().split("T")[0]);

    const form = ref({
      jobName: "",
      description: "",
      candidateRequirements: "",
      benefit: "",
      workTime: "",
      categoryId: "",
      salaryId: "",
      skillIds: [],
      jobTypeId: "",
      numberOfRecruits: 1,
      experienceId: "",
      rankId: "",
      expire: "",
      address: "",
    });

    const editorToolbar = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ];

    // Lấy tên kỹ năng từ id
    const getSkillName = (skillId) => {
      const skill = skillStore.skills.find((s) => s.id === skillId);
      return skill ? skill.skillName : "Kỹ năng không xác định";
    };

    // Tải kỹ năng theo danh mục
    const fetchSkillsByCategory = async () => {
      if (!form.value.categoryId) {
        skillStore.skills = [];
        form.value.skillIds = [];
        return;
      }
      try {
        await skillStore.fetchSkillByCategoryIds(form.value.categoryId);
        // Loại bỏ các kỹ năng không còn trong danh mục mới
        form.value.skillIds = form.value.skillIds.filter((skillId) =>
          skillStore.skills.some((skill) => skill.id === skillId)
        );
        if (!skillStore.skills.length) {
          toast.warn("Không có kỹ năng nào phù hợp với danh mục này!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy danh sách kỹ năng!");
        console.error("Lỗi khi lấy kỹ năng:", error);
      }
    };

    // Tải dữ liệu công việc
    const fetchJob = async (jobId) => {
      try {
        await jobStore.fetchJobDetailForEmployer(jobId);

        const job = jobStore.job;

        // Điền dữ liệu vào form
        form.value = {
          jobName: job.jobName || "",
          description: job.description || "",
          candidateRequirements: job.candidateRequirements || "",
          benefit: job.benefit || "",
          workTime: job.workTime || "",
          categoryId: job.Categories.id || "",
          salaryId: job.Salaries.id || "",
          skillIds: job.JobSkills
            ? job.JobSkills.map((skill) => skill.Skills.id)
            : [],
          jobTypeId: job.JobTypes.id || "",
          numberOfRecruits: job.numberOfRecruits || 1,
          experienceId: job.Experiences.id || "",
          rankId: job.Ranks.id || "",
          expire: job.expire
            ? new Date(job.expire).toISOString().split("T")[0]
            : "",
          address: job.address || "",
        };

        // Tải kỹ năng dựa trên categoryId
        if (form.value.categoryId) {
          await fetchSkillsByCategory();
        }
      } catch (error) {
        throw new Error(error.message || "Lỗi khi tải công việc");
      }
    };

    // Gửi form
    const submitForm = async () => {
      if (isSubmitting.value) return;

      isSubmitting.value = true;
      try {
        const jobId = route.params.jobId;
        await jobStore.updateJob(jobId, form.value);
        toast.success("Cập nhật công việc thành công! Đang chuyển hướng...");
        setTimeout(() => {
          router.push("/employer-dashboard");
        }, 1500);
      } catch (error) {
        toast.error("Lỗi khi cập nhật bài đăng công việc!");
        console.error("Lỗi khi cập nhật bài đăng công việc:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    // Khởi tạo dữ liệu
    onMounted(async () => {
      isLoading.value = true;
      try {
        // Tải dữ liệu danh mục, lương, kỹ năng, v.v.
        await Promise.all([
          categoryStore.fetchCategories(),
          salaryStore.fetchSalaries(),
          jobTypeStore.fetchJobTypes(),
          experienceStore.fetchExperiences(),
          rankStore.fetchRanks(),
        ]);

        // Tải dữ liệu công việc
        const jobId = route.params.jobId;
        await fetchJob(jobId);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu công việc!");
        console.error("Lỗi khi tải dữ liệu:", error);
        router.push("/employer-dashboard");
      } finally {
        isLoading.value = false;
      }
    });

    return {
      form,
      isLoading,
      isSubmitting,
      minDate,
      editorToolbar,
      categoryStore,
      salaryStore,
      skillStore,
      jobTypeStore,
      experienceStore,
      rankStore,
      jobStore,
      getSkillName,
      fetchSkillsByCategory,
      submitForm,
    };
  },
};
</script>

<style scoped>
/* Container chính */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f8fafc;
}

/* Tiêu đề */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin-bottom: 0;
}

/* Link trở lại */
.back-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
}

.back-link:hover {
  color: #0d6efd;
}

.back-link::before {
  content: "←";
  margin-right: 0.25rem;
}

/* Card chứa form */
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.card-body {
  padding: 2rem;
}

/* Tiêu đề phụ */
.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Form group và label */
.form-group {
  margin-bottom: 1.75rem;
}

label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

/* Input, Select */
.form-control,
.form-select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #1f2937;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}

/* Quill Editor */
.quill-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.quill-editor :deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
  background: #f9fafb;
  padding: 0.5rem;
}

.quill-editor :deep(.ql-container) {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 150px;
  font-size: 1rem;
  color: #1f2937;
}

.quill-editor :deep(.ql-editor) {
  padding: 1rem;
  min-height: 150px;
}

.quill-editor :deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
  font-style: normal;
  font-size: 1rem;
}

/* Select đa chọn cho Kỹ năng */
.skills-select {
  height: 120px;
  padding: 0.5rem;
}

.skill-select-wrapper {
  position: relative;
}

.selected-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.selected-skills .badge {
  font-weight: 500;
  padding: 0.4rem 0.6rem;
}

/* Text hướng dẫn */
.text-muted {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Nút */
.btn {
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #2563eb;
  border: none;
  color: white;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.15);
}

.btn-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline-secondary {
  color: #4b5563;
  border-color: #d1d5db;
  background-color: white;
}

.btn-outline-secondary:hover {
  background-color: #f3f4f6;
  color: #111827;
  border-color: #9ca3af;
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
    margin-bottom: 1.25rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .quill-editor :deep(.ql-container),
  .quill-editor :deep(.ql-editor) {
    min-height: 120px;
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
  }

  .mt-4.d-flex {
    flex-direction: column;
    gap: 0.75rem;
  }

  .skills-select {
    height: 100px;
  }
}

@media (max-width: 576px) {
  .col-md-6 {
    width: 100%;
  }

  .form-control,
  .form-select {
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
    height: 80px;
  }
}
</style>
