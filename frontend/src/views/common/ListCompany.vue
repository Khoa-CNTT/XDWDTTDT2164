<template>
  <section class="job-header mb-5" style="background-color: #f3f6fd;">
    <div class="container text-center">
      <div class="ms-3">
        <h1>Danh Sách Công Ty</h1>
        <div class="text-center d-flex justify-content-center">
          <a href="/" class="me-2">Trang Chủ</a> / <p class="ms-2">Danh sách công ty</p>
        </div>
      </div>
    </div>
  </section>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3">
        <!-- Sidebar -->
        <div class="card mb-4" style="background-color: #edf1fc;">
          <div class="mt-2 ms-4">
            <h5 class="mb-0 mt-4">Tìm kiếm bằng từ khóa</h5>
          </div>
          <div class="card-body">
            <input type="text" class="form-control" placeholder="Tên công việc, kỹ năng..." />
          </div>
          <div class="mt-2 ms-4">
            <h5 class="mb-0">Địa chỉ</h5>
          </div>
          <div class="card-body">
            <select class="form-select">
              <option value="">Chọn tỉnh thành phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            </select>
          </div>
          <div class="mt-2 ms-4">
            <h5 class="mb-0">Danh mục việc làm</h5>
          </div>
          <div class="card-body mb-3">
            <select class="form-select">
              <option value="">Chọn danh mục việc làm</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <!-- Job Listings -->
        <div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <p>Hiển thị <b>10</b> công việc</p>
            <div>
              <select class="form-select d-inline-block w-auto me-2">
                <option value="newest">Mới nhất</option>
                <option value="salary">Lương cao nhất</option>
              </select>
              <select class="form-select d-inline-block w-auto">
                <option value="newest">Tất cả</option>
                <option value="salary">Option 1</option>
              </select>
            </div>
          </div>
          <div class="list-group">
            <div class=" card">
              <div class="card-body">
                <section class="mb-3 mt-3">
                  <div class="container d-flex justify-content-between">
                    <div class="d-flex">
                      <img class="me-3" src="https://d1coqmn8qm80r4.cloudfront.net/bwesyjd8klsnvm22n5yj3rvufveq"
                        style="width: 100px;  height: 100px; border-radius: 50%;">
                      <div class="ms-3">
                        <a href="#">
                          <h5 class="mb-3">Software Engineer (Android), Libraries</h5>
                        </a>
                        <div class=" d-flex">
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-briefcase me-2"></i>
                              Phân đoạn</span></h5>
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-location-dot me-2"></i>
                              Đà Nẵng</span></h5>
                        </div>
                      </div>
                    </div>
                    <div class="mt-3">
                      <button class="btn btn-outline-primary btn-sm me-2" style="padding: 10px 10px;"><i
                          class="fa-solid fa-bookmark"></i> Lưu</button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <nav class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <button class="page-link">Trước</button>
              </li>
              <li class="page-item active">
                <button class="page-link">1</button>
              </li>
              <li class="page-item">
                <button class="page-link">2</button>
              </li>
              <li class="page-item">
                <button class="page-link">3</button>
              </li>
              <li class="page-item">
                <button class="page-link">Sau</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      salaryRange: 0,
    }
  },
  computed: {
    rangeProgress() {
      return (this.salaryRange / 2000) * 100;
    }
  },
  methods: {
    updateSalary() {
      // Có thể thêm logic xử lý khác nếu cần
    },
  }
}
</script>
<style scoped>
.card-header {
  background-color: #f8f9fa;
  font-weight: bold;
}

.list-group-item {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.job-header {
  padding: 2rem 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

/* Tùy chỉnh range input */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #ddd;
  outline: none;
}

/* Thanh trượt - WebKit (Chrome, Safari) */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4e6ef2;
  cursor: pointer;
  margin-top: -6px;
}

/* Thanh trượt - Mozilla (Firefox) */
input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4e6ef2;
  cursor: pointer;
}

/* Thanh trượt - Microsoft (Edge) */
input[type="range"]::-ms-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4e6ef2;
  cursor: pointer;
}

/* Tô màu phần đã kéo */
input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  background: linear-gradient(to right, #4e6ef2 0%, #4e6ef2 var(--range-progress), #ddd var(--range-progress), #ddd 100%);
}

input[type="range"]::-moz-range-track {
  height: 8px;
  background: linear-gradient(to right, #4e6ef2 0%, #4e6ef2 var(--range-progress), #ddd var(--range-progress), #ddd 100%);
}

input[type="range"]::-ms-track {
  height: 8px;
  background: linear-gradient(to right, #4e6ef2 0%, #4e6ef2 var(--range-progress), #ddd var(--range-progress), #ddd 100%);
}

.job-overview-card .card-title {
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #212529;
}

/* Style cho thẻ a */
a {
  color: #000;
  /* Màu đen */
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #0066cc;
  /* Xanh dương */
}
</style>