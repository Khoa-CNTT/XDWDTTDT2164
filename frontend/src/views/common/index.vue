<template>
    <div class="superio-job-board">
        <!-- Slide -->
        <section class="bg-light py-0">
            <div class="container py-0">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0">
                        <h1 class="display-4 font-weight-bold mb-4">
                            Có <span class="text-primary">93,178</span> Bài Đăng Ở Đây Cho Bạn!
                        </h1>
                        <p class="lead text-muted mb-4">Tìm việc làm và cơ hội nghề nghiệp</p>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control form-control-lg"
                                placeholder="Tìm kiếm việc làm..." />
                            <button class="btn btn-primary btn-lg" type="button">Tìm việc</button>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <img alt="Professional person" class="img-fluid"
                            src="../../../src/assets/images/banner-person-1.png" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Danh mục Công việc phổ biến -->
        <section class="py-5 mt-5">
            <div class="container">
                <h2 class="h2 font-weight-bold mb-5 text-center">Danh mục công việc phổ biến</h2>
                <div class="row">
                    <div class="col-md-6 col-lg-4 mb-4" v-for="(category, index) in categories" :key="index">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body d-flex align-items-center">
                                <i class="fas fa-dollar-sign fa-2x text-muted mr-4 me-4"></i>
                                <div>
                                    <h5 class="font-weight-bold mb-1">{{ category.name }}</h5>
                                    <p class="text-muted mb-0">({{ category.jobs }} vị trí đăng mới)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Công việc phổ biến -->
        <section class="py-5 bg-light">
            <div class="container">
                <h2 class="h2 font-weight-bold mb-3 text-center">Công việc phổ biến</h2>
                <p class="lead text-muted text-center mb-5">
                    Biết giá trị của bạn và tìm được công việc đáp ứng điều kiện cuộc sống của bạn
                </p>
                <div class="row">
                    <div class="col-lg-4 col-md-6 mb-4" v-for="(job, index) in jobs" :key="index">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex mb-3">
                                    <img alt="Company logo" class="mr-3 mt-4 me-2" style="width: 80px; height: 70px;"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXZlaUXIWozu3xqknYB3S9nknCPGFPAEVZLA&s" />
                                    <div>
                                        <h5 class="font-weight-bold mb-1">{{ job.title }}</h5>
                                        <p class="text-muted small mb-1"><i class="fa-regular fa-building"></i> {{
                                            job.company }} - <i class="fa-solid fa-location-dot"></i> {{ job.location }}
                                            - <i class="fa-solid fa-sack-dollar"></i> {{ job.salary }}</p>
                                        <p class="text-muted small"><i class="fa-solid fa-clock"></i> {{ job.time }}</p>
                                    </div>
                                </div>
                                <div>
                                    <span class="badge bg-primary mr-2 me-2">{{ job.type }}</span>
                                    <span class="badge bg-warning">{{ job.status }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-primary btn-lg">Xem thêm</button>
                </div>
            </div>
        </section>

        <!-- Lời chứng thực -->
        <section class="py-5 bg-primary text-white">
            <div class="container">
                <h2 class="h2 font-weight-bold mb-5 text-center">Lời chứng thực từ khách hàng chúng tôi</h2>
                <div class="row">
                    <div class="col-lg-4 mb-4" v-for="(testimonial, index) in testimonials" :key="index">
                        <div class="card h-100 border-0 shadow">
                            <div class="card-body">
                                <h5 class="font-weight-bold mb-3">{{ testimonial.title }}</h5>
                                <p class="text-muted mb-4">{{ testimonial.content }}</p>
                                <div class="d-flex align-items-center">
                                    <img alt="Customer photo" class="rounded-circle mr-3 me-3"
                                        style="width: 40px; height: 40px;"
                                        src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png" />
                                    <div>
                                        <p class="font-weight-bold mb-0">{{ testimonial.name }}</p>
                                        <p class="text-muted small mb-0">{{ testimonial.position }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="row">
                <div class="col-3">
                    <div class="card">
                        <div class="card-body">
                            <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS3bjpPvZ2BJxeH1CCCKD6jzlpDQKnMLeZ5PF5fwd6Q3jG3qLnj" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="py-5">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0">
                        <img alt="Person working on laptop" style="height: 400px; width: 600px;"
                            class="img-fluid rounded" src="../../../src/assets/images/woman-working.jpg" />
                    </div>
                    <div class="col-lg-6">
                        <h2 class="h2 font-weight-bold mb-4">Hàng triệu công việc. Tìm người phù hợp với bạn</h2>
                        <p class="lead text-muted mb-4">
                            Tìm kiếm tất cả các vị trí mở trên web. Nhận được chất lượng ứng viên hàng đầu. Đọc đánh giá
                            và hơn 600.000 công ty trên toàn thế giới
                        </p>
                        <button class="btn btn-primary btn-lg">Bắt đầu</button>
                    </div>
                </div>
            </div>
        </section>\
    </div>
</template>

<script>
export default {
    name: 'SuperioJobBoard',
    data() {
        return {
            categories: [
                { name: 'Kế toán / Tài chính', jobs: 2 },
                { name: 'Công nghệ thông tin', jobs: 15 },
                { name: 'Marketing', jobs: 8 },
                { name: 'Nhân sự', jobs: 5 },
                { name: 'Thiết kế đồ họa', jobs: 7 },
                { name: 'Kinh doanh', jobs: 12 },
                { name: 'Marketing', jobs: 8 },
                { name: 'Nhân sự', jobs: 5 },
                { name: 'Thiết kế đồ họa', jobs: 7 },
            ],
            jobs: [
                {
                    title: 'Software Engineer (Android), Libraries',
                    company: 'Phân đoạn',
                    location: 'Đà Nẵng',
                    time: '11 giờ trước',
                    salary: '35 - 45 Triệu',
                    type: 'Toàn thời gian',
                    status: 'Cấp bách'
                },
                {
                    title: 'Senior Frontend Developer',
                    company: 'Công ty ABC',
                    location: 'Hồ Chí Minh',
                    time: '1 ngày trước',
                    salary: '40 - 50 Triệu',
                    type: 'Toàn thời gian',
                    status: 'Mới'
                },
                {
                    title: 'Product Manager',
                    company: 'Công ty XYZ',
                    location: 'Hà Nội',
                    time: '2 ngày trước',
                    salary: '45 - 60 Triệu',
                    type: 'Toàn thời gian',
                    status: 'Hot'
                }
            ],
            testimonials: [
                {
                    title: 'Awesome Design',
                    content: 'Without JobHunt I\'d be homeless, they found me a job and got me sorted out quickly with everything! Can\'t quite... The Mitech team works really hard to ensure high level of quality',
                    name: 'Thái Mai Quang',
                    position: 'Web developer'
                },
                {
                    title: 'Great Service',
                    content: 'I found my dream job through this platform. The process was smooth and efficient. Highly recommend to anyone looking for quality job opportunities.',
                    name: 'Nguyễn Văn A',
                    position: 'UX Designer'
                },
                {
                    title: 'Excellent Support',
                    content: 'The customer service team was very helpful throughout my job search journey. They provided valuable advice and connected me with great employers.',
                    name: 'Trần Thị B',
                    position: 'Marketing Specialist'
                }
            ]
        }
    }
}
</script>

<style scoped>
.superio-job-board {}

.bg-light {
    background-color: #eff6ff !important;
}

.text-primary {
    color: #007bff !important;
}

.bg-primary {
    background-color: #007bff !important;
}

.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.social-icons a {
    transition: color 0.3s ease;
}

.social-icons a:hover {
    color: #007bff !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .display-4 {
        font-size: 2.5rem;
    }
}
</style>