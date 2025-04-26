<template>
  <div class="terms-page">
    <!-- Header -->
    <div class="header-section text-center">
      <h1 class="header-title">Điều khoản và điều kiện</h1>
      <nav class="breadcrumb-nav">
        <a href="/" class="breadcrumb-link">Trang chủ</a> / Điều khoản và điều
        kiện
      </nav>
    </div>

    <!-- Terms Content -->
    <div class="terms-content">
      <div class="terms-section">
        <h4 class="section-title">1. Điều kiện sử dụng</h4>
        <p class="section-text">
          Để sử dụng dịch vụ của chúng tôi, bạn phải đồng ý với các điều khoản
          được liệt kê trong tài liệu này. Bạn cần có tài khoản hợp lệ và cung
          cấp thông tin chính xác, bao gồm email và thông tin cá nhân cần thiết.
          Chúng tôi có quyền từ chối cung cấp dịch vụ nếu phát hiện hành vi vi
          phạm hoặc thông tin không chính xác.
        </p>
        <p class="section-text">
          Người dùng phải tuân thủ các quy định pháp luật hiện hành tại Việt Nam
          khi sử dụng nền tảng. Mọi hành vi sử dụng dịch vụ để thực hiện các
          hoạt động bất hợp pháp, như lừa đảo hoặc phát tán nội dung không phù
          hợp, sẽ bị chấm dứt tài khoản ngay lập tức.
        </p>
      </div>

      <div class="terms-section">
        <h4 class="section-title">2. Giới hạn trách nhiệm</h4>
        <p class="section-text">
          Chúng tôi nỗ lực đảm bảo dịch vụ hoạt động ổn định, nhưng không chịu
          trách nhiệm cho các sự cố ngoài tầm kiểm soát, như lỗi hệ thống do
          thiên tai, mất kết nối internet, hoặc tấn công mạng. Thông tin việc
          làm và hồ sơ trên nền tảng được cung cấp bởi người dùng và nhà tuyển
          dụng, chúng tôi không bảo đảm tính chính xác 100%.
        </p>
        <p class="section-text">
          Người dùng chịu trách nhiệm bảo mật thông tin tài khoản của mình.
          Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ
          việc mất mật khẩu hoặc truy cập trái phép do sơ suất của người dùng.
        </p>
      </div>

      <div class="terms-section">
        <h4 class="section-title">3. Sửa đổi điều khoản</h4>
        <p class="section-text">
          Chúng tôi có quyền sửa đổi hoặc cập nhật điều khoản này bất kỳ lúc nào
          để phù hợp với quy định pháp luật hoặc cải thiện dịch vụ. Các thay đổi
          sẽ được thông báo qua email hoặc thông báo trên nền tảng ít nhất 7
          ngày trước khi có hiệu lực.
        </p>
        <p class="section-text">
          Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được sửa đổi đồng
          nghĩa với việc bạn chấp nhận các thay đổi đó. Nếu không đồng ý, bạn có
          thể ngừng sử dụng dịch vụ và liên hệ với chúng tôi để đóng tài khoản.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

.terms-page {
  font-family: "Poppins", Arial, sans-serif;
  background-color: #f8f9fa;
  padding: 40px 20px;
}

/* Header */
.header-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #ffffff;
  margin-bottom: 40px;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.breadcrumb-nav {
  font-size: 1rem;
  color: #e9ecef;
}

.breadcrumb-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #f8f9fa;
  text-decoration: underline;
}

/* Terms Content */
.terms-content {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.terms-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 15px;
}

.section-text {
  font-size: 1rem;
  color: #555555;
  line-height: 1.8;
  margin-bottom: 15px;
}

/* Responsive */
@media (max-width: 992px) {
  .header-title {
    font-size: 2rem;
  }

  .terms-content {
    padding: 30px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 30px 0;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .breadcrumb-nav {
    font-size: 0.9rem;
  }

  .terms-content {
    padding: 20px;
    margin: 0 15px;
  }

  .section-title {
    font-size: 1.4rem;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.5rem;
  }

  .breadcrumb-nav {
    font-size: 0.85rem;
  }

  .terms-content {
    padding: 15px;
    margin: 0 10px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .section-text {
    font-size: 0.85rem;
  }
}
</style>
