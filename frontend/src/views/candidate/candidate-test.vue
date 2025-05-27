<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="welcome-title">
        Xin chào,
        {{ authStore.user?.name || authStore.user?.fullName || "User" }}
      </h1>
      <div class="back-home" @click="goBack">
        <i class="fas fa-arrow-left"></i> Trở lại trang chủ
      </div>
    </div>

    <div class="profile-card">
      <h2 class="profile-title">Hồ sơ của tôi</h2>

      <div class="upload-section">
        <label for="uploadCV" class="cv-upload-area">
          <div
            class="upload-placeholder"
            :class="{ 'has-file': cvFileName }"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <template v-if="cvFileName">
              <div class="file-preview">
                <i :class="['file-icon', getFileIconClass()]"></i>
                <span class="file-name">{{ cvFileName }}</span>
                <button
                  v-if="cvUrl"
                  @click.stop="viewCV"
                  class="view-cv-button"
                >
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
            <select v-model="profile.workingdirectory" class="form-input">
              <option value="" disabled>Chọn danh mục</option>
              <option
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.categoryName"
              >
                {{ category.categoryName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Vị trí ứng tuyển</label>
            <select v-model="profile.candidateposition" class="form-input">
              <option value="" disabled>Chọn kỹ năng</option>
              <option
                v-for="skill in skillStore.skills"
                :key="skill.id"
                :value="skill.skillName"
              >
                {{ skill.skillName }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Ngày sinh</label>
            <input type="date" v-model="profile.date" class="form-input" />
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
              <select v-model="profile.gender" class="form-input">
                <option value="" disabled>Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          @click="updateProfile"
          class="save-button"
          :disabled="isLoading"
        >
          <i class="fas fa-save"></i>
          {{ isLoading ? "Đang xử lý..." : "Cập nhật hồ sơ" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "vue3-toastify";
import { updateCandidateProfile } from "@/apis/user";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useSkillStore } from "@/stores/useSkillStore";

export default {
  name: "ProfileComponent",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const skillStore = useSkillStore();
    const categoryStore = useCategoryStore();
    const cvFileName = ref(null);
    const cvFile = ref(null);
    const cvUrl = ref(null);
    const isLoading = ref(false);
    const selectedCategoryId = ref("");

    // Khởi tạo profile
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

    // Watch cho workingdirectory để load skills tương ứng
    watch(
      () => profile.value.workingdirectory,
      async (newCategory) => {
        if (newCategory) {
          // Tìm categoryId từ categoryName
          const category = categoryStore.categories.find(
            (cat) => cat.categoryName === newCategory
          );

          if (category) {
            selectedCategoryId.value = category.id;
            await skillStore.fetchSkillByCategoryIds(category.id);
            // Reset candidateposition khi thay đổi category
            profile.value.candidateposition = "";
          }
        }
      }
    );

    // Hàm định dạng date để hiển thị
    const formatDate = (dateString) => {
      if (!dateString) return "";

      // Nếu date có định dạng DD/MM/YYYY, chuyển sang YYYY-MM-DD cho input type="date"
      if (dateString.includes("/")) {
        const parts = dateString.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
            2,
            "0"
          )}`;
        }
      }

      return dateString;
    };

    // Hàm xử lý tệp CV
    const handleCVUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra kích thước tệp (5MB = 5 * 1024 * 1024)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước tệp vượt quá 5MB!");
        return;
      }

      // Kiểm tra định dạng tệp
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận tệp PDF, DOC, DOCX!");
        return;
      }

      // Lưu tệp và tên tệp
      cvFile.value = file;
      cvFileName.value = file.name;

      // Tạo URL tạm thời cho file để xem preview
      if (file.type === "application/pdf") {
        // Nếu là PDF, tạo URL trực tiếp
        cvUrl.value = URL.createObjectURL(file);
      } else {
        // Nếu là DOC/DOCX, hiện thông báo (không thể preview trực tiếp)
        toast.info(
          "Tệp DOC/DOCX không thể xem trước trực tiếp, nhưng đã được tải lên thành công!"
        );
      }

      toast.success("CV đã được tải lên thành công!");
    };

    // Tải thông tin hồ sơ khi component được mounted
    onMounted(async () => {
      try {
        await categoryStore.fetchCategories();

        if (!authStore.user) {
          toast.error("Vui lòng đăng nhập để xem hồ sơ!");
          router.push("/login");
          return;
        }

        if (!authStore.user.Candidates) {
          toast.error("Bạn cần tạo hồ sơ trước!");
          router.push("/create-candidate");
          return;
        }

        // Gán thông tin từ user.candidates vào profile
        const candidate = authStore.user.Candidates;
        console.log("Thông tin candidate:", candidate);

        // Lấy categoryId từ CandidateSkills (nếu có)
        if (
          candidate.CandidateSkills?.length &&
          candidate.CandidateSkills[0]?.Skills?.Categories
        ) {
          selectedCategoryId.value =
            candidate.CandidateSkills[0].Skills.Categories.id;
          await skillStore.fetchSkillByCategoryIds(selectedCategoryId.value);
        }

        // Xử lý CandidateSkills để tạo chuỗi workingdirectory và candidateposition
        let skills = "";
        let categoryName = "";

        if (candidate.CandidateSkills?.length) {
          skills = candidate.CandidateSkills[0]?.Skills?.skillName || "";

          // Kiểm tra trước khi truy cập categoryName
          if (candidate.CandidateSkills[0]?.Skills?.Categories) {
            categoryName =
              candidate.CandidateSkills[0].Skills.Categories.categoryName || "";
          }
        }

        profile.value = {
          fullName: candidate.Users?.fullName || authStore.user?.fullName || "",
          phone:
            candidate.Users?.phoneNumber || authStore.user?.phoneNumber || "",
          experience: candidate.workExperience || "",
          address: candidate.address || "",
          workingdirectory: categoryName,
          candidateposition: skills,
          date: formatDate(candidate.dateOfBirth || ""),
          expectedSalary: candidate.salary || "",
          gender: candidate.gender || "",
        };

        // Nếu có CV, hiển thị tên file và URL
        if (candidate.cvUrl) {
          const filename = candidate.cvUrl.split("/").pop();
          cvFileName.value = filename || "CV.pdf";
          cvUrl.value = candidate.cvUrl;
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin hồ sơ!");
      }
    });

    // Hàm xem CV
    const viewCV = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!cvUrl.value) {
        toast.error("Không tìm thấy URL của CV!");
        return;
      }

      try {
        // Kiểm tra xem URL có phải là Blob URL (file vừa upload) hay URL từ server
        if (cvUrl.value.startsWith("blob:")) {
          // Đây là file vừa upload, mở trực tiếp
          window.open(cvUrl.value, "_blank");
        } else {
          // Đây là URL từ server
          const viewerUrl = `${
            import.meta.env.VITE_API_URL || "http://localhost:5001"
          }/uploads/${cvUrl.value}`;
          window.open(viewerUrl, "_blank");
        }
      } catch (error) {
        console.error("Lỗi khi mở CV:", error);
        toast.error("Không thể mở CV. Vui lòng thử lại sau!");
      }
    };

    // Hàm cập nhật hồ sơ
    const updateProfile = async () => {
      try {
        // Validation
        if (!profile.value.fullName.trim()) {
          toast.error("Vui lòng nhập tên đầy đủ!");
          return;
        }

        if (!profile.value.phone.trim()) {
          toast.error("Vui lòng nhập số điện thoại!");
          return;
        }

        isLoading.value = true;
        console.log("Bắt đầu cập nhật hồ sơ");

        // Chuẩn bị dữ liệu để gửi đi
        const formData = new FormData();

        // Thêm file CV nếu có
        if (cvFile.value) {
          formData.append("cv", cvFile.value);
        }

        // Thêm dữ liệu hồ sơ
        Object.entries(profile.value).forEach(([key, value]) => {
          formData.append(key, value || "");
        });

        // Thêm categoryId nếu đã chọn
        if (selectedCategoryId.value) {
          formData.append("categoryId", selectedCategoryId.value);
        }

        // Sử dụng API để cập nhật
        if (!authStore.user?.Candidates?.id) {
          throw new Error("Không tìm thấy thông tin ứng viên!");
        }

        const candidateId = authStore.user.Candidates.id;
        const response = await updateCandidateProfile(candidateId, formData);

        // Cập nhật user trong authStore
        if (response && response.data) {
          authStore.user.Candidates = response.data;
          if (response.data.cvUrl) {
            cvUrl.value = response.data.cvUrl;
            cvFileName.value = response.data.cvUrl.split("/").pop() || "CV.pdf";
          }

          toast.success("Hồ sơ đã được cập nhật thành công!");
        } else {
          throw new Error("Không nhận được dữ liệu hợp lệ từ API");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        toast.error(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ!");
      } finally {
        isLoading.value = false;
      }
    };

    // Quay lại trang chủ
    const goBack = () => {
      router.push("/");
    };

    // Hàm xử lý kéo và thả file
    const handleFileDrop = (event) => {
      const file = event.dataTransfer.files[0];
      if (file) {
        // Giả lập sự kiện change để tái sử dụng hàm handleCVUpload
        const mockEvent = { target: { files: [file] } };
        handleCVUpload(mockEvent);
      }
    };

    // Xác định icon cho file dựa vào loại file
    const getFileIconClass = () => {
      if (!cvFileName.value) return "fas fa-file";

      const extension = cvFileName.value.split(".").pop()?.toLowerCase() || "";

      if (extension === "pdf") {
        return "fas fa-file-pdf";
      } else if (["doc", "docx"].includes(extension)) {
        return "fas fa-file-word";
      } else {
        return "fas fa-file-alt";
      }
    };

    return {
      authStore,
      categoryStore,
      skillStore,
      profile,
      cvFileName,
      cvFile,
      cvUrl,
      handleCVUpload,
      handleFileDrop,
      getFileIconClass,
      viewCV,
      updateProfile,
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.form-input::placeholder {
  color: #a0aec0;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
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
  box-shadow: 0 4px 20px rgba(66, 153, 225, 0.25);
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
