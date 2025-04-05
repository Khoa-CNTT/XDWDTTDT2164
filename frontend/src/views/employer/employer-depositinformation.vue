<template>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <!-- Header -->
          <div class="mb-4">
            <h2 class="mb-2">Thông tin nạp tiền</h2>
            <div>
              <a href="#" class="text-decoration-none text-muted">Trở lại trang chủ?</a>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="card border-0 rounded-4">
            <div class="card-body p-4">
              <!-- Deposit Form -->
              <div class="mb-4">
                <h5 class="mb-3">Thông tin nạp tiền</h5>
              </div>
  
              <!-- Bonus Information -->
              <div class="alert alert-info bg-info bg-opacity-10 border-0 mb-4">
                <h6 class="text-info mb-2">Ưu đãi nạp tiền:</h6>
                <ul class="list-unstyled mb-0">
                  <li class="mb-1">• Nạp từ 100.000 đến dưới 1.000.000 tặng 10%</li>
                  <li class="mb-1">• Nạp từ 1.000.000 đến dưới 2.000.000 tặng 20%</li>
                  <li class="mb-0">• Nạp từ 2.000.000 trở lên tặng 25%</li>
                </ul>
              </div>
  
              <!-- Quick Amount Selection -->
              <div class="mb-4">
                <h6 class="mb-3">Chọn nhanh số tiền cần nạp</h6>
                <div class="row g-2">
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount1" value="50000">
                      <label class="form-check-label w-100" for="amount1">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            50.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount2" value="100000">
                      <label class="form-check-label w-100" for="amount2">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            100.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount3" value="200000">
                      <label class="form-check-label w-100" for="amount3">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            200.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount4" value="500000">
                      <label class="form-check-label w-100" for="amount4">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            500.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount5" value="1000000">
                      <label class="form-check-label w-100" for="amount5">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            1.000.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount6" value="2000000">
                      <label class="form-check-label w-100" for="amount6">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            2.000.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-4 col-lg-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="amount" id="amount7" value="5000000">
                      <label class="form-check-label w-100" for="amount7">
                        <div class="card border">
                          <div class="card-body p-2 text-center">
                            5.000.000
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Custom Amount Input -->
              <div class="mb-4">
                <h6 class="mb-3">Hoặc nhập số tiền cần nạp</h6>
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="50.000" value="50.000">
                  <span class="input-group-text">đ</span>
                </div>
                <small class="text-muted">năm mươi nghìn đồng</small>
              </div>
  
              <!-- Deposit Summary -->
              <div class="alert alert-info bg-info bg-opacity-10 border-0 mb-4">
                <h6 class="text-info mb-3">Thông tin nạp tiền</h6>
                <div class="d-flex justify-content-between mb-2">
                  <span>Số tiền nạp</span>
                  <span>50.000đ</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Khuyến mãi</span>
                  <span>+0đ</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Thực nhận</span>
                  <span>50.000đ</span>
                </div>
              </div>
  
              <!-- Submit Button -->
              <button class="btn btn-primary w-100">Tiếp tục</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DepositInfoView'
  }
  </script>
  
  <style scoped>
  .form-check-input {
    display: none;
  }
  
  .form-check-input:checked + .form-check-label .card {
    border-color: #0d6efd !important;
    background-color: #f8f9fa;
  }
  
  .card:hover {
    border-color: #0d6efd !important;
    cursor: pointer;
  }
  </style> 