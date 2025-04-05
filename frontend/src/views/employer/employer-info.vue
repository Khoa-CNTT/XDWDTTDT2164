<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="mb-0">Hồ sơ công ty!</h2>
    </div>

    <div class="card border-0 rounded-4">
      <div class="card-body p-4">
        <h5 class="mb-4">Hồ sơ của tôi</h5>

        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="position-relative d-inline-block text-center">
            <div class="border border-dashed rounded-3"
              style="width: 150px; height: 150px; position: relative; cursor: pointer;"
              onclick="document.getElementById('uploadImage').click()">
              <div class="d-flex flex-column align-items-center justify-content-center h-100">
                <i class="fas fa-arrow-up fa-2x text-muted mb-2"></i>
                <span class="text-muted">Chèn ảnh</span>
              </div>
            </div>
            <input type="file" id="uploadImage" class="d-none" accept=".jpg, .png" onchange="previewImage(event)">
          </div>

          <div class="ms-4 flex-grow-1">
            <small class="text-muted d-block mb-2">
              Kích thước tệp tối đa là 1MB, Kích thước tối thiểu: 330x300 và các tệp phù hợp: .jpg & .png
            </small>
          </div>
        </div>


        <div class="row g-4">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Tên công ty</label>
              <input type="text" class="form-control" placeholder="for software" value="for software">
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Mã số thuế</label>
              <input type="text" class="form-control" placeholder="12345678" value="12345647524">
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Website</label>
              <input type="text" class="form-control" placeholder="https://example.com" value="https://fpt.com">
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label">Số lượng nhân viên trong công ty</label>
              <input type="text" class="form-control" placeholder="50 - 100" value="50 - 100">
            </div>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Mô tả</label>
              <textarea class="form-control" rows="4"
                placeholder="Mô tả về công ty của bạn">Spent several years working on sheep on Wall Street. Had moderate success investing in Yogo's on Wall Street. Managed a small team buying and selling Super Mario 64 in Mexico. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working with bananas in the aftermarket. Spent a weekend licensing bananas in West Palm Beach, FL. In this position, the Software Engineer collaborates with Frontend's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present</textarea>
            </div>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label class="form-label">Địa chỉ đầy đủ</label>
              <input type="text" class="form-control" placeholder="Địa chỉ"
                value="239 Tố Hữu, Phường Khúc Trung, Quận Cẩm Lệ, TP Đà Nẵng">
            </div>
          </div>
          <div>
            <button class="btn btn-primary px-5 w-30">Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4">
      <small class="text-muted">© 2025 NLM - Trường Đại Học Duy Tân</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyProfile'
}
</script>

<style scoped>
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>