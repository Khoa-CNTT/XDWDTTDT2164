<template>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="mb-4">
        <h4 class="mb-1">Quản lý công việc!</h4>
        <a href="#" class="text-decoration-none text-muted small">Trở lại trang chủ?</a>
      </div>
  
      <!-- Sub Header -->
      
  
      <!-- Jobs List -->
      <div class="card border-0 rounded-4">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">Danh sách công việc của tôi</h5>
        <button class="btn btn-secondary">
          <i class="fas fa-plus me-2"></i>Thêm mới bài đăng
        </button>
      </div>
          <!-- Table Header -->
          <div class="bg-light rounded p-3 mb-3">
            <div class="row align-items-center text-center">
              <div class="col">Tên công việc</div>
              <div class="col me-5">Tên người đăng</div>
              <div class="col">Ngày tạo và hết hạn</div>
              <div class="col">Trạng thái</div>
              <div class="col">Hoạt động</div>
            </div>
          </div>
  
          <!-- Job Items -->
          <div v-for="i in 4" :key="i" class="mb-3">
            <div class="row align-items-center text-nowrap">
              <div class="col">
                <div class="d-flex align-items-center">
                  <div class="rounded-3 bg-light p-2 me-3">
                    <img src="https://cdn.pixabay.com/photo/2014/08/23/11/33/cow-425164_640.jg" alt="Company" width="40" height="40">
                  </div>
                  <div>
                    <div class="fw-500 mb-1">Software Engineer (Android), Libraries</div>
                    <div class="d-flex align-items-center text-muted small">
                      <i class="fas fa-folder-open me-2"></i>
                      <span>Phân đoạn</span>
                      <i class="fas fa-map-marker-alt mx-2"></i>
                      <span>Đà Nẵng</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <a href="#" class="text-primary text-decoration-none">Thái Mai Quang</a>
              </div>
              <div class="col text-muted small">
                <div>Tháng 3, 03, 2025</div>
                <div>Tháng 3, 10, 2025</div>
              </div>
              <div class="col">
                <span class="badge bg-success rounded-pill px-3">Hoạt động</span>
              </div>
              <div class="col">
                <button class="btn btn-sm btn-light me-2 px-3">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-light px-3">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <hr class="my-3">
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
  
  hr {
    margin: 1rem 0;
    color: #dee2e6;
    opacity: 1;
  }
  
  .bg-light {
    background-color: #f8f9fa !important;
  }
  </style> 