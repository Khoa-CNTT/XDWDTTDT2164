<template>
  <div class="profile-card">
    <h2 class="profile-title">Thêm mới hồ sơ cá nhân</h2>

    <div class="upload-section">
      <label for="uploadCV" class="cv-upload-area">
        <div class="upload-placeholder" :class="{ 'has-file': cvFileName }">
          <template v-if="cvFileName">
            <div class="file-preview">
              <i class="fas fa-file-pdf file-icon"></i>
              <span class="file-name">{{ cvFileName }}</span>
              <button v-if="cvUrl" @click="viewCV" class="view-cv-button">
                <i class="fas fa-eye"></i> Xem CV
              </button>
            </div>
          </template>
          <template v-else>
            <div class="upload-icon">
              <i class="fas fa-file-upload"></i>
            </div>
            <span class="upload-title">Chèn CV của bạn *</span>
            <span class="upload-text"
              >Kéo và thả tệp PDF, DOC, DOCX vào đây</span
            >
          </template>
        </div>
      </label>
      <input
        type="file"
        id="uploadCV"
        class="hidden-input"
        accept=".pdf,.doc,.docx"
        @change="handleCVUpload"
      />

      <div class="upload-instructions">
        <p class="instruction-text">
          Kích thước tệp tối đa là 5MB. Định dạng được chấp nhận: PDF, DOC, DOCX
        </p>
        <p class="instruction-note" v-if="cvFileName">
          <i class="fas fa-check-circle text-success"></i> CV đã được chọn
        </p>
        <p class="error-text" v-if="errors.cvFile">
          <i class="fas fa-exclamation-circle"></i> {{ errors.cvFile }}
        </p>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-column">
        <div class="form-group">
          <label class="form-label">Kinh nghiệm làm việc</label>
          <input
            v-model="profile.experience"
            class="form-input"
            placeholder="5 - 10 năm"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Địa chỉ</label>
          <input
            v-model="profile.address"
            class="form-input"
            placeholder="Địa chỉ của bạn"
          />
        </div>
      </div>

      <div class="form-column">
        <div class="form-group">
          <label class="form-label">Danh mục làm việc *</label>
          <select
            v-model="profile.categoryId"
            class="form-input"
            @change="fetchSkillsByCategory"
            :class="{ 'is-invalid': errors.categoryId }"
          >
            <option value="" disabled selected>Chọn danh mục</option>
            <option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.categoryName }}
            </option>
          </select>
          <span class="error-text" v-if="errors.categoryId">{{
            errors.categoryId
          }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">Kỹ năng *</label>
          <select
            v-model="profile.skillIds"
            class="form-input"
            multiple
            :class="{ 'is-invalid': errors.skillIds }"
          >
            <option
              v-for="skill in skillStore.skills"
              :key="skill.id"
              :value="skill.id"
            >
              {{ skill.skillName }}
            </option>
          </select>
          <span class="error-text" v-if="errors.skillIds">{{
            errors.skillIds
          }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">Ngày sinh *</label>
          <input
            v-model="profile.date"
            class="form-input"
            type="date"
            :class="{ 'is-invalid': errors.date }"
          />
          <span class="error-text" v-if="errors.date">{{ errors.date }}</span>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label class="form-label">Mức lương</label>
            <input
              v-model="profile.expectedSalary"
              class="form-input"
              placeholder="4K - 5K USD"
            />
          </div>

          <div class="form-group half-width">
            <label class="form-label">Giới tính *</label>
            <select
              v-model="profile.gender"
              class="form-input"
              :class="{ 'is-invalid': errors.gender }"
            >
              <option value="" disabled selected>Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <span class="error-text" v-if="errors.gender">{{
              errors.gender
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
        @click="saveProfile"
        class="save-button"
        :disabled="isLoading || !authStore.isAuthenticated"
      >
        <i v-if="!isLoading" class="fas fa-save"></i>
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isLoading ? "Đang lưu..." : "Lưu hồ sơ" }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { createCandidateProfile } from "@/apis/user";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSkillStore } from "@/stores/useSkillStore";

export default {
  name: "ProfileCreate",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const categoryStore = useCategoryStore();
    const skillStore = useSkillStore();

    const profile = reactive({
      experience: "",
      address: "",
      categoryId: "",
      skillIds: [],
      date: "",
      expectedSalary: "",
      gender: "",
    });

    const cvFileName = ref("");
    const cvUrl = ref(null);
    const cvFile = ref(null);
    const isLoading = ref(false);
    const errors = reactive({});

    onMounted(async () => {
      if (!authStore.isAuthenticated || !authStore.user) {
        toast.error("Vui lòng đăng nhập để thêm hồ sơ", { autoClose: 3000 });
        router.push("/login");
        return;
      }
      if (authStore.user.role !== "candidate") {
        toast.error("Chỉ ứng viên mới có thể tạo hồ sơ", { autoClose: 3000 });
        router.push("/");
        return;
      }
      if (
        authStore.user.Candidates &&
        Object.keys(authStore.user.Candidates).length > 0
      ) {
        toast.info("Bạn đã có hồ sơ. Vui lòng chỉnh sửa hồ sơ hiện tại.", {
          autoClose: 3000,
        });
        router.push("/candidate-management");
        return;
      }

      try {
        await categoryStore.fetchCategories();
        if (!categoryStore.categories.length) {
          toast.warn("Không có danh mục việc làm nào được tải!", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("Lỗi khi lấy danh mục việc làm!", { autoClose: 3000 });
        console.error("Lỗi khi lấy danh mục:", error);
      }
    });

    const validateForm = () => {
      Object.keys(errors).forEach((key) => delete errors[key]);

      let isValid = true;

      if (!profile.date) {
        errors.date = "Vui lòng chọn ngày sinh";
        isValid = false;
      } else {
        const birthDate = new Date(profile.date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) {
          errors.date = "Bạn phải ít nhất 16 tuổi";
          isValid = false;
        }
      }

      if (!profile.gender) {
        errors.gender = "Vui lòng chọn giới tính";
        isValid = false;
      }

      if (!profile.categoryId) {
        errors.categoryId = "Vui lòng chọn danh mục làm việc";
        isValid = false;
      }

      if (!profile.skillIds || profile.skillIds.length === 0) {
        errors.skillIds = "Vui lòng chọn ít nhất một kỹ năng";
        isValid = false;
      }

      if (!cvFile.value) {
        errors.cvFile = "Vui lòng tải lên CV";
        isValid = false;
      }

      if (!isValid) {
        const firstError = Object.values(errors)[0];
        toast.error(firstError, { autoClose: 3000 });
      }

      return isValid;
    };

    const fetchSkillsByCategory = async () => {
      if (!profile.categoryId) {
        skillStore.skills = [];
        profile.skillIds = [];
        return;
      }

      try {
        await skillStore.fetchSkillByCategoryIds(profile.categoryId);
        if (!skillStore.skills.length) {
          toast.warn("Không có kỹ năng nào phù hợp với danh mục này!", {
            autoClose: 3000,
          });
        }
        profile.skillIds = [];
      } catch (error) {
        toast.error("Lỗi khi lấy danh sách kỹ năng!", { autoClose: 3000 });
        console.error("Lỗi khi lấy kỹ năng:", error);
      }
    };

    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (
          ![
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type)
        ) {
          errors.cvFile = "Vui lòng tải lên file PDF, DOC hoặc DOCX";
          cvFileName.value = "";
          cvFile.value = null;
          if (cvUrl.value) {
            URL.revokeObjectURL(cvUrl.value);
            cvUrl.value = null;
          }
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          errors.cvFile = "Kích thước file không được vượt quá 5MB";
          cvFileName.value = "";
          cvFile.value = null;
          if (cvUrl.value) {
            URL.revokeObjectURL(cvUrl.value);
            cvUrl.value = null;
          }
          return;
        }

        cvFileName.value = file.name;
        cvFile.value = file;
        if (cvUrl.value) {
          URL.revokeObjectURL(cvUrl.value);
        }
        cvUrl.value = URL.createObjectURL(file);
        errors.cvFile = "";
      } else {
        cvFileName.value = "";
        cvFile.value = null;
        if (cvUrl.value) {
          URL.revokeObjectURL(cvUrl.value);
          cvUrl.value = null;
        }
        errors.cvFile = "Vui lòng chọn file CV";
      }
    };

    const viewCV = () => {
      if (cvUrl.value) {
        window.open(cvUrl.value, "_blank");
      }
    };

    const saveProfile = async () => {
      if (isLoading.value) return;

      console.log("Starting saveProfile...");
      console.log("authStore:", {
        isAuthenticated: authStore.isAuthenticated,
        candidateId: authStore.candidateId,
        user: authStore.user,
      });
      console.log("profile:", profile);

      if (!validateForm()) {
        console.log("Validation failed, errors:", errors);
        return;
      }

      isLoading.value = true;

      try {
        const formData = new FormData();
        formData.append("candidateId", authStore.candidateId || "");
        formData.append("workExperience", profile.experience || "");
        formData.append("address", profile.address || "");
        formData.append("categoryId", profile.categoryId || "");
        formData.append("skillIds", JSON.stringify(profile.skillIds));
        formData.append("dateOfBirth", profile.date);
        formData.append("salary", profile.expectedSalary || "");
        formData.append("gender", profile.gender);
        if (cvFile.value) {
          formData.append("cv", cvFile.value);
        }

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        const response = await createCandidateProfile(formData);
        console.log("API response:", response);

        if (response.status === "success") {
          toast.success("Hồ sơ đã được thêm thành công!", { autoClose: 3000 });
          router.push("/");
        } else {
          throw new Error(response.message || "Lưu hồ sơ thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi lưu hồ sơ:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi lưu hồ sơ";
        toast.error(message, { autoClose: 3000 });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      profile,
      cvFileName,
      cvUrl,
      cvFile,
      isLoading,
      errors,
      authStore,
      categoryStore,
      skillStore,
      handleCVUpload,
      viewCV,
      saveProfile,
      fetchSkillsByCategory,
    };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f7f9fc;
  min-height: 100vh;
}

.profile-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 1rem;
}

.upload-section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}

.cv-upload-area {
  cursor: pointer;
  display: block;
}

.upload-placeholder {
  width: 220px;
  height: 180px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  background-color: #f8fafc;
  padding: 1rem;
}

.upload-placeholder:hover {
  border-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.05);
}

.upload-placeholder.has-file {
  border-color: #48bb78;
  background-color: rgba(72, 187, 120, 0.05);
}

.upload-icon {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-title {
  color: #4a5568;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  color: #718096;
  font-size: 0.85rem;
  text-align: center;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.file-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 0.5rem;
}

.file-name {
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  margin-bottom: 0.5rem;
}

.view-cv-button {
  background-color: #4299e1;
  color: white;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.view-cv-button:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
}

.view-cv-button:active {
  transform: translateY(0);
}

.view-cv-button i {
  margin-right: 0.3rem;
}

.hidden-input {
  display: none;
}

.upload-instructions {
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.instruction-text {
  color: #718096;
  font-size: 0.85rem;
  line-height: 1.5;
  max-width: 350px;
  margin-bottom: 0.5rem;
}

.instruction-note {
  color: #48bb78;
  font-size: 0.9rem;
  font-weight: 500;
}

.text-success {
  color: #48bb78;
  margin-right: 0.5rem;
}

.form-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1rem;
}

.form-column {
  flex: 1;
  min-width: 300px;
  padding: 0 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.half-width {
  flex: 1;
  min-width: 150px;
  padding: 0 0.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #4a5568;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-input[multiple] {
  height: auto;
  min-height: 100px;
  padding: 0.5rem;
  overflow-y: auto;
}

.form-input[multiple] option {
  padding: 0.5rem;
}

.form-input.is-invalid {
  border-color: #dc3545;
}

.form-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
}

.error-text {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start;
}

.save-button {
  background-color: #4299e1;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.save-button:hover {
  background-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.25);
}

.save-button:active {
  transform: translateY(0);
}

.save-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.save-button i {
  margin-right: 0.5rem;
}

@media (max-width: 1024px) {
  .form-grid {
    flex-direction: column;
  }

  .form-column {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .upload-section {
    flex-direction: column;
  }

  .upload-instructions {
    margin-left: 0;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
  }

  .half-width {
    width: 100%;
  }
}
</style>
