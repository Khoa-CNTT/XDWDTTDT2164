<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="title">Thanh toán bài đăng</h1>
      <router-link to="/" class="back-link">Trở lại trang chủ</router-link>
    </div>

    <!-- Tabs -->
    <div class="tabs mb-4">
      <div class="tab disabled">
        <i class="fas fa-briefcase me-2"></i>Chi tiết công việc
      </div>
      <div class="tab active">
        <i class="fas fa-credit-card me-2"></i>Thanh toán
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2">Đang tải thông tin...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="error-container">
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ errorMessage }}
      </div>
      <button @click="retryFetchJobDetail" class="btn btn-outline-primary mt-3">
        <i class="fas fa-sync-alt me-2"></i>Thử lại
      </button>
    </div>

    <!-- Main content -->
    <div v-else class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h2 class="subtitle mb-4">
          {{ jobData.title || "Tiêu đề công việc" }}
        </h2>

        <!-- Tóm tắt thông tin công việc -->
        <div class="row g-4 mb-4">
          <!-- Cột trái -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="label">Danh mục việc làm</label>
              <div class="info">
                {{ jobData.category || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Mức lương</label>
              <div class="info">
                {{ jobData.salary || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Kỹ năng</label>
              <div class="info">
                <span v-if="jobData.skills && jobData.skills.length > 0">
                  <span
                    v-for="(skill, index) in jobData.skills"
                    :key="index"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </span>
                <span v-else>Chưa chọn</span>
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Cấp bậc</label>
              <div class="info">
                {{ jobData.level || "Chưa chọn" }}
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="label">Hình thức làm việc</label>
              <div class="info">
                {{ jobData.workType || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Số lượng người tuyển</label>
              <div class="info">
                {{ jobData.quantity || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Kinh nghiệm</label>
              <div class="info">
                {{ jobData.experience || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Ngày hết hạn ứng tuyển</label>
              <div class="info">
                {{ formatDate(jobData.deadline) || "Chưa chọn" }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Địa chỉ</label>
              <div class="info">
                {{ jobData.address || "Chưa chọn" }}
              </div>
            </div>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="payment-info mb-4">
          <h3 class="payment-title">Thông tin thanh toán</h3>

          <div class="payment-details">
            <div class="payment-rate">
              Giá dịch vụ: <span class="fw-semibold">2.000Đ</span> / ngày
            </div>

            <div class="days-display mb-3">
              <label class="form-label">Thời gian đăng tuyển:</label>
              <div class="days-display-wrapper">
                <div class="days-value">
                  {{ paymentData.days }} ngày (đến
                  {{ formatDate(jobData.deadline) }})
                </div>
                <div class="total-amount">
                  Tổng:
                  <span class="amount-value">{{
                    formatCurrency(paymentData.amount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent="completePayment">
            <div class="wallet-info">
              <div class="d-flex align-items-center flex-wrap">
                <div class="form-group me-md-3">
                  <label for="paymentAmount">Số tiền cần thanh toán</label>
                  <div class="input-group">
                    <input
                      type="number"
                      id="paymentAmount"
                      v-model.number="paymentData.amount"
                      class="form-control"
                      required
                      aria-required="true"
                      readonly
                    />
                    <span class="input-group-text">Đ</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="walletBalance">Số dư ví</label>
                  <div class="input-group">
                    <input
                      type="text"
                      id="walletBalance"
                      :value="formatCurrency(walletBalance)"
                      class="form-control"
                      readonly
                      aria-readonly="true"
                    />
                    <span class="input-group-text">Đ</span>
                  </div>
                </div>
              </div>

              <div class="wallet-status mt-3">
                <div
                  v-if="paymentData.amount > walletBalance"
                  class="insufficient-funds"
                >
                  <i class="fas fa-exclamation-circle me-2"></i>
                  Số dư không đủ để thanh toán
                </div>
                <div v-else class="sufficient-funds">
                  <i class="fas fa-check-circle me-2"></i>
                  Đủ số dư để thanh toán
                </div>
              </div>

              <div class="mt-3">
                <router-link
                  to="/employer-dashboard/employer-recharge"
                  class="recharge-link"
                >
                  <i class="fas fa-wallet me-1"></i>Nạp tiền vào tài khoản
                </router-link>
              </div>
            </div>

            <div class="mt-4 d-flex justify-content-between align-items-center">
              <div class="payment-info-text">
                <small
                  >Bài đăng sẽ được hiển thị trong
                  {{ paymentData.days }} ngày</small
                >
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="
                  isSubmitting ||
                  paymentData.amount > walletBalance ||
                  paymentData.days <= 0
                "
              >
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...
                </span>
                <span v-else>
                  <i class="fas fa-check me-2"></i>Thanh toán
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { useJobStore } from "@stores/useJobStore";
import { useWalletStore } from "@stores/useWalletStore"; // Hypothetical wallet store

export default {
  name: "EmployerJobPayment",
  setup() {
    const jobStore = useJobStore();
    const walletStore = useWalletStore();
    return { jobStore, walletStore };
  },
  data() {
    return {
      jobData: {
        id: null,
        title: "",
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
      paymentData: {
        jobId: "",
        amount: 0,
        days: 0, // Will be calculated from expire date
      },
      walletBalance: 0, // Mock wallet balance; replace with walletStore
      isSubmitting: false,
      isLoading: true,
      hasError: false,
      errorMessage: "",
    };
  },
  async created() {
    try {
      this.isLoading = true;

      // Retrieve jobId from route params
      const jobId = this.$route.params.jobId;
      if (jobId) {
        this.paymentData.jobId = jobId;
        await this.fetchJobDetail(jobId);
      } else {
        this.hasError = true;
        this.errorMessage = "Không tìm thấy thông tin bài đăng";
        toast.error(this.errorMessage);
        return;
      }

      // Calculate days and payment amount based on expire date
      this.calculateDaysAndAmount();

      // Fetch wallet balance (uncomment when walletStore is implemented)
      // await this.walletStore.fetchWalletBalance();
      this.walletBalance = parseFloat(this.walletStore.wallet.balance) || 0;
    } catch (error) {
      this.hasError = true;
      this.errorMessage = "Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại.";
      toast.error(this.errorMessage);
      console.error("Error initializing payment page:", error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async fetchJobDetail(jobId) {
      try {
        this.hasError = false;
        await this.jobStore.fetchJobDetailForEmployer(jobId);
        if (this.jobStore.job) {
          this.jobData = {
            id: this.jobStore.job.id,
            title: this.jobStore.job.jobName || "Tiêu đề công việc",
            category: this.jobStore.job.Categories?.categoryName || "Chưa chọn",
            salary: this.jobStore.job.Salaries?.salaryName || "Chưa chọn",
            skills:
              this.jobStore.job.JobSkills?.map((s) => s.Skills.skillName) || [],
            workType: this.jobStore.job.JobTypes?.jobTypeName || "Chưa chọn",
            quantity: this.jobStore.job.numberOfRecruits || "Chưa chọn",
            experience:
              this.jobStore.job.Experiences?.experienceName || "Chưa chọn",
            level: this.jobStore.job.Ranks?.rankName || "Chưa chọn",
            deadline: this.jobStore.job.expire || "Chưa chọn",
            address: this.jobStore.job.address || "Chưa chọn",
          };
        } else {
          throw new Error("No job data returned");
        }
      } catch (error) {
        this.hasError = true;
        this.errorMessage = "Lỗi khi tải thông tin bài đăng";
        toast.error(this.errorMessage);
        console.error("Lỗi khi lấy chi tiết bài đăng:", error);
        throw error;
      }
    },
    async retryFetchJobDetail() {
      this.isLoading = true;
      this.hasError = false;
      try {
        await this.fetchJobDetail(this.paymentData.jobId);
        this.calculateDaysAndAmount();
      } catch (error) {
        this.hasError = true;
        this.errorMessage = "Lỗi khi tải lại thông tin bài đăng";
        toast.error(this.errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
    calculateDaysAndAmount() {
      // Calculate days from expire date
      if (!this.jobData.deadline || this.jobData.deadline === "Chưa chọn") {
        this.paymentData.days = 0;
        this.paymentData.amount = 0;
        this.hasError = true;
        this.errorMessage = "Ngày hết hạn không hợp lệ";
        toast.error(this.errorMessage);
        return;
      }

      try {
        const expireDate = new Date(this.jobData.deadline);
        const startDate = new Date(); // Use current date; replace with job.createdAt if available
        startDate.setHours(0, 0, 0, 0); // Normalize to start of day
        expireDate.setHours(0, 0, 0, 0); // Normalize to start of day

        // Calculate difference in days
        const timeDiff = expireDate - startDate;
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (days <= 0) {
          this.paymentData.days = 0;
          this.paymentData.amount = 0;
          this.hasError = true;
          this.errorMessage = "Ngày hết hạn phải sau ngày hiện tại";
          toast.error(this.errorMessage);
          return;
        }

        this.paymentData.days = days;
        this.paymentData.amount = days * 2000; // 2,000Đ per day
      } catch (error) {
        this.paymentData.days = 0;
        this.paymentData.amount = 0;
        this.hasError = true;
        this.errorMessage = "Lỗi khi tính toán thời gian đăng tuyển";
        toast.error(this.errorMessage);
        console.error("Error calculating days:", error);
      }
    },
    formatCurrency(value) {
      if (!value || (typeof value === "string" && value === "Chưa chọn"))
        return "Chưa chọn";
      return new Intl.NumberFormat("vi-VN").format(Number(value)) + "Đ";
    },
    formatDate(dateString) {
      if (!dateString || dateString === "Chưa chọn") return "Chưa chọn";
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      } catch (error) {
        return dateString;
      }
    },
    async completePayment() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      // Validate payment
      if (!this.paymentData.jobId) {
        toast.error("Không tìm thấy ID công việc!");
        this.isSubmitting = false;
        return;
      }
      if (this.paymentData.amount <= 0) {
        toast.error("Số tiền thanh toán không hợp lệ!");
        this.isSubmitting = false;
        return;
      }
      if (this.paymentData.days <= 0) {
        toast.error("Thời gian đăng tuyển không hợp lệ!");
        this.isSubmitting = false;
        return;
      }
      if (this.paymentData.amount > this.walletBalance) {
        toast.error("Số dư ví không đủ để thanh toán!");
        this.isSubmitting = false;
        return;
      }

      try {
        await this.jobStore.paymentJob(this.paymentData, this.$router);
        // Redirect to /employer-dashboard/employer-list is handled in jobStore.paymentJob
        this.$router.push("/employer-dashboard/employer-workmanagement");
      } catch (error) {
        toast.error("Lỗi khi thanh toán bài đăng!");
        console.error("Payment error:", error);
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
  background: #f8faff;
  border-radius: 16px;
}

/* Tiêu đề */
.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin-bottom: 0;
}

/* Link trở lại */
.back-link {
  font-size: 0.9rem;
  color: #4e73df;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.back-link:hover {
  color: #2e59d9;
  transform: translateX(-2px);
}

.back-link:before {
  content: "←";
  margin-right: 4px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6c757d;
  background: #e9ecef;
  cursor: not-allowed;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.tab.disabled {
  opacity: 0.7;
}

.tab.active {
  background: #eef2ff;
  color: #4e73df;
  cursor: default;
  border-color: #d1dcff;
  box-shadow: 0 2px 8px rgba(78, 115, 223, 0.1);
}

.tab i {
  font-size: 1rem;
  margin-right: 6px;
}

/* Loading and error states */
.loading-container,
.error-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Card chứa form */
.card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background: #fff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: none;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-body {
  padding: 2rem;
}

/* Tiêu đề phụ */
.subtitle {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #4e73df;
  display: inline-block;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Form group và label */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.info {
  font-size: 0.95rem;
  color: #333;
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: border-color 0.2s ease;
  min-height: 42px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info:hover {
  border-color: #c8d3e9;
}

/* Skill tags */
.skill-tag {
  display: inline-block;
  background: #eef2ff;
  color: #4e73df;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
  border: 1px solid #d1dcff;
}

/* Thông tin thanh toán */
.payment-info {
  background-color: #f8faff;
  border: 1px solid #d1dcff;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
}

.payment-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.5rem;
}

.payment-title:before {
  content: "💳";
  position: absolute;
  left: 0;
  top: 0;
}

.payment-details {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
}

.payment-rate {
  font-size: 1rem;
  color: #4e73df;
  margin-bottom: 1rem;
}

.days-display-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.days-value {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.total-amount {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: #eef2ff;
  border-radius: 8px;
  font-weight: 500;
}

.amount-value {
  color: #4e73df;
  font-weight: 700;
}

.wallet-info {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
}

.wallet-status {
  font-size: 0.9rem;
}

.insufficient-funds {
  color: #dc3545;
}

.sufficient-funds {
  color: #28a745;
}

.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #4e73df;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
  outline: none;
}

.form-control[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #e0e0e0;
  color: #495057;
}

/* Link nạp tiền */
.recharge-link {
  color: #4e73df;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
  display: inline-block;
}

.recharge-link:hover {
  color: #3a5fc8;
  text-decoration: underline;
}

/* Payment info text */
.payment-info-text {
  color: #6c757d;
}

/* Nút Thanh toán */
.btn-primary {
  background-color: #4e73df;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(78, 115, 223, 0.15);
}

.btn-primary:hover {
  background-color: #3a5fc8;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(78, 115, 223, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(78, 115, 223, 0.15);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.65;
}

/* Nút Thử lại */
.btn-outline-primary {
  border-color: #4e73df;
  color: #4e73df;
}

.btn-outline-primary:hover {
  background-color: #4e73df;
  color: white;
}

/* Row gap */
.row.g-4 {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.row.g-4 > div {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1.25rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .payment-info {
    padding: 1.25rem;
  }

  .days-display-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .total-amount {
    margin-top: 0.5rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 1.25rem 0.75rem;
  }

  .title {
    font-size: 1.35rem;
  }

  .tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .payment-info {
    padding: 1rem;
    margin-top: 1.5rem;
  }

  .wallet-info {
    padding: 0.75rem;
  }

  .payment-details {
    padding: 0.75rem;
  }

  .d-flex.align-items-center {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .form-group {
    width: 100%;
    margin-right: 0 !important;
  }

  .recharge-link {
    margin-top: 0.75rem;
  }

  .mt-4.d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-primary {
    width: 100%;
    padding: 0.7rem;
  }
}
</style>
