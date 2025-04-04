<template>
    <div>
        <h1 class="title">Thêm một công việc mới!</h1>
        <a>Trở lại trang chủ?</a>
        <!-- Progress Steps -->
       
        <!-- Job Form -->
         
        <div class="job-form">
            <div class="progress-steps">
            <div class="step active d-flex gap-2 align-items-center">
                <span class="icon"><i class="fa-solid fa-briefcase"></i></span>
                <span>Chi Tiết Công Việc</span>
            </div>
            <div class="step active d-flex gap-2 align-items-center">
                <span class="icon"><i class="fa-solid fa-money-bill-wave"></i></span>
                <span>Thanh toán</span>
            </div>
        </div>
            <div class="form-group mt-3">
                <label for="job-title"><b>Tiêu đề công việc</b></label>
                <input type="text" id="job-title" placeholder="Tiêu đề" />
            </div>

            <div class="form-group">
                <label for="job-description"><b>Mô tả</b></label>
                <textarea id="job-description" rows="5" placeholder="Mô tả công việc"></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="job-category">Danh mục việc làm</label>
                    <select id="job-category">
                        <option>Chọn danh mục</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="job-type">Hình thức làm việc</label>
                    <input type="text" id="job-type" placeholder="Full time" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="salary">Mức lương</label>
                    <input type="text" id="salary" placeholder="34 - 40 Triệu" />
                </div>
                <div class="form-group">
                    <label for="vacancies">Số lượng người tuyển</label>
                    <input type="text" id="vacancies" placeholder="Chọn chuyên môn" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="skills">Kỹ năng</label>
                    <input type="text" id="skills" placeholder="React, NestJS, NodeJS" />
                </div>
                <div class="form-group">
                    <label for="experience">Kinh nghiệm</label>
                    <input type="text" id="experience" placeholder="1 năm" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="level">Cấp bậc</label>
                    <input type="text" id="level" placeholder="Fresher, Intern" />
                </div>
                <div class="form-group">
                    <label for="deadline">Ngày hết hạn ứng tuyển</label>
                    <input type="text" id="deadline" placeholder="13.03.2025" />
                </div>
            </div>

            <div class="form-group">
                <label for="address">Địa chỉ</label>
                <input type="text" id="address" placeholder="239 Tố Hữu, Phường Khuê Trung, Quận Cẩm Lệ, TP Đà Nẵng" />
            </div>
        </div>
        <button class="btn btn-primary mt-4 w-30 px-5">Tiếp tục</button>
    </div>
    

</template>

<script>
export default {
    name: "EmployerNewJob",
};
</script>

<style scoped>
.new-job-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8faff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.back-link {
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    margin-bottom: 20px;
    display: inline-block;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: px;
}

.step {
    text-align: center;
    flex: 1;
}

.step .icon {
    padding: 15px;
    border-radius: 50%;
    background: #dee8f9;
}

.step i {
    font-size: 24px;
    color: #ccc;
}

.step span {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #666;
}

.step.active i {
    color: #007bff;
}

.step.active span {
    color: #007bff;
}

.job-form {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-row {
    display: flex;
    gap: 20px;
}

.form-row .form-group {
    flex: 1;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    font-size: 14px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
}

.btn-primary {
    background-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
}
</style>