<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="title">Thanh toán bài đăng</h1>
      <router-link to="/" class="back-link">Trở lại trang chủ?</router-link>
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

    <!-- Tiêu đề công việc -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h2 class="subtitle mb-4">Tiêu đề công việc</h2>

        <!-- Tóm tắt thông tin công việc -->
        <div class="row g-4 mb-4">
          <!-- Cột trái -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="label">Danh mục việc làm</label>
              <div class="info">{{ jobData.category || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Mức lương</label>
              <div class="info">{{ jobData.salary || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Kỹ năng</label>
              <div class="info">
                {{
                  jobData.skills && jobData.skills.length > 0
                    ? jobData.skills.join(", ")
                    : "Chưa chọn"
                }}
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Cấp bậc</label>
              <div class="info">{{ jobData.level || "Chưa chọn" }}</div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label class="label">Hình thức làm việc</label>
              <div class="info">{{ jobData.workType || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Số lượng người tuyển</label>
              <div class="info">{{ jobData.quantity || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Kinh nghiệm</label>
              <div class="info">{{ jobData.experience || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Ngày hết hạn ứng tuyển</label>
              <div class="info">{{ jobData.deadline || "Chưa chọn" }}</div>
            </div>
            <div class="form-group mb-3">
              <label class="label">Địa chỉ</label>
              <div class="info">{{ jobData.address || "Chưa chọn" }}</div>
            </div>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="payment-info mb-4">
          <h3 class="payment-title">
            Thông tin thanh toán (Giá dịch vụ: 1 ngày x 2.000Đ)
          </h3>
          <div class="d-flex align-items-center mt-3">
            <div class="form-check me-3">
              <input
                class="form-check-input"
                type="radio"
                id="totalPayment"
                value="total"
                v-model="paymentMethod"
                checked
              />
              <label class="form-check-label" for="totalPayment">
                Số tiền cần thanh toán: 20.000Đ
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="walletBalance"
                value="wallet"
                v-model="paymentMethod"
                disabled
              />
              <label class="form-check-label" for="walletBalance">
                Số dư ví: 50.000Đ
              </label>
            </div>
          </div>
        </div>

        <!-- Chọn phương thức thanh toán -->
        <div class="payment-method mb-4">
          <h3 class="payment-title">Chọn phương thức thanh toán</h3>
          <select
            class="form-control mt-3"
            v-model="selectedPaymentOption"
            disabled
          >
            <option value="" disabled>Chọn phương thức thanh toán</option>
            <option value="t">T</option>
          </select>
        </div>

        <!-- Nút Tiếp tục -->
        <div class="mt-4">
          <button
            type="button"
            class="btn btn-primary"
            @click="completePayment"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  name: "Payment",
  data() {
    return {
      jobData: {
        category: "Chưa chọn",
        salary: "Chưa chọn",
        skills: [],
        workType: "Chưa chọn",
        quantity: "Chưa chọn",
        experience: "Chưa chọn",
        level: "Chưa chọn",
        deadline: "Chưa chọn",
        address: "Chưa chọn",
      },
      paymentMethod: "total", // Phương thức thanh toán mặc định
      selectedPaymentOption: "t", // Phương thức thanh toán mặc định (giả định)
    };
  },
  created() {
    // Lấy dữ liệu công việc từ route params hoặc state (giả định)
    const jobData = this.$route.params.jobData;
    if (jobData) {
      this.jobData = { ...this.jobData, ...jobData };
    }
  },
  methods: {
    completePayment() {
      // Giả lập xử lý thanh toán
      toast.success(
        "Thanh toán thành công! Bài đăng của bạn đã được đăng tải."
      );
      // Chuyển hướng về trang chủ hoặc trang quản lý bài đăng
      setTimeout(() => {
        this.$router.push("/employer-dashboard");
      }, 1500);
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

.label {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
  display: block;
}

.info {
  font-size: 1rem;
  color: #333;
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* Thông tin thanh toán */
.payment-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-check-input {
  margin-top: 0.3rem;
}

.form-check-label {
  font-size: 1rem;
  color: #333;
}

/* Select phương thức thanh toán */
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

  .btn-primary {
    width: 100%;
    padding: 0.75rem;
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
}
</style>
