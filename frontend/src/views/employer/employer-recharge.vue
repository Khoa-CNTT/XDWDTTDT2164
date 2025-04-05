<template>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div>
          <!-- Header -->
          <div class="mb-4">
            <h2 class="mb-2">Nạp tiền vào tài khoản</h2>
            <div>
              <a href="#" class="text-decoration-none text-muted">Trở lại trang chủ?</a>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="card border-0 rounded-4">
            <div class="card-body p-4">
              <!-- Deposit Form -->
              <div class="mb-4">
                <h5 class="mb-3">Nạp tiền vào tài khoản</h5>
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
  
              <!-- Payment Methods -->
              <div>
                <h6 class="mb-3">Chọn phương thức nạp tiền</h6>
                
                <!-- MOMO -->
                <div class="card border hover-shadow-sm mb-3 cursor-pointer">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="me-3">Ví điện tử MOMO</div>
                      </div>
                      <img src="https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0" alt="MOMO" height="30">
                    </div>
                  </div>
                </div>
  
                <!-- ZALOPAY -->
                <div class="card border hover-shadow-sm mb-3 cursor-pointer">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="me-3">Ví điện tử ZALOPAY</div>
                      </div>
                      <img src="https://play-lh.googleusercontent.com/woYAzPCG1I8Z8HXCsdH3diL7oly0N8uth_1g6k7R_9Gu7lbxrsYeriEXLecRG2E9rP0" alt="ZALOPAY" height="30">
                    </div>
                  </div>
                </div>
  
                <!-- VNPAY -->
                <div class="card border hover-shadow-sm cursor-pointer">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="me-3">Ví điện tử VNPAY</div>
                      </div>
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s" alt="VNPAY" height="30">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DepositView'
  }
  </script>
  
  <style scoped>
  .hover-shadow-sm:hover {
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
    transition: box-shadow .15s ease-in-out;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  </style> 