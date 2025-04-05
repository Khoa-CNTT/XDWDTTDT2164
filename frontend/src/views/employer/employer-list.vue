<template>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="mb-0">Danh sách nhân viên</h2>
        <div>
          <button class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>Thêm nhân viên
          </button>
        </div>
      </div>
  
      <!-- Search Card -->
      <div class="card border-0 rounded-4 mb-4">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input type="text" class="form-control border-start-0 ps-0" 
                  placeholder="Danh sách nhân viên">
              </div>
            </div>
            <div class="col-auto">
              <button class="btn btn-link text-decoration-none">
                Trở lại trang chủ?
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Employee Table -->
      <div class="card border-0 rounded-4">
        <div class="card-body p-4">
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="bg-light">
                <tr>
                  <th>STT</th>
                  <th>Tên nhân viên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Quyền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5" :key="i">
                  <td>{{ i }}</td>
                  <td>Thái Mai Quang</td>
                  <td>thaiquangqt2003@gmail.com</td>
                  <td>0123456789</td>
                  <td>Công ty</td>
                  <td>
                    <span class="badge bg-success rounded-pill px-3">Hoạt động</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-light me-2">Sửa</button>
                    <button class="btn btn-sm btn-light">Xóa</button>
                  </td>
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
                <li class="page-item">
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
  </template>
  
  <script>
  export default {
    name: 'EmployeeList'
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
  </style> 