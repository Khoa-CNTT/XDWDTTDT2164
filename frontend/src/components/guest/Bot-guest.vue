<template>
    <footer class="bg-white pt-5 pb-3">
        <div class="container">

            <!-- Thêm align-items-start vào row -->
            <div class="row g-4 align-items-start">
                <!-- Column 1 - Superio Info -->
                <div class="col-12 col-md-6 col-lg-3 text-start">
                    <div class="d-flex align-items-center mb-3">
                        <img src="@/assets/logo/logo.svg"
                            alt="Superio logo" class="img-fluid" style="width: 150px;">
                    </div>
                    <h4 class="mb-2 ">Gọi cho chúng tôi</h4> 
                    <h5 class="text-primary mb-2">0857 176 357</h5>
                    <p class="mb-2">239 Tố Hữu, Phường Khuê Trung</p>
                    <p class="mb-2">Quận Cẩm Lệ, TP. Đà Nẵng</p>
                    <p>Superio@gmail.com</p>
                </div>

                <!-- Các cột khác giữ nguyên -->
                <div class="col-6 col-md-6 col-lg-2 text-start">
                    <h4 class="h5 mb-3">Ứng cử viên</h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">Duyệt việc làm</li>
                        <li class="mb-2">Duyệt các loại</li>
                        <li class="mb-2">Bảng điều kiện</li>
                        <li class="mb-2">Thông báo công việc</li>
                        <li>Dấu trang của tôi</li>
                    </ul>
                </div>

                <!-- Nhà tuyển dụng -->
                <div class="col-6 col-md-6 col-lg-2 text-start">
                    <h4 class="h5 mb-3">Nhà tuyển dụng</h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">Duyệt các ứng viên</li>
                        <li class="mb-2">Bảng điều kiện</li>
                        <li class="mb-2">Thêm công việc</li>
                        <li>Gói công việc</li>
                    </ul>
                </div>

                <!-- Về chúng tôi -->
                <div class="col-6 col-md-6 col-lg-2 text-start">
                    <h4 class="h5 mb-3">Về chúng tôi</h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">Về chúng tôi</li>
                        <li class="mb-2">Điều khoản trang</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>

                <!-- Tài nguyên hữu ích -->
                <div class="col-6 col-md-6 col-lg-3 text-start">
                    <h4 class="h5 mb-3">Tài nguyên hữu ích</h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">Điều khoản sử dụng</li>
                        <li class="mb-2">Trung tâm quyền riêng tư</li>
                        <li class="mb-2">Trung tâm an ninh</li>
                        <li>Trung tâm tiếp cận</li>
                    </ul>
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-top pt-4 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <p class="text-muted mb-2 mb-md-0">
                    © 2025 KLTN - Trường Đại Học Duy Tân
                </p>
                <div class="d-flex gap-3">
                    <a href="#" class="text-muted"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="text-muted"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-muted"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="text-muted"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {

}
</script>

<style scoped>
/* Optional custom styles */
footer {
  font-size: 0.9rem;
}
.list-unstyled li {
  cursor: pointer;
  transition: color 0.2s;
}

.list-unstyled li:hover {
  color: #0d6efd !important;
}

.text-muted {
  color: #6c757d !important;
}
</style>