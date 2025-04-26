<template>
  <div class="error-container">
    <div class="error-card">
      <h4 class="brand-title">superio</h4>
      <h1 class="error-code">404!</h1>
      <p class="error-message">Trang bạn tìm kiếm không thể tìm thấy</p>
      <a href="/" class="home-button">Trở về trang chủ</a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap");

.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

.error-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  transition: transform 0.3s ease;
}

.error-card:hover {
  transform: translateY(-5px);
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: #dc3545;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.error-message {
  font-size: 1.1rem;
  color: #555555;
  margin: 20px 0 30px;
  line-height: 1.5;
}

.home-button {
  display: inline-block;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.home-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.home-button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .error-card {
    padding: 30px;
  }

  .error-code {
    font-size: 4.5rem;
  }

  .brand-title {
    font-size: 1.25rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .home-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .error-card {
    padding: 20px;
  }

  .error-code {
    font-size: 3.5rem;
  }

  .brand-title {
    font-size: 1rem;
  }

  .error-message {
    font-size: 0.9rem;
  }
}
</style>
