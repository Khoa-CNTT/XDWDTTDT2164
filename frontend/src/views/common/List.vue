<template>
  <section class="job-header mb-5" style="background-color: #f3f6fd;">
    <div class="container text-center">
      <div class="ms-3">
        <h1>Tìm Việc Làm</h1>
        <div class="text-center d-flex justify-content-center">
          <a href="/" class="me-2">Trang Chủ</a> / <p class="ms-2">Danh sách công việc</p>
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
          <div class="card-body">
            <input type="text" class="form-control" placeholder="Chọn danh mục việc làm" />
          </div>
          <div class="mt-2 ms-2">
            <div>
              <h5 class="mb-0 ms-3 mt-2">Hình thức làm việc</h5>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Freelance</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Full Time</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Part Time</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Temporaly</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-2 ms-2">
            <div>
              <h5 class="mb-0 ms-3 mt-2">Ngày đăng</h5>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Tất cả </label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">24 giờ qua</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">7 ngày qua</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">14 ngày qua</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-2 ms-2">
            <div>
              <h5 class="mb-0 ms-3 mt-2">Cấp độ kinh nghiệm</h5>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Intern</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">Fresh</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">1 year</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">2 year</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label class="ms-2">3 year</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="ms-4">
            <h5 class="mb-0">Mức lương</h5>
          </div>
          <div class="card-body">
            <input type="range" class="form-range" min="0" max="2000" step="100" v-model="salaryRange"
              :style="{ '--range-progress': rangeProgress + '%' }" @input="updateSalary" />
            <p class="text-center">${{ salaryRange }}</p>
          </div>
          <div class="mt-2 ms-2 mb-5">
            <h5 class="mb-0 ms-3">Tags</h5>
            <button class="badge bg-large text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
            <button class="badge text-dark mt-2 ms-2">App</button>
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
                <section class="mb-5 mt-3">
                  <div class="container d-flex justify-content-between">
                    <div class="d-flex">
                      <img class="me-3 mt-3" src="https://d1coqmn8qm80r4.cloudfront.net/bwesyjd8klsnvm22n5yj3rvufveq"
                        style="width: 100px;  height: 100px; border-radius: 50%;">
                      <div class="ms-3">
                        <a href="#">
                          <h5 class="mb-3">Software Engineer (Android), Libraries</h5>
                        </a>
                        <div class="mb-4 d-flex">
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-briefcase me-2"></i>
                              Phân
                              đoạn</span></h5>
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-location-dot me-2"></i>
                              Đà
                              Nẵng</span></h5>
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-clock me-2"></i> 11 giờ
                              trước</span></h5>
                          <h5><span class="badge bg-light text-dark me-3"><i class="fa-solid fa-money-bill me-2"></i> 35
                              -
                              45 Triệu</span></h5>
                        </div>
                        <div class="salary-badge d-flex">
                          <h5><span class="badge text-dark me-2" style="background-color: #e0e4fe;">Toàn thời
                              gian</span>
                          </h5>
                          <h5><span class="badge text-dark" style="background-color: #fdf2df;">Cấp bách</span></h5>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5">
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
  color: #000; /* Màu đen */
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #0066cc; /* Xanh dương */
}
</style>