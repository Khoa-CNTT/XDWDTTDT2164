<template>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="mb-4">
        <h4 class="mb-1">Thay đổi mật khẩu</h4>
        <a href="#" class="text-decoration-none text-muted small">Trở lại trang chủ?</a>
      </div>
  
      <!-- Change Password Form -->
      <div class="card border-0 rounded-4">
        <div class="card-body p-4">
          <h5 class="mb-4">Thay đổi mật khẩu</h5>
  
          <form>
            <div class="mb-4">
              <label class="form-label">Mật khẩu cũ</label>
              <input 
                type="password" 
                class="form-control bg-light border-0" 
                placeholder="Nhập mật khẩu cũ"
              >
            </div>
  
            <div class="mb-4">
              <label class="form-label">Mật khẩu mới</label>
              <input 
                type="password" 
                class="form-control bg-light border-0" 
                placeholder="Nhập mật khẩu mới"
              >
            </div>
  
            <div class="mb-4">
              <label class="form-label">Nhập lại mật khẩu</label>
              <input 
                type="password" 
                class="form-control bg-light border-0" 
                placeholder="Nhập lại mật khẩu mới"
              >
            </div>
  
            <button type="submit" class="btn btn-primary px-4">
              Lưu
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChangePassword'
  }
  </script>
  
  <style scoped>
  .form-control {
    padding: 0.75rem 1rem;
  }
  
  .form-control::placeholder {
    color: #6c757d;
    opacity: 0.75;
  }
  
  .form-control:focus {
    background-color: #f8f9fa;
    box-shadow: none;
    border-color: transparent;
  }
  
  .bg-light {
    background-color: #f8f9fa !important;
  }
  </style> 