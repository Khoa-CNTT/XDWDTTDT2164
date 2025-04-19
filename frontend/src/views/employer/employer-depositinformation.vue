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
              <small class="text-muted">{{ amountInWords }}</small>
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
              :disabled="walletStore.isLoading"
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
    },
    updateAmountFromQuick() {
      this.amount = this.selectedAmount;
      this.customAmount = this.formatNumber(this.amount);
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
          console.log("Gửi yêu cầu nạp tiền qua VNPAY:", payload);
          toast.success("Yêu cầu nạp tiền thành công! Đang chuyển hướng...");
          return;
        } else {
          toast.error("Phương thức thanh toán không hợp lệ!");
          return;
        }

        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error("Lỗi khi nạp tiền:", error);
      }
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
    this.paymentMethod = this.$route.query.paymentMethod || "Không xác định";
    this.updateAmountFromQuick();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.form-check-input {
  display: none;
}

.form-check-input:checked + .form-check-label .card {
  border-color: #0d6efd !important;
  background-color: #f8f9fa;
}

.card:hover {
  border-color: #0d6efd !important;
  cursor: pointer;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
