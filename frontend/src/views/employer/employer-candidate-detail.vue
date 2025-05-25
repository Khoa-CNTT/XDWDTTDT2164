<template>
  <div class="container">
    <h1 class="title">Chi tiết Ứng viên</h1>
    <div>
      <router-link
        to="/employer-dashboard/employer-workmanagement"
        class="back-link"
      >
        ← Trở lại danh sách công việc
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="applyJobStore.isLoading" class="text-center mb-4">
      <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin ứng viên...
    </div>

    <!-- Error State -->
    <div v-else-if="applyJobStore.error" class="alert alert-danger">
      {{ applyJobStore.error }}
      <button
        class="btn btn-link p-0 ml-2"
        @click="$router.push('/employer-dashboard/employer-workmanagement')"
      >
        Quay lại
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <div class="form-group">
        <label for="intro">Giới thiệu bản thân</label>
        <textarea id="intro" v-model="intro" rows="5" placeholder="..." />
      </div>

      <div class="form-group">
        <label for="review">AI Đánh giá</label>
        <textarea id="review" v-model="aiReview" rows="7" placeholder="..." />
      </div>

      <div class="form-group skills-section">
        <label>Kỹ năng của ứng viên</label>
        <div v-if="skills.length" class="skills-container">
          <span v-for="(skill, index) in skills" :key="index" class="skill-tag">
            {{ skill }}
          </span>
        </div>
        <p v-else class="text-muted">Không có thông tin kỹ năng.</p>
      </div>

      <div class="form-group experience-section">
        <label>Kinh nghiệm của ứng viên</label>
        <div v-if="experience" class="experience-container">
          <p class="experience-text">{{ experience }}</p>
        </div>
        <p v-else class="text-muted">Không có thông tin kinh nghiệm.</p>
      </div>

      <!-- Review Status or Buttons -->
      <div class="form-group review-section">
        <label>Trạng thái đánh giá</label>
        <div v-if="!isReviewed && !reviewStatus" class="evaluation-buttons">
          <button
            @click="evaluateCandidate('Phù hợp')"
            class="btn btn-success"
            :disabled="isEvaluating"
            aria-label="Đánh giá ứng viên là phù hợp"
          >
            <i v-if="isEvaluating" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-check-circle"></i> Phù hợp
          </button>
          <button
            @click="evaluateCandidate('Chưa phù hợp')"
            class="btn btn-danger"
            :disabled="isEvaluating"
            aria-label="Đánh giá ứng viên là chưa phù hợp"
          >
            <i v-if="isEvaluating" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-times-circle"></i> Chưa phù hợp
          </button>
        </div>
        <div
          v-else
          class="review-status"
          :class="{
            'status-success': reviewStatus === 'Phù hợp',
            'status-danger': reviewStatus === 'Chưa phù hợp',
          }"
        >
          <i
            :class="{
              'fas fa-check-circle': reviewStatus === 'Phù hợp',
              'fas fa-times-circle': reviewStatus === 'Chưa phù hợp',
            }"
          ></i>
          Ứng viên đã được đánh giá: {{ reviewStatus }}
        </div>
      </div>

      <div class="form-group">
        <h2>FILE CV</h2>
        <div class="pdf-wrapper">
          <pdf-embed v-if="pdfUrl" :source="pdfUrl" />
          <p v-else class="text-muted">Không có file CV.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApplyStore } from "@stores/useApplyStore";
import { toast } from "vue3-toastify";
import PdfEmbed from "vue-pdf-embed";
import { employerReviewApi } from "../../apis/applyJob";

const applyJobStore = useApplyStore();
const route = useRoute();

const intro = ref("");
const aiReview = ref("");
const pdfUrl = ref("");
const isEvaluating = ref(false);
const skills = ref([]);
const experience = ref("");
const reviewStatus = ref(""); // Store employerReview or evaluation result
const isReviewed = ref(false); // Track if review is completed

const fetchCandidateDetail = async () => {
  const applyId = route.params.applyId;

  try {
    const candidate = await applyJobStore.fetchCandidateDetail(applyId);
    intro.value = candidate.coverLetter || "";
    aiReview.value = candidate.moderatorReview || "";
    reviewStatus.value = candidate.employerReview || "";
    isReviewed.value = !!candidate.employerReview; // Set true if employerReview exists

    // Parse skills and experience from moderatorReview or skillsMatch
    if (candidate.moderatorReview || candidate.skillsMatch) {
      let rawSkills = candidate.skillsMatch || "";
      if (rawSkills) {
        rawSkills = rawSkills.replace(/Soket\.io/g, "Socket.io");
        const skillsMatchParts = rawSkills.split("Kinh nghiệm:");
        const skillsList = skillsMatchParts[0]
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill);
        skills.value = skillsList;
      }

      const experienceMatch =
        candidate.moderatorReview?.match(/Kinh nghiệm: (.+)/);
      experience.value =
        experienceMatch?.[1] ||
        (skillsMatchParts[1]
          ? `Kinh nghiệm: ${skillsMatchParts[1].trim()}`
          : "") ||
        "";
    }

    // Lấy đường dẫn file CV
    let rawCvUrl = candidate.cvUpload || candidate.Candidates?.cvUrl;
    if (rawCvUrl) {
      rawCvUrl = rawCvUrl.replace("app/src/uploads/", "");
      pdfUrl.value = `http://localhost:5001/uploads/${rawCvUrl}`;
    } else {
      pdfUrl.value = "";
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin ứng viên:", error);
    toast.error("Không thể tải thông tin ứng viên. Vui lòng thử lại sau.");
  }
};

const evaluateCandidate = async (status) => {
  const applyId = route.params.applyId;
  isEvaluating.value = true;

  try {
    await employerReviewApi(applyId, status);
    toast.success(`Đã đánh giá ứng viên là ${status.toLowerCase()}`);
    reviewStatus.value = status;
    isReviewed.value = true;
    setTimeout(() => {
      location.reload(); // Reload page instead of redirect
    }, 2000);
  } catch (error) {
    console.error("Lỗi khi đánh giá ứng viên:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Không thể cập nhật đánh giá. Vui lòng thử lại sau.";
    toast.error(errorMessage);
    reviewStatus.value = status; // Show attempted status
    isReviewed.value = true; // Mark as reviewed to hide buttons
    setTimeout(() => {
      location.reload(); // Reload even on error
    }, 2000);
  } finally {
    isEvaluating.value = false;
  }
};

onMounted(() => {
  fetchCandidateDetail();
});
</script>
<script>
export default {
  components: {
    PdfEmbed,
  },
};
</script>

<style>
/* Container chính */
.container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 2rem;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.container:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

/* Link trở lại */
.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #0d6efd;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.back-link:hover {
  color: #0a58ca;
  background: rgba(13, 110, 253, 0.1);
  transform: translateX(5px);
}

/* Tiêu đề */
.title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
  position: relative;
}

.title:after {
  content: "";
  display: block;
  width: 120px;
  height: 4px;
  background: linear-gradient(to right, #0d6efd, #14b8a6);
  margin-top: 0.5rem;
  border-radius: 2px;
}

/* Form group và label */
.form-group {
  margin-bottom: 2.5rem;
}

label {
  display: block;
  font-size: 1.15rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: #4a5568;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: #f9fafb;
}

textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  outline: none;
}

/* Skills Section */
.skills-section .skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.skills-section .skills-container:hover {
  border-color: #0d6efd;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  background: linear-gradient(135deg, #0d6efd 0%, #3b82f6 100%);
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: default;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
  background: linear-gradient(135deg, #0a58ca 0%, #2563eb 100%);
}

/* Experience Section */
.experience-section .experience-container {
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.experience-section .experience-container:hover {
  border-color: #14b8a6;
}

.experience-text {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.experience-text::before {
  content: "\f0b1";
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  color: #14b8a6;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Buttons Đánh giá */
.evaluation-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.btn {
  padding: 0.85rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-success {
  background: linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%);
  color: #ffffff;
}

.btn-success:hover {
  background: linear-gradient(135deg, #0d9488 0%, #22d3ee 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(20, 184, 166, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
  color: #ffffff;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(244, 63, 94, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* PDF Wrapper */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.75rem;
  position: relative;
}

h2:after {
  content: "";
  display: block;
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, #0d6efd, #14b8a6);
  margin-top: 0.5rem;
  border-radius: 2px;
}

.pdf-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
  max-height: 800px;
  overflow: auto;
  background: #f9f9f9;
  transition: border-color 0.3s ease;
}

.pdf-wrapper:hover {
  border-color: #0d6efd;
}

/* Trạng thái rỗng */
.text-muted {
  font-size: 1rem;
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 1.25rem;
}

/* Trạng thái loading */
.text-center i {
  font-size: 1.75rem;
  color: #0d6efd;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Trạng thái lỗi */
.alert-danger {
  font-size: 1rem;
  color: #9f1239;
  background: #ffe4e6;
  border: none;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.1);
}

.alert-danger .btn-link {
  color: #9f1239;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.alert-danger .btn-link:hover {
  color: #881337;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.75rem;
    margin: 20px auto;
  }

  .title {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  textarea {
    font-size: 0.95rem;
    min-height: 100px;
  }

  label {
    font-size: 1.05rem;
  }

  .evaluation-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
  }

  .skill-tag {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }

  .experience-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1.25rem;
    margin: 15px auto;
  }

  .title {
    font-size: 1.75rem;
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .pdf-wrapper {
    max-height: 600px;
  }

  .skills-container {
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .experience-container {
    padding: 1rem;
  }
}
</style>
