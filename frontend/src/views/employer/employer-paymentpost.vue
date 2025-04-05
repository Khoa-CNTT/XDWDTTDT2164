<template>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <h4 class="mb-4">Thanh toán bài đăng</h4>
  
          <!-- Progress Steps -->
          <div class="d-flex align-items-center mb-4">
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-light p-3">
                <i class="fas fa-briefcase text-primary"></i>
              </div>
              <span class="ms-2">Chi tiết công việc</span>
            </div>
            <div class="border-top flex-grow-1 mx-3"></div>
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-primary p-3">
                <i class="fas fa-credit-card text-white"></i>
              </div>
              <span class="ms-2">Thanh toán</span>
            </div>
          </div>
  
          <!-- Job Details -->
          <div class="card border-0 rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="mb-4">Tiêu đề công việc</h5>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Danh mục việc làm</label>
                  <select class="form-select">
                    <option>Chọn danh mục</option>
                  </select>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Hình thức làm việc</label>
                  <input type="text" class="form-control" value="Full time" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Mức lương</label>
                  <input type="text" class="form-control" value="34 - 40 Triệu" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Số lượng người tuyển</label>
                  <input type="text" class="form-control" value="Chọn chuyên môn" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Kỹ năng</label>
                  <input type="text" class="form-control" value="React, Nestjs, Nodejs" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Kinh nghiệm</label>
                  <input type="text" class="form-control" value="1 năm" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Cấp bậc</label>
                  <input type="text" class="form-control" value="Fresher, Intern" readonly>
                </div>
  
                <div class="col-md-6">
                  <label class="form-label">Ngày hết hạn ứng tuyển</label>
                  <input type="text" class="form-control" value="13.03.2025" readonly>
                </div>
  
                <div class="col-12">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" class="form-control" value="239 Tô Hiệu, Phường Khuê Trung, Quận Cẩm Lệ, TP Đà Nẵng" readonly>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Payment Information -->
          <div class="card border-0 rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="mb-0">Thông tin thanh toán</h5>
                <small class="text-muted">(Giá dịch vụ: 1 ngày x 2.000đ)</small>
              </div>
  
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="text-muted">Số tiền:</div>
                </div>
                <div class="col">
                  <div>10 (ngày) x 2.000 = 20.000đ</div>
                </div>
              </div>
  
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="text-muted">Số tiền cần thanh toán:</div>
                </div>
                <div class="col">
                  <div class="fw-bold">20.000đ</div>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-4">
                  <div class="text-muted">Chọn phương thức thanh toán:</div>
                </div>
                <div class="col">
                  <div class="d-flex align-items-center">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="payment" id="wallet" checked>
                      <label class="form-check-label" for="wallet">
                        Số dư ví: 50.000đ
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Submit Button -->
          <button class="btn btn-primary w-100">Tiếp tục</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'JobPayment'
  }
  </script>
  
  <style scoped>
  .form-control:read-only {
    background-color: #f8f9fa;
  }
  
  .form-control:read-only:focus {
    background-color: #f8f9fa;
  }
  
  .rounded-circle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style> 