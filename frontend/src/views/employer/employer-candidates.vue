<template>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="mb-4">
        <h4 class="mb-1">Danh sách ứng viên</h4>
        <a href="#" class="text-decoration-none text-muted small">Trở lại trang chủ?</a>
      </div>
  
      <!-- Applicants Section -->
      <div class="card border-0 rounded-4">
        <div class="card-body p-4">
          <h5 class="mb-4">Ứng viên</h5>
  
          <!-- Table -->
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th class="text-primary border-0">Tên ứng viên</th>
                  <th class="text-primary border-0">Số điện thoại</th>
                  <th class="text-primary border-0">Tỷ lệ phù hợp</th>
                  <th class="text-primary border-0">Đánh giá</th>
                  <th class="text-primary border-0">Trạng thái</th>
                  <th class="text-primary border-0">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 4" :key="i">
                  <td>Mai Tài Phến</td>
                  <td>0123456789</td>
                  <td>50%</td>
                  <td>
                    <span class="badge bg-warning text-dark px-3 rounded-pill">Tạm chấp nhận</span>
                  </td>
                  <td>Đã xem</td>
                  <td>
                    <button class="btn btn-link text-decoration-none p-0 me-4">Xem CV</button>
                    <button class="btn btn-link text-decoration-none p-0">Đánh Giá</button>
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
    name: 'ApplicantList'
  }
  </script>
  
  <style scoped>
  .table > :not(caption) > * > * {
    padding: 1rem;
    border-bottom-color: #dee2e6;
  }
  
  .badge {
    font-weight: normal;
  }
  
  .btn-link {
    color: #0d6efd;
  }
  
  .btn-link:hover {
    color: #0a58ca;
  }
  
  .text-primary {
    color: #0d6efd !important;
  }
  </style> 