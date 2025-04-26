<template>
  <div class="job-board">
    <!-- Slide -->
    <section class="banner-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <h1 class="banner-title">
              Có <span class="highlight">93.178</span> Bài Đăng Ở Đây Cho Bạn!
            </h1>
            <p class="banner-desc">Tìm việc làm và cơ hội nghề nghiệp</p>
            <div class="search-form">
              <input
                type="text"
                class="search-input"
                placeholder="Tìm kiếm việc làm..."
              />
              <button class="search-button">Tìm việc</button>
            </div>
          </div>
          <div class="col-lg-6">
            <img
              alt="Người chuyên nghiệp"
              class="banner-image"
              src="../../../src/assets/images/banner-person-1.png"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Danh mục Công việc phổ biến -->
    <section class="category-section">
      <div class="container">
        <h2 class="section-title text-center">Danh mục công việc phổ biến</h2>
        <div class="row">
          <div
            class="col-lg-4 col-md-6 mb-4"
            v-for="(category, index) in categories"
            :key="index"
          >
            <div class="category-card">
              <i class="fas fa-briefcase category-icon"></i>
              <div>
                <h5 class="category-name">{{ category.name }}</h5>
                <p class="category-jobs">
                  ({{ category.jobs }} vị trí đăng mới)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Công việc phổ biến -->
    <section class="jobs-section">
      <div class="container">
        <h2 class="section-title text-center">Công việc phổ biến</h2>
        <p class="section-desc text-center">
          Biết giá trị của bạn và tìm được công việc đáp ứng điều kiện cuộc sống
          của bạn
        </p>
        <div class="row">
          <div
            class="col-lg-4 col-md-6 mb-4"
            v-for="(job, index) in jobs"
            :key="index"
          >
            <div class="job-card">
              <div class="job-info">
                <img
                  alt="Logo công ty"
                  class="job-logo"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXZlaUXIWozu3xqknYB3S9nknCPGFPAEVZLA&s"
                />
                <div>
                  <h5 class="job-title">{{ job.title }}</h5>
                  <p class="job-meta">
                    <i class="fa-regular fa-building"></i> {{ job.company }} -
                    <i class="fa-solid fa-location-dot"></i>
                    {{ job.location }} -
                    <i class="fa-solid fa-sack-dollar"></i> {{ job.salary }}
                  </p>
                  <p class="job-time">
                    <i class="fa-solid fa-clock"></i> {{ job.time }}
                  </p>
                </div>
              </div>
              <div class="job-badges">
                <span class="badge badge-type">{{ job.type }}</span>
                <span class="badge badge-status">{{ job.status }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="view-more-button">Xem thêm</button>
        </div>
      </div>
    </section>

    <!-- Lời chứng thực -->
    <section class="testimonial-section">
      <div class="container">
        <h2 class="section-title text-center">Lời chứng thực từ khách hàng</h2>
        <div class="row">
          <div
            class="col-lg-4 mb-4"
            v-for="(testimonial, index) in testimonials"
            :key="index"
          >
            <div class="testimonial-card">
              <h5 class="testimonial-title">{{ testimonial.title }}</h5>
              <p class="testimonial-content">{{ testimonial.content }}</p>
              <div class="testimonial-author">
                <img
                  alt="Ảnh khách hàng"
                  class="author-image"
                  src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"
                />
                <div>
                  <p class="author-name">{{ testimonial.name }}</p>
                  <p class="author-position">{{ testimonial.position }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-5 mb-lg-0">
            <img
              alt="Người làm việc trên laptop"
              class="cta-image"
              src="../../../src/assets/images/woman-working.jpg"
            />
          </div>
          <div class="col-lg-6">
            <h2 class="section-title">
              Hàng triệu công việc. Tìm người phù hợp với bạn
            </h2>
            <p class="section-desc">
              Tìm kiếm tất cả các vị trí mở trên web. Nhận được chất lượng ứng
              viên hàng đầu. Đọc đánh giá và hơn 600.000 công ty trên toàn thế
              giới
            </p>
            <button class="cta-button">Bắt đầu</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "SuperioJobBoard",
  data() {
    return {
      categories: [
        { name: "Kế toán / Tài chính", jobs: 2 },
        { name: "Công nghệ thông tin", jobs: 15 },
        { name: "Marketing", jobs: 8 },
        { name: "Nhân sự", jobs: 5 },
        { name: "Thiết kế đồ họa", jobs: 7 },
        { name: "Kinh doanh", jobs: 12 },
        { name: "Marketing", jobs: 8 },
        { name: "Nhân sự", jobs: 5 },
        { name: "Thiết kế đồ họa", jobs: 7 },
      ],
      jobs: [
        {
          title: "Kỹ sư phần mềm (Android), Libraries",
          company: "Phân đoạn",
          location: "Đà Nẵng",
          time: "11 giờ trước",
          salary: "35 - 45 Triệu",
          type: "Toàn thời gian",
          status: "Cấp bách",
        },
        {
          title: "Lập trình viên Frontend cao cấp",
          company: "Công ty ABC",
          location: "Hồ Chí Minh",
          time: "1 ngày trước",
          salary: "40 - 50 Triệu",
          type: "Toàn thời gian",
          status: "Mới",
        },
        {
          title: "Quản lý sản phẩm",
          company: "Công ty XYZ",
          location: "Hà Nội",
          time: "2 ngày trước",
          salary: "45 - 60 Triệu",
          type: "Toàn thời gian",
          status: "Nổi bật",
        },
      ],
      testimonials: [
        {
          title: "Thiết kế tuyệt vời",
          content:
            "Nhờ nền tảng này, tôi đã tìm được công việc mơ ước chỉ trong thời gian ngắn. Giao diện thân thiện và đội ngũ hỗ trợ rất chuyên nghiệp!",
          name: "Thái Mai Quang",
          position: "Lập trình viên Web",
        },
        {
          title: "Dịch vụ tuyệt vời",
          content:
            "Tôi đã tìm được công việc lý tưởng qua nền tảng này. Quy trình mượt mà và hiệu quả. Rất khuyến khích cho bất kỳ ai đang tìm cơ hội việc làm chất lượng.",
          name: "Nguyễn Văn A",
          position: "Nhà thiết kế UX",
        },
        {
          title: "Hỗ trợ xuất sắc",
          content:
            "Đội ngũ chăm sóc khách hàng rất tận tâm trong suốt hành trình tìm việc của tôi. Họ cung cấp lời khuyên quý giá và kết nối tôi với các nhà tuyển dụng tuyệt vời.",
          name: "Trần Thị B",
          position: "Chuyên viên Marketing",
        },
      ],
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

.job-board {
  font-family: "Poppins", Arial, sans-serif;
  background-color: #f8f9fa;
}

/* Banner Section */
.banner-section {
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  padding: 60px 0;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 20px;
}

.banner-title .highlight {
  color: #007bff;
}

.banner-desc {
  font-size: 1.2rem;
  color: #555555;
  margin-bottom: 30px;
}

.search-form {
  display: flex;
  gap: 10px;
  max-width: 500px;
}

.search-input {
  padding: 12px 20px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  flex-grow: 1;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.search-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.search-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.banner-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* Category Section */
.category-section {
  padding: 60px 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 40px;
}

.category-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 2rem;
  color: #007bff;
  margin-right: 20px;
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.category-jobs {
  font-size: 0.9rem;
  color: #555555;
  margin: 0;
}

/* Jobs Section */
.jobs-section {
  padding: 60px 0;
  background: #f1f3f5;
}

.section-desc {
  font-size: 1.2rem;
  color: #555555;
  margin-bottom: 40px;
}

.job-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.job-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.job-meta,
.job-time {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 5px 0 0;
}

.job-meta i,
.job-time i {
  margin-right: 5px;
}

.job-badges {
  display: flex;
  gap: 10px;
}

.badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-type {
  background: #007bff;
  color: #ffffff;
}

.badge-status {
  background: #ffc107;
  color: #333333;
}

.view-more-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.view-more-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Testimonial Section */
.testimonial-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #ffffff;
}

.testimonial-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #333333;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.testimonial-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 15px;
}

.testimonial-content {
  font-size: 1rem;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 20px;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.author-position {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 60px 0;
}

.cta-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cta-button {
  padding: 12px 30px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.cta-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 992px) {
  .banner-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .job-card,
  .category-card,
  .testimonial-card {
    padding: 15px;
  }

  .job-logo {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .banner-section {
    padding: 40px 0;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-desc {
    font-size: 1rem;
  }

  .search-form {
    flex-direction: column;
  }

  .search-input,
  .search-button {
    width: 100%;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-desc {
    font-size: 1rem;
  }

  .job-title,
  .category-name,
  .testimonial-title {
    font-size: 1.1rem;
  }

  .job-meta,
  .job-time,
  .category-jobs,
  .testimonial-content {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .banner-title {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .job-card,
  .category-card,
  .testimonial-card {
    padding: 10px;
  }

  .job-logo {
    width: 40px;
    height: 40px;
  }

  .cta-image {
    margin-bottom: 20px;
  }
}
</style>
