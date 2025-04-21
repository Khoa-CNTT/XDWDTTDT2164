<template>
  <div class="deposit-container">
    <div class="deposit-card">
      <!-- Header -->
      <div class="deposit-header">
        <h2 class="deposit-title">Nạp tiền vào tài khoản</h2>
        <div>
          <router-link to="/" class="back-link">
            <i class="fas fa-arrow-left"></i> Trở lại trang chủ
          </router-link>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-card">
        <div class="card-content">
          <!-- Deposit Form -->
          <div class="section-header">
            <h5>Nạp tiền vào tài khoản</h5>
          </div>

          <!-- Bonus Information -->
          <div class="bonus-card">
            <h6 class="bonus-title">
              <i class="fas fa-gift"></i> Ưu đãi nạp tiền:
            </h6>
            <ul class="bonus-list">
              <li>
                <span class="bullet">•</span> Nạp từ 100.000 đến dưới 1.000.000
                tặng <span class="highlight">10%</span>
              </li>
              <li>
                <span class="bullet">•</span> Nạp từ 1.000.000 đến dưới
                2.000.000 tặng <span class="highlight">20%</span>
              </li>
              <li>
                <span class="bullet">•</span> Nạp từ 2.000.000 trở lên tặng
                <span class="highlight">25%</span>
              </li>
            </ul>
          </div>

          <!-- Payment Methods -->
          <div class="payment-section">
            <h6 class="payment-title">
              <i class="fas fa-credit-card"></i> Chọn phương thức nạp tiền
            </h6>

            <!-- MOMO -->
            <div class="payment-option" @click="selectPaymentMethod('MOMO')">
              <div class="payment-content">
                <div class="payment-info">
                  <div class="payment-name">Ví điện tử MOMO</div>
                </div>
                <div class="payment-logo">
                  <img
                    src="https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0"
                    alt="MOMO"
                  />
                </div>
              </div>
            </div>

            <!-- ZALOPAY -->
            <div class="payment-option" @click="selectPaymentMethod('ZALOPAY')">
              <div class="payment-content">
                <div class="payment-info">
                  <div class="payment-name">Ví điện tử ZALOPAY</div>
                </div>
                <div class="payment-logo">
                  <img
                    src="https://play-lh.googleusercontent.com/woYAzPCG1I8Z8HXCsdH3diL7oly0N8uth_1g6k7R_9Gu7lbxrsYeriEXLecRG2E9rP0"
                    alt="ZALOPAY"
                  />
                </div>
              </div>
            </div>

            <!-- VNPAY -->
            <div class="payment-option" @click="selectPaymentMethod('VNPAY')">
              <div class="payment-content">
                <div class="payment-info">
                  <div class="payment-name">Ví điện tử VNPAY</div>
                </div>
                <div class="payment-logo">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                    alt="VNPAY"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepositView",
  methods: {
    selectPaymentMethod(method) {
      // Chuyển hướng đến DepositInfoView với phương thức thanh toán
      this.$router.push({
        path: "/employer-dashboard/employer-depositinformation",
        query: { paymentMethod: method },
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

* {
  font-family: "Roboto", sans-serif;
}

.deposit-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.deposit-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.deposit-header {
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 12px 12px 0 0;
}

.deposit-title {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;
}

.back-link:hover {
  color: white;
}

.back-link i {
  margin-right: 6px;
  font-size: 0.8rem;
}

.main-card {
  background-color: white;
  border-radius: 8px;
  margin: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
}

.card-content {
  padding: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-header h5:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 40px;
  background: #4e73df;
  border-radius: 3px;
}

.bonus-card {
  background: rgba(13, 110, 253, 0.06);
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #0d6efd;
}

.bonus-title {
  color: #0d6efd;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
}

.bonus-title i {
  margin-right: 8px;
}

.bonus-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.bonus-list li {
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  color: #495057;
}

.bullet {
  color: #0d6efd;
  font-weight: bold;
  margin-right: 8px;
  font-size: 1.1rem;
}

.highlight {
  font-weight: 600;
  color: #0d6efd;
}

.payment-section {
  margin-top: 1.5rem;
}

.payment-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.payment-title i {
  margin-right: 8px;
}

.payment-option {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.payment-option:hover {
  border-color: #4e73df;
  box-shadow: 0 5px 15px rgba(78, 115, 223, 0.1);
  transform: translateY(-2px);
}

.payment-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
}

.payment-info {
  display: flex;
  flex-direction: column;
}

.payment-name {
  font-weight: 500;
  font-size: 1rem;
  color: #495057;
}

.payment-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-logo img {
  height: 32px;
  width: auto;
  border-radius: 4px;
  object-fit: contain;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .deposit-container {
    padding: 1rem 0.5rem;
  }

  .deposit-header {
    padding: 1.2rem 1.5rem;
  }

  .main-card {
    margin: 1rem;
  }

  .card-content {
    padding: 1.2rem;
  }
}
</style>
