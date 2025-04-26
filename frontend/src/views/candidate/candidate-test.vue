<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="welcome-title">
        Xin chào, {{ authStore.user?.name || "User" }}
      </h1>
      <div class="back-home" @click="goBack">
        <i class="fas fa-arrow-left"></i> Trở lại trang chủ
      </div>
    </div>

    <div class="profile-card">
      <h2 class="profile-title">Hồ sơ của tôi</h2>

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
              <span class="upload-title">Chèn CV của bạn</span>
              <span class="upload-text">Kéo và thả tệp PDF vào đây</span>
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
            Kích thước tệp tối đa là 5MB. Định dạng được chấp nhận: PDF, DOC,
            DOCX
          </p>
          <p class="instruction-note" v-if="cvFileName">
            <i class="fas fa-check-circle text-success"></i> CV đã được tải lên
            thành công
          </p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-column">
          <div class="form-group">
            <label class="form-label">Tên đầy đủ</label>
            <input
              v-model="profile.fullName"
              class="form-input"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <input
              v-model="profile.phone"
              class="form-input"
              placeholder="0123456789"
            />
          </div>

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
            <label class="form-label">Danh mục làm việc</label>
            <input
              v-model="profile.workingdirectory"
              class="form-input"
              placeholder="FullStack Development"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Vị trí ứng tuyển</label>
            <input
              v-model="profile.candidateposition"
              class="form-input"
              placeholder="ReactJS, Node JS"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ngày sinh</label>
            <input
              v-model="profile.date"
              class="form-input"
              placeholder="22/12/2003"
            />
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
              <label class="form-label">Giới tính</label>
              <input
                v-model="profile.gender"
                class="form-input"
                placeholder="Nam"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="saveProfile" class="save-button" :disabled="isLoading">
          <i class="fas fa-save"></i>
          {{ authStore.user?.candidates ? "Cập nhật hồ sơ" : "Lưu hồ sơ" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@stores/useAuthStore";
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const cvFileName = ref(null);
    const cvFile = ref(null);
    const cvUrl = ref(null);
    const isLoading = ref(false);

    // Khởi tạo profile từ user.candidates nếu tồn tại
    const profile = ref({
      fullName: "",
      phone: "",
      experience: "",
      address: "",
      workingdirectory: "",
      candidateposition: "",
      date: "",
      expectedSalary: "",
      gender: "",
    });

    // Kiểm tra xem có candidates hay không
    const hasCandidateProfile = computed(() => !!authStore.user?.Candidates);

    // Tải thông tin hồ sơ khi component được mounted
    onMounted(() => {
      if (hasCandidateProfile.value) {
        // Gán thông tin từ user.candidates vào profile
        const candidate = authStore.user.Candidates;
        console.log(candidate);

        // Xử lý CandidateSkills để tạo chuỗi workingdirectory
        const skills = candidate.CandidateSkills?.length
          ? candidate.CandidateSkills.map(
              (skill) => skill.Skills.skillName
            ).join(",")
          : "";

        profile.value = {
          fullName: candidate.Users.fullName || "",
          phone: candidate.Users.phoneNumber || "",
          experience: candidate.workExperience || "",
          address: candidate.address || "",
          workingdirectory:
            candidate.CandidateSkills[0].Skills.Categories.categoryName || "",
          candidateposition: skills || "",
          date: candidate.dateOfBirth || "",
          expectedSalary: candidate.salary || "",
          gender: candidate.gender || "",
        };
        // Nếu có CV, hiển thị tên file và URL
        cvFileName.value = candidate.cvUrl || null;
        cvUrl.value = candidate.cvUrl || null;
      }
    });

    // Xử lý upload CV
    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = [
          ".pdf",
          ".doc",
          ".docx",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const fileType =
          file.type || file.name.substring(file.name.lastIndexOf("."));

        if (!validTypes.some((type) => fileType.includes(type))) {
          toast.error("Chỉ chấp nhận file PDF, DOC hoặc DOCX!");
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Kích thước file không được vượt quá 5MB!");
          return;
        }

        cvFile.value = file;
        cvFileName.value = file.name;
        cvUrl.value = null; // Reset cvUrl, sẽ được cập nhật sau khi upload
      }
    };

    // Hàm xem CV trong Google Docs Viewer
    const viewCV = () => {
      if (cvUrl.value) {
        const viewerUrl = `http://localhost:5001/uploads/${cvUrl.value}`;
        window.open(viewerUrl, "_blank");
      } else {
        toast.error("Không tìm thấy URL của CV!");
      }
    };

    // Hàm thêm mới hồ sơ
    const createProfile = async () => {
      try {
        isLoading.value = true;
        const formData = new FormData();

        // Thêm file CV nếu có
        if (cvFile.value) {
          formData.append("cv", cvFile.value);
        }

        // Thêm dữ liệu hồ sơ
        Object.entries(profile.value).forEach(([key, value]) => {
          formData.append(key, value || "");
        });

        // Gọi API thêm mới
        const response = await axios.post("/api/candidate/profile", formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Cập nhật user trong authStore
        authStore.user.candidates = response.data.candidate;
        cvUrl.value = response.data.candidate.cvUrl || null;
        cvFileName.value =
          response.data.candidate.cvFileName || cvFileName.value;
        toast.success("Hồ sơ đã được tạo thành công!");
      } catch (error) {
        console.error("Lỗi khi tạo hồ sơ:", error);
        toast.error(error.response?.data?.message || "Lỗi khi tạo hồ sơ!");
      } finally {
        isLoading.value = false;
      }
    };

    // Hàm cập nhật hồ sơ
    const updateProfile = async () => {
      try {
        isLoading.value = true;
        const formData = new FormData();

        // Thêm file CV nếu có
        if (cvFile.value) {
          formData.append("cv", cvFile.value);
        }

        // Thêm dữ liệu hồ sơ
        Object.entries(profile.value).forEach(([key, value]) => {
          formData.append(key, value || "");
        });

        // Gọi API cập nhật
        const response = await axios.put("/api/candidate/profile", formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Cập nhật user trong authStore
        authStore.user.candidates = response.data.candidate;
        cvUrl.value = response.data.candidate.cvUrl || null;
        cvFileName.value =
          response.data.candidate.cvFileName || cvFileName.value;
        toast.success("Hồ sơ đã được cập nhật thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        toast.error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ!");
      } finally {
        isLoading.value = false;
      }
    };

    // Hàm xử lý lưu hồ sơ (quyết định gọi create hoặc update)
    const saveProfile = async () => {
      if (hasCandidateProfile.value) {
        await updateProfile();
      } else {
        await createProfile();
      }
    };

    // Quay lại trang chủ
    const goBack = () => {
      router.push("/");
    };

    return {
      authStore,
      profile,
      cvFileName,
      cvUrl,
      handleCVUpload,
      viewCV,
      saveProfile,
      goBack,
      isLoading,
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

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.back-home {
  color: #4a5568;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.back-home:hover {
  color: #3182ce;
  text-decoration: underline;
}

.back-home i {
  margin-right: 0.5rem;
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

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-home {
    margin-top: 0.5rem;
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
