<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <!-- Header -->
        <div class="mb-4">
          <h2 class="mb-2">Thông tin nạp tiền</h2>
          <div>
            <router-link to="/" class="text-decoration-none text-muted"
              >Trở lại trang chủ?</router-link
            >
          </div>
        </div>

        <!-- Main Content -->
        <div class="card border-0 rounded-4">
          <div class="card-body p-4">
            <!-- Deposit Form -->
            <div class="mb-4">
              <h5 class="mb-3">Thông tin nạp tiền</h5>
              <p>
                Phương thức thanh toán: <strong>{{ paymentMethod }}</strong>
              </p>
            </div>

            <!-- Bonus Information -->
            <div class="alert alert-info bg-info bg-opacity-10 border-0 mb-4">
              <h6 class="text-info mb-2">Ưu đãi nạp tiền:</h6>
              <ul class="list-unstyled mb-0">
                <li class="mb-1">
                  • Nạp từ 100.000 đến dưới 1.000.000 tặng 10%
                </li>
                <li class="mb-1">
                  • Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%
                </li>
                <li class="mb-0">• Nạp từ 2.000.000 trở lên tặng 25%</li>
              </ul>
            </div>

            <!-- Quick Amount Selection -->
            <div class="mb-4">
              <h6 class="mb-3">Chọn nhanh số tiền cần nạp</h6>
              <div class="row g-2">
                <div
                  v-for="amount in quickAmounts"
                  :key="amount"
                  class="col-4 col-lg-3"
                >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="amount"
                      :id="'amount' + amount"
                      :value="amount"
                      v-model="selectedAmount"
                    />
                    <label
                      class="form-check-label w-100"
                      :for="'amount' + amount"
                    >
                      <div class="card border">
                        <div class="card-body p-2 text-center">
                          {{ formatNumber(amount) }}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Custom Amount Input -->
            <div class="mb-4">
              <h6 class="mb-3">Hoặc nhập số tiền cần nạp</h6>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="50.000"
                  v-model="customAmount"
                  @input="updateAmountFromInput"
                />
                <span class="input-group-text">đ</span>
              </div>
              <small v-if="errorAmount" class="text-danger d-block mt-1">{{
                errorAmount
              }}</small>
              <small class="text-muted d-block mt-1">{{ amountInWords }}</small>
            </div>

            <!-- Deposit Summary -->
            <div class="alert alert-info bg-info bg-opacity-10 border-0 mb-4">
              <h6 class="text-info mb-3">Thông tin nạp tiền</h6>
              <div class="d-flex justify-content-between mb-2">
                <span>Số tiền nạp</span>
                <span>{{ formatNumber(amount) }}đ</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Khuyến mãi</span>
                <span>+{{ formatNumber(bonus) }}đ</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Thực nhận</span>
                <span>{{ formatNumber(totalAmount) }}đ</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              class="btn btn-primary w-100"
              @click="deposit"
              :disabled="walletStore.isLoading || amount < 50000"
            >
              {{ walletStore.isLoading ? "Đang xử lý..." : "Tiếp tục" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWalletStore } from "@stores/useWalletStore";
import { toast } from "vue3-toastify";

export default {
  name: "DepositInfoView",
  setup() {
    const walletStore = useWalletStore();
    return { walletStore };
  },
  data() {
    return {
      paymentMethod: "",
      quickAmounts: [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000],
      selectedAmount: 50000,
      customAmount: "50000",
      amount: 50000,
      errorAmount: "",
      validPaymentMethods: ["MOMO", "ZALOPAY", "VNPAY"],
    };
  },
  computed: {
    bonus() {
      if (this.amount >= 2000000) return this.amount * 0.25;
      if (this.amount >= 1000000) return this.amount * 0.2;
      if (this.amount >= 100000) return this.amount * 0.1;
      return 0;
    },
    totalAmount() {
      return this.amount + this.bonus;
    },
    amountInWords() {
      const units = ["", "nghìn", "triệu"];
      let amount = this.amount;
      let words = [];
      let i = 0;

      while (amount > 0) {
        const part = amount % 1000;
        if (part > 0) {
          words.unshift(this.numberToWords(part) + " " + units[i]);
        }
        amount = Math.floor(amount / 1000);
        i++;
      }

      return words.length > 0 ? words.join(" ") + " đồng" : "không đồng";
    },
  },
  methods: {
    formatNumber(number) {
      return new Intl.NumberFormat("vi-VN").format(number);
    },
    numberToWords(number) {
      const ones = [
        "",
        "một",
        "hai",
        "ba",
        "bốn",
        "năm",
        "sáu",
        "bảy",
        "tám",
        "chín",
        "mười",
        "mười một",
        "mười hai",
        "mười ba",
        "mười bốn",
        "mười lăm",
        "mười sáu",
        "mười bảy",
        "mười tám",
        "mười chín",
      ];
      const tens = [
        "",
        "",
        "hai",
        "ba",
        "bốn",
        "năm",
        "sáu",
        "bảy",
        "tám",
        "chín",
      ];

      if (number < 20) return ones[number];
      if (number < 100) {
        const ten = Math.floor(number / 10);
        const unit = number % 10;
        return unit === 0
          ? tens[ten] + " mươi"
          : tens[ten] + " mươi " + ones[unit];
      }
      if (number < 1000) {
        const hundred = Math.floor(number / 100);
        const rest = number % 100;
        return (
          ones[hundred] +
          " trăm" +
          (rest > 0 ? " " + this.numberToWords(rest) : "")
        );
      }
      return number.toString();
    },
    updateAmountFromInput() {
      const cleaned = this.customAmount.replace(/[^0-9]/g, "");
      this.amount = cleaned ? parseInt(cleaned, 10) : 0;
      this.selectedAmount = null;

      // Kiểm tra số tiền hợp lệ
      if (this.amount < 50000) {
        this.errorAmount = "Số tiền nạp tối thiểu là 50.000đ!";
      } else {
        this.errorAmount = "";
      }
    },
    updateAmountFromQuick() {
      this.amount = this.selectedAmount;
      this.customAmount = this.formatNumber(this.amount);
      this.errorAmount = "";
    },
    async deposit() {
      try {
        if (this.amount < 50000) {
          toast.error("Số tiền nạp tối thiểu là 50.000đ!");
          return;
        }

        const payload = {
          amount: this.amount,
        };

        let redirectUrl;
        if (this.paymentMethod === "MOMO") {
          redirectUrl = await this.walletStore.depositMomo(payload);
        } else if (this.paymentMethod === "ZALOPAY") {
          redirectUrl = await this.walletStore.depositZalopay(payload);
        } else if (this.paymentMethod === "VNPAY") {
          redirectUrl = await this.walletStore.depositVnpay(payload);
        } else {
          toast.error("Phương thức thanh toán không hợp lệ!");
          return;
        }

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error("Lỗi khi nạp tiền:", error);
        toast.error("Lỗi khi nạp tiền. Vui lòng thử lại sau!");
      }
    },
    validatePaymentMethod() {
      const method = this.$route.query.paymentMethod;
      if (!method || !this.validPaymentMethods.includes(method)) {
        toast.error("Phương thức thanh toán không hợp lệ!");
        this.$router.push("/");
        return false;
      }
      return true;
    },
  },
  watch: {
    selectedAmount(newVal) {
      if (newVal) {
        this.updateAmountFromQuick();
      }
    },
  },
  mounted() {
    const isValid = this.validatePaymentMethod();
    if (isValid) {
      this.paymentMethod = this.$route.query.paymentMethod;
      this.updateAmountFromQuick();
    }
  },
};
</script>

<style scoped>
/* Container chính */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Tiêu đề */
h2.mb-2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

h5.mb-3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #0d6efd;
  display: inline-block;
  padding-bottom: 0.5rem;
}

h6.mb-3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
}

/* Link trở lại */
.text-muted {
  font-size: 0.9rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.text-muted:hover {
  color: #0d6efd;
  text-decoration: none !important;
}

/* Card chứa nội dung */
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

/* Thông tin ưu đãi và nạp tiền */
.alert-info {
  background: #e7f1ff !important;
  border-radius: 8px;
  padding: 1.25rem;
}

.alert-info h6 {
  font-weight: 600;
}

.alert-info ul li {
  font-size: 0.95rem;
  color: #333;
}

.alert-info .d-flex span:last-child {
  font-weight: 600;
  color: #0d6efd;
}

/* Chọn nhanh số tiền */
.form-check {
  margin-bottom: 0;
}

.form-check-input {
  display: none;
}

.form-check-label .card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.1s ease;
}

.form-check-input:checked + .form-check-label .card {
  border-color: #0d6efd !important;
  background-color: #f0f6ff;
  transform: scale(1.02);
}

.form-check-label .card:hover {
  border-color: #0d6efd !important;
  background-color: #f8f9fa;
  cursor: pointer;
  transform: scale(1.02);
}

.form-check-label .card-body {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  padding: 0.75rem;
}

/* Nhập số tiền tùy chỉnh */
.input-group {
  max-width: 300px;
}

.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
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

.input-group-text {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-radius: 0 8px 8px 0;
  font-size: 1rem;
  color: #666;
}

.text-muted.d-block {
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.5rem;
}

.text-danger.d-block {
  font-size: 0.85rem;
  color: #dc3545;
}

/* Nút Tiếp tục */
.btn-primary {
  background-color: #0d6efd;
  border: none;
  padding: 0.75rem;
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
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 0.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  h2.mb-2 {
    font-size: 1.5rem;
  }

  .input-group {
    max-width: 100%;
  }

  .col-4 {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }
}

@media (max-width: 576px) {
  .col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .form-check-label .card-body {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .btn-primary {
    font-size: 0.95rem;
  }
}
</style>
