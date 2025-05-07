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

      <!-- Buttons Đánh giá -->
      <div class="evaluation-buttons">
        <button
          @click="evaluateCandidate(true)"
          class="btn btn-success"
          :disabled="isEvaluating"
        >
          <i class="fas fa-check-circle"></i> Phù hợp
        </button>
        <button
          @click="evaluateCandidate(false)"
          class="btn btn-danger"
          :disabled="isEvaluating"
        >
          <i class="fas fa-times-circle"></i> Chưa phù hợp
        </button>
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
import { useRoute, useRouter } from "vue-router";
import { useApplyStore } from "@stores/useApplyStore";
import { toast } from "vue3-toastify";
import PdfEmbed from "vue-pdf-embed";

const applyJobStore = useApplyStore();
const route = useRoute();
const router = useRouter();

const intro = ref("");
const aiReview = ref("");
const pdfUrl = ref("");
const isEvaluating = ref(false);

const fetchCandidateDetail = async () => {
  const applyId = route.params.applyId;

  try {
    const candidate = await applyJobStore.fetchCandidateDetail(applyId);
    intro.value = candidate.coverLetter || "";
    aiReview.value = candidate.moderatorReview || "";

    // Lấy đường dẫn file
    let rawCvUrl = candidate.cvUpload || candidate.Candidates?.cvUrl;

    // Nếu có đường dẫn, loại bỏ tiền tố app/src/uploads/
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

const evaluateCandidate = async (isApproved) => {
  const applyId = route.params.applyId;
  isEvaluating.value = true;

  try {
    // Gọi API để cập nhật trạng thái đánh giá ứng viên
    await applyJobStore.evaluateCandidate(applyId, isApproved);

    // Hiển thị thông báo thành công
    toast.success(
      isApproved
        ? "Đã đánh giá ứng viên là phù hợp"
        : "Đã đánh giá ứng viên là chưa phù hợp"
    );

    // Chuyển hướng về trang danh sách công việc
    setTimeout(() => {
      router.push("/employer-dashboard/employer-workmanagement");
    }, 1500);
  } catch (error) {
    console.error("Lỗi khi đánh giá ứng viên:", error);
    toast.error("Không thể cập nhật đánh giá. Vui lòng thử lại sau.");
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
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

/* Link trở lại */
.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #0d6efd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #0a58ca;
  text-decoration: none;
}

/* Tiêu đề */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
}

/* Form group và label */
.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  outline: none;
}

/* Buttons Đánh giá */
.evaluation-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-success {
  background-color: #28a745;
  color: white;
  box-shadow: 0 4px 6px rgba(40, 167, 69, 0.2);
}

.btn-success:hover {
  background-color: #218838;
  box-shadow: 0 6px 8px rgba(40, 167, 69, 0.3);
  transform: translateY(-2px);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 4px 6px rgba(220, 53, 69, 0.2);
}

.btn-danger:hover {
  background-color: #c82333;
  box-shadow: 0 6px 8px rgba(220, 53, 69, 0.3);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* PDF Wrapper */
h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.pdf-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
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
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

/* Trạng thái loading */
.text-center i {
  font-size: 1.5rem;
  color: #0d6efd;
}

/* Trạng thái lỗi */
.alert-danger {
  font-size: 1rem;
  color: #721c24;
  background: #f8d7da;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-danger .btn-link {
  color: #721c24;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.alert-danger .btn-link:hover {
  color: #5a1a1f;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
    margin: 20px auto;
  }

  .title {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  textarea {
    font-size: 0.95rem;
  }

  label {
    font-size: 1rem;
  }

  .evaluation-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1rem;
    margin: 15px auto;
  }

  .title {
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .pdf-wrapper {
    max-height: 600px;
  }
}
</style>
