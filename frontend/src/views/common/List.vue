<template>
  <div>
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
        <div class="container-fluid"
          style="padding-left: 50px; padding-right: 50px; padding-top: 20px; padding-bottom: 20px; background-color:white;border-bottom: 2px solid #dee2e6;">
          <a class="logo me-3" href="#">
            <img src="/src/assets/logo/logo.svg" alt="Superio" width="150" height="">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active text-primary" aria-current="page" href="#">Trang chủ</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active text-primary" aria-current="page" href="#">Việc làm</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active text-primary" aria-current="page" href="#">Công Ty</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active text-primary" aria-current="page" href="#">Giới Thiệu</a>
              </li>
            </ul>
            <form class="d-flex" role="search">
              <router-link to="/login">
                <a class="btn btn-outline-primary" href="login_form.html" type="button">Đăng nhập / Đăng ký</a>
              </router-link>
            </form>
          </div>
        </div>
      </nav>
    </div>
    <div class="col-lg-12">
    <div class="row text-center bg-ECF1FB">
      <h2 class=" mt-3">Tìm việc làm</h2>
      <h5><b>Trang chủ</b> / Danh sách công việc</h5>
    </div>
    </div>
    <div class="col-lg-12 mt-3">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-1"></div>
        <div class="col-lg-2 ms-5">
          <div class="card mb-4">
            <div class="mt-2 ms-4">
              <h5 class="mb-0">Tìm kiếm bằng từ khóa</h5>
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
              <input type="range" class="form-range" min="0" max="50000" step="1000" />
              <p class="text-center">$0 $2000</p>
            </div>
          </div>
        </div>
        <!-- Job Listings -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <p>Hiển thị 10 công việc</p>
            <div>
              <select class="form-select d-inline-block w-auto me-2">
                <option value="newest">Mới nhất</option>
                <option value="salary">Lương cao nhất</option>
              </select>
              <button class="btn btn-primary">Tìm kiếm</button>
            </div>
          </div>
          <div class="list-group">
            <div class="list-group-item list-group-item-action">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s"
                  alt="" width="70px">
                <div class="ms-3">
                  <h5 class="mb-1">Software Engineer</h5>
                  <p class="mb-1">
                    <span class="text-muted">Hà Nội</span> |
                    <span class="text-muted">35 triệu</span>
                  </p>
                  <small class="text-muted">Full-time</small>
                </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm me-2">Xem chi tiết</button>
                  <button class="btn btn-outline-secondary btn-sm">Ứng tuyển</button>
                </div>
              </div>
            </div>
            <div class="list-group-item list-group-item-action">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s"
                  alt="" width="70px">
                <div class="ms-3">
                  <h5 class="mb-1">Marketing Specialist</h5>
                  <p class="mb-1">
                    <span class="text-muted">Đà Nẵng</span> |
                    <span class="text-muted">20 triệu</span>
                  </p>
                  <small class="text-muted">Part-time</small>
                </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm me-2">Xem chi tiết</button>
                  <button class="btn btn-outline-secondary btn-sm">Ứng tuyển</button>
                </div>
              </div>
            </div>
            <div class="list-group-item list-group-item-action">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s"
                  alt="" width="70px">
                <div class="ms-3">
                  <h5 class="mb-1">Marketing Specialist</h5>
                  <p class="mb-1">
                    <span class="text-muted">Đà Nẵng</span> |
                    <span class="text-muted">20 triệu</span>
                  </p>
                  <small class="text-muted">Part-time</small>
                </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm me-2">Xem chi tiết</button>
                  <button class="btn btn-outline-secondary btn-sm">Ứng tuyển</button>
                </div>
              </div>
            </div>
            <div class="list-group-item list-group-item-action">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s"
                  alt="" width="70px">
                <div class="ms-3">
                  <h5 class="mb-1">Marketing Specialist</h5>
                  <p class="mb-1">
                    <span class="text-muted">Đà Nẵng</span> |
                    <span class="text-muted">20 triệu</span>
                  </p>
                  <small class="text-muted">Part-time</small>
                </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm me-2">Xem chi tiết</button>
                  <button class="btn btn-outline-secondary btn-sm">Ứng tuyển</button>
                </div>
              </div>
            </div>
            <div class="list-group-item list-group-item-action">
              <div class="d-flex justify-content-between">
                <div class="d-flex">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiP5OOYYQ-OhLP2M0tapnypGkRBk9la5AmJg&s"
                  alt="" width="70px">
                <div class="ms-3">
                  <h5 class="mb-1">Marketing Specialist</h5>
                  <p class="mb-1">
                    <span class="text-muted">Đà Nẵng</span> |
                    <span class="text-muted">20 triệu</span>
                  </p>
                  <small class="text-muted">Part-time</small>
                </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm me-2">Xem chi tiết</button>
                  <button class="btn btn-outline-secondary btn-sm">Ứng tuyển</button>
                </div>
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
        <div class="col-lg-1"></div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

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
</style>