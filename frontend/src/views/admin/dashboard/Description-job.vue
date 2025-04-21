<template>
  <div class="description-job">
    <h2>Xem Chi Tiết Bài Đăng</h2>
    <router-link to="/admin-dashboard/post-management">
      <div>Quay trở lại?</div>
    </router-link>
    <div class="card mt-5">
      <div class="card-header text-center">
        <h1><b>Mô Tả Chi Tiết Công Việc</b></h1>
      </div>
      <div class="card-body">
        <div class="d-flex align-items-center">
          <img
            class="img-logo me-3"
            style="border: 1px solid black; border-radius: 30px"
            src="https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/b/AmazonStores/ATVPDKIKX0DER/2cd67b908ca9f725c502916b6c93e507.w750.h432._CR0%2C0%2C750%2C432_SX3000_.png"
            alt="logo-company"
          />
          <div>
            <h4 class="mt-2"><b>Công Ty Superio</b></h4>
            <p>
              Địa chỉ:
              <span class="text-secondary"
                >239 Tố Hữu, Phường Khuê Trung, Quận Cẩm Lệ, TP Đà Nẵng</span
              >
            </p>
            <p>Phone: <span class="text-secondary"> 0909090909</span></p>
            <p>Email: <span class="text-secondary"> superio@gmail.com</span></p>
          </div>
        </div>
        <hr />
        <div class="mt-4">
          <h4>Tiêu Đề Công Việc:</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>
        <div class="mt-4">
          <h4>Mô Tả Công Việc:</h4>
          <textarea class="form-control" rows="5">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</textarea
          >
        </div>
        <hr />
        <div class="mt-4">
          <h4>Yêu Cầu Công Việc:</h4>
          <div class="row">
            <div class="col-6 mt-2">
              <label>Danh mục việc làm</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="Điền danh mục việc làm"
              />
              <label>Mức lương</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="30-45 triệu"
              />
              <label>Kỹ năng</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="React, Vue, Angular"
              />
              <label>Cấp bậc</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="Fresher, Junior, Senior"
              />
            </div>
            <div class="col-6 mt-2">
              <label>Hình thức việc làm</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="Full-time, Part-time, Freelance"
              />
              <label>Số lượng người tuyển</label>
              <input type="text" class="form-control mt-2" placeholder="4" />
              <label>Kinh nghiệm</label>
              <input
                type="text"
                class="form-control mt-2"
                placeholder="1 năm"
              />
              <label>Ngày hết hạn ứng tuyển</label>
              <input
                type="date"
                class="form-control mt-2"
                placeholder="01-07-2025"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-end">
        <button class="btn btn-outline-success me-2">Duyệt</button>
        <button class="btn btn-outline-danger">Từ chối</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobDetailView",
};
</script>

<style scoped>
/* General container */
.description-job {
  padding: 30px;
  max-width: 100%;
  background: #f8fafc; /* Light background for depth */
  border-radius: 12px;
  min-height: 100vh;
}

/* Header */
h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b; /* Dark slate for contrast */
  margin-bottom: 15px;
}

.description-job a {
  font-size: 0.95rem;
  color: #2563eb; /* Vibrant blue */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.description-job a:hover {
  color: #1e40af; /* Darker blue on hover */
  transform: translateX(-3px); /* Subtle shift */
}

.description-job a::before {
  content: "\f060"; /* Font Awesome arrow-left */
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  font-size: 0.9rem;
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* Soft shadow */
  background: #ffffff;
  margin-top: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px); /* Subtle lift on hover */
}

.card-header {
  background: #eff6ff; /* Light blue header */
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.card-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 25px;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding: 15px 20px;
  background: #ffffff;
}

/* Company info */
.d-flex.align-items-center {
  gap: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.img-logo {
  width: 200px; /* Reduced for better proportionality */
  height: 120px;
  object-fit: cover; /* Ensure image fits nicely */
  border: 1px solid #e2e8f0; /* Light gray border */
  border-radius: 12px; /* Rounded corners */
  transition: transform 0.3s ease;
}

.img-logo:hover {
  transform: scale(1.05); /* Subtle zoom on hover */
}

.card-body h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.card-body p {
  font-size: 0.95rem;
  color: #475569; /* Slate gray */
  margin-bottom: 8px;
}

.card-body p .text-secondary {
  color: #64748b; /* Muted slate */
}

/* Divider */
hr {
  border-top: 1px solid #e2e8f0;
  margin: 20px 0;
}

/* Job details */
.mt-4 {
  margin-top: 20px;
}

.form-control,
.form-control:disabled {
  border: 1px solid #d1d5db; /* Light gray */
  border-radius: 8px;
  padding: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #f8fafc; /* Light background for textarea */
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}

textarea.form-control {
  resize: vertical; /* Allow vertical resizing only */
  min-height: 100px;
}

/* Form inputs */
.row {
  gap: 15px;
}

.col-6 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
}

/* Footer buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 10px 20px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-outline-success {
  border-color: #10b981; /* Green */
  color: #10b981;
}

.btn-outline-success:hover {
  background: #10b981;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.2);
}

.btn-outline-danger {
  border-color: #ef4444; /* Red */
  color: #ef4444;
}

.btn-outline-danger:hover {
  background: #ef4444;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(239, 68, 68, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .description-job {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 15px;
  }

  .card-header h1 {
    font-size: 1.25rem;
  }

  .img-logo {
    width: 150px;
    height: 90px;
  }

  .row {
    flex-direction: column; /* Stack form inputs */
  }

  .col-6 {
    width: 100%; /* Full-width inputs */
  }

  .btn {
    width: 100%; /* Full-width buttons */
    margin-bottom: 10px;
  }
}

@media (max-width: 576px) {
  .card-body h4 {
    font-size: 1.1rem;
  }

  .card-body p,
  .form-control,
  label {
    font-size: 0.9rem;
  }

  .img-logo {
    width: 120px;
    height: 72px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>
