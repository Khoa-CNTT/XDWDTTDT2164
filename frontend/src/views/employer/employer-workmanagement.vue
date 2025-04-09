<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h4 class="mb-1">Quản lý công việc!</h4>
      <a href="#" class="text-decoration-none text-muted small">Trở lại trang chủ?</a>
    </div>

    <!-- Jobs List -->
    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Danh sách công việc của tôi</h5>
          <button class="btn btn-secondary">
            <i class="fas fa-plus me-2"></i>Thêm mới bài đăng
          </button>
        </div>

        <!-- Job Table -->
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="bg-light">
              <tr class="text-center">
                <th class="text-start">Tên công việc</th>
                <th>Tên người đăng</th>
                <th>Ngày tạo và hết hạn</th>
                <th>Trạng thái</th>
                <th>Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 4" :key="i" class="align-middle text-center">
                <td class="text-start">
                  <div class="d-flex align-items-center">
                    <div class="rounded-3 bg-light p-2 me-3">
                      <img src="https://framerusercontent.com/images/3g0GS7Ho5Myy2UtnkAyiPFODrc.png" alt="Company"
                        width="40" height="40">
                    </div>
                    <div>
                      <div class="fw-500 mb-1">Software Engineer (Android), Libraries</div>
                      <div class="d-flex align-items-center gap-4 text-muted small">
                        <div>
                          <i class="fa-solid fa-bag-shopping me-2"></i>
                          <span>Nhân Viên</span>
                        </div>
                        <div>
                          <i class="fas fa-map-marker-alt mx-2"></i>
                          <span>Đà Nẵng</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <a href="#" class="text-primary text-decoration-underline">Thái Mai Quang</a>
                </td>
                <td class="text-muted small">
                  <div>Tháng 3, 03, 2025</div>
                  <div>Tháng 3, 10, 2025</div>
                </td>
                <td>
                  <span class="badge bg-success rounded-pill px-3">Hoạt động</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-light me-2 px-3">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-light px-3">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobManagement'
}
</script>

<style scoped>
.btn-light {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.btn-light:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.badge {
  font-weight: normal;
}

.fw-500 {
  font-weight: 500;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>
