<template>
    <div class="description-job">
        <h2>Xem Chi Tiết Bài Đăng</h2>
        <router-link to="/admin-dashboard/post-management">
            <div>Quay trở lại?</div>
        </router-link>
        <div class="card mt-5">
            <div class="card-header text-center">
                <h1><b>Mô Tả Chi Tiết Công Việc</b></h1>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img class="img-logo me-3" style="border: 1px solid black; border-radius: 30px;"
                        src="https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/b/AmazonStores/ATVPDKIKX0DER/2cd67b908ca9f725c502916b6c93e507.w750.h432._CR0%2C0%2C750%2C432_SX3000_.png"
                        alt="logo-company">
                    <div>
                        <h4 class="mt-2"><b>Công Ty Superio</b></h4>
                        <p>Địa chỉ: <span class="text-secondary">239 Tố Hữu, Phường Khuê Trung, Quận Cẩm Lệ, TP Đà
                                Nẵng</span></p>
                        <p>Phone: <span class="text-secondary"> 0909090909</span></p>
                        <p>Email: <span class="text-secondary"> superio@gmail.com</span></p>
                    </div>
                </div>
                <hr>
                <div class="mt-4">
                    <h4>Tiêu Đề Công Việc:</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                </div>
                <div class="mt-4">
                    <h4>Mô Tả Công Việc:</h4>
                    <textarea class="form-control"
                        rows="5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</textarea>
                </div>
                <hr>
                <div class="mt-4">
                    <h4>Yêu Cầu Công Việc:</h4>
                    <div class="row">
                        <div class="col-6 mt-2">
                            <label>Danh mục việc làm</label>
                            <input type="text" class="form-control mt-2" placeholder="Điền danh mục việc làm">
                            <label>Mức lương</label>
                            <input type="text" class="form-control mt-2" placeholder="30-45 triệu">
                            <label>Kỹ năng</label>
                            <input type="text" class="form-control mt-2" placeholder="React, Vue, Angular">
                            <label>Cấp bậc</label>
                            <input type="text" class="form-control mt-2" placeholder="Fresher, Junior, Senior">
                        </div>
                        <div class="col-6 mt-2">
                            <label>Hình thức việc làm</label>
                            <input type="text" class="form-control mt-2" placeholder="Full-time, Part-time, Freelance">
                            <label>Số lượng người tuyển</label>
                            <input type="text" class="form-control mt-2" placeholder="4">
                            <label>Kinh nghiệm</label>
                            <input type="text" class="form-control mt-2" placeholder="1 năm">
                            <label>Ngày hết hạn ứng tuyển</label>
                            <input type="date" class="form-control mt-2" placeholder="01-07-2025">
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-end">
                <button class="btn btn-outline-success me-2">Duyệt</button>
                <button class="btn btn-outline-danger">Từ chối</button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "JobDetailView",
}
</script>

<style scoped>
.img-logo {
    width: 250px;
    white-space: nowrap;
}
</style>