<template>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header -->
          <div class="d-flex align-items-center justify-content-between mb-4">
            <h4 class="mb-0">Lịch sử thanh toán</h4>
            <div>
              <a href="#" class="text-decoration-none text-muted">Trở lại trang chủ?</a>
            </div>
          </div>
  
          <!-- Payment History Table -->
          <div class="card border-0 rounded-4">
            <div class="card-body p-4">
              <h5 class="mb-4">Lịch sử thanh toán</h5>
  
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="bg-light">
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th class="text-danger">Phí thanh toán</th>
                      <th>Số dư đầu</th>
                      <th>Số dư cuối</th>
                      <th>Mã bài đăng</th>
                      <th>Tên bài đăng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in 8" :key="i">
                      <td>{{ i }}</td>
                      <td>22:50 2/4/2025</td>
                      <td class="text-danger">-50.000</td>
                      <td>50.000</td>
                      <td>0</td>
                      <td>
                        <span class="text-primary">PT12302042025225505</span>
                      </td>
                      <td>Bài đăng 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              <!-- Pagination -->
              <div class="d-flex justify-content-center mt-4">
                <nav>
                  <ul class="pagination mb-0">
                    <li class="page-item">
                      <button class="page-link">Quay lại</button>
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
                      <button class="page-link">Tiếp</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentHistory'
  }
  </script>
  
  <style scoped>
  .table > :not(caption) > * > * {
    padding: 1rem;
  }
  
  .page-link {
    color: #6c757d;
    border: none;
    padding: 0.5rem 1rem;
  }
  
  .page-link:hover {
    color: #000;
    background: none;
  }
  
  .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
  }
  
  .text-primary {
    cursor: pointer;
  }
  
  .text-primary:hover {
    text-decoration: underline;
  }
  </style> 