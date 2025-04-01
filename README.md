<img src="https://cdn.duytan.edu.vn/images/icon/logo-duy-tan_vn.png?v=1" alt="logo" width="100%" heigt="100%">

### <h1>KHOA CÔNG NGHỆ THÔNG TIN - TRƯỜNG ĐẠI HỌC DUY TÂN</h1>

<h2>Hệ Thống Đăng Tin Tuyển Dụng Tự Động Sàng Lọc CV</h2>

### 🌟 Technologies I Use

![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vue](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Static Badge](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Static Badge](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Static Badge](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### Mô tả dự án

<p>Hệ thống <strong>Đăng Tin Tuyển Dụng Tự Động Sàng Lọc CV</strong> là một nền tảng hỗ trợ quá trình tuyển dụng hiệu quả, với các mục tiêu kết nối ứng viên và nhà tuyển dụng. Hệ thống cung cấp các tính năng như:</p>

- Đăng ký và đăng nhập: Người dùng (Ứng Viên, Nhà Tuyển Dụng) có thể đăng ký tài khoản và xác minh qua OTP.
- Quên mật khẩu: Người dùng có thể đặt lại mật khẩu qua email.
- Tìm kiếm và ứng tuyển công việc: Ứng Viên có thể tìm kiếm công việc phù hợp và nộp hồ sơ (được tự động sàng lọc).
- Đăng tin tuyển dụng: Nhà Tuyển Dụng có thể đăng tin công việc, với kiểm tra trùng lặp để tránh tạo bài đăng không cần thiết.
- Ví tài khoản: Nhà Tuyển Dụng sử dụng ví để nạp tiền và thanh toán cho các hành động (đăng tin) theo mô hình pay-per-action.
- Lịch sử giao dịch: Nhà Tuyển Dụng có thể xem lịch sử nạp tiền và thanh toán từ ví.
- Quản lý doanh thu: Admin có thể theo dõi doanh thu từ ví của Nhà Tuyển Dụng, bao gồm tổng quan, danh sách giao dịch, và xuất báo cáo.
- Phân quyền: Hệ thống phân quyền rõ ràng:
  - Admin: Quản lý người dùng, kiểm duyệt công ty, quản lý tin tuyển dụng, và theo dõi doanh thu.
  - Ứng Viên: Tìm kiếm và ứng tuyển công việc.
  - Nhà Tuyển Dụng: Bao gồm vai trò owner (chủ công ty) và recruitment (nhân viên tuyển dụng), với quyền truy cập khác nhau.
- Dự án được xây dựng bằng <strong>Node.js, Express, và Sequelize (với PostgreSQL)</strong>, sử dụng các thư viện như nodemailer (gửi email), jsonwebtoken (xác thực).

### Cấu trúc thư mục

Backend

```bash
backend/
├── controllers/              # Các controller xử lý logic API
│   ├── authController.js
│   ├── jobPostingController.js
│   ├── walletController.js
│   ├── revenueController.js
│   └── ...
├── services/                 # Các service xử lý logic nghiệp vụ
│   ├── authService.js
│   ├── jobPostingService.js
│   ├── walletService.js
│   ├── revenueService.js
│   └── ...
├── routes/                   # Các route API
│   ├── auth.js
│   ├── jobPosting.js
│   ├── wallet.js
│   ├── revenue.js
│   └── ...
├── models/                   # Các model Sequelize (định nghĩa schema)
│   ├── User.js
│   ├── Company.js
│   ├── EmployerUser.js
│   ├── JobPosting.js
│   ├── Wallet.js
│   ├── Transaction.js
│   └── ...
├── migrations/               # Các file migration cho database
│   ├── 20230325123456-create-users.js
│   ├── 20230325123457-create-companies.js
│   └── ...
├── middlewares/               # Middleware (xác thực, phân quyền)
│   ├── auth.js
│   └── ...
├── libs/                    # Các utility functions
│   ├── statusCode.js
│   ├── message.js
│   ├── errorCode.js
│   ├── email.js
│   ├── exportExcel.js
│   └── ...
├── exports/                  # Thư mục lưu file xuất báo cáo (Excel)
├── .env                      # File môi trường (cấu hình biến môi trường)
├── package.json              # File quản lý dependencies
└── README.md                 # File hướng dẫn dự án
```

Frontend

```bash
frontend/
├── public/                   # Các file tĩnh (favicon, index.html, v.v.)
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/                      # Source code chính của frontend
│   ├── assets/               # Các file tĩnh (hình ảnh, font, CSS, v.v.)
│   │   ├── images/
│   │   ├── fonts/
│   │   ├── css/
│   │   │   ├── global.css
│   │   │   └── ...
│   │   └── ...
│   ├── components/           # Các component tái sử dụng, chia theo vai trò
│   │   ├── admin/            # Component cho Admin
│   │   │   ├── RevenueChart.vue  # Biểu đồ doanh thu
│   │   │   ├── UserTable.vue     # Bảng quản lý người dùng
│   │   │   └── ...
│   │   ├── candidate/        # Component cho Ứng Viên
│   │   │   ├── JobCard.vue       # Hiển thị thông tin công việc
│   │   │   ├── ApplyForm.vue     # Form ứng tuyển
│   │   │   └── ...
│   │   ├── employer/         # Component cho Nhà Tuyển Dụng
│   │   │   ├── PostJobForm.vue   # Form đăng tin
│   │   │   ├── TransactionTable.vue  # Bảng lịch sử giao dịch
│   │   │   └── ...
│   │   ├── common/           # Component dùng chung
│   │   │   ├── AppHeader.vue     # Header chung
│   │   │   ├── AppFooter.vue     # Footer chung
│   │   │   ├── Pagination.vue    # Component phân trang
│   │   │   └── ...
│   │   └── ...
│   ├── views/                # Các view (tương ứng với các route), chia theo vai trò
│   │   ├── admin/            # View cho Admin
│   │   │   ├── AdminDashboard.vue  # Dashboard của Admin
│   │   │   ├── RevenueView.vue     # Trang quản lý doanh thu
│   │   │   ├── UserManagementView.vue  # Trang quản lý người dùng
│   │   │   └── ...
│   │   ├── candidate/        # View cho Ứng Viên
│   │   │   ├── JobSearchView.vue   # Trang tìm kiếm công việc
│   │   │   ├── JobApplyView.vue    # Trang ứng tuyển công việc
│   │   │   └── ...
│   │   ├── employer/         # View cho Nhà Tuyển Dụng
│   │   │   ├── EmployerDashboard.vue  # Dashboard của Nhà Tuyển Dụng
│   │   │   ├── PostJobView.vue   # Trang đăng tin
│   │   │   ├── WalletView.vue    # Trang quản lý ví
│   │   │   └── ...
│   │   ├── common/           # View dùng chung
│   │   │   ├── HomeView.vue      # Trang chủ
│   │   │   ├── LoginView.vue     # Trang đăng nhập
│   │   │   ├── RegisterView.vue  # Trang đăng ký
│   │   │   ├── ForgotPasswordView.vue  # Trang quên mật khẩu
│   │   │   └── ...
│   │   └── ...
│   ├── router/               # Định nghĩa các route
│   │   ├── index.js
│   │   └── ...
│   ├── store/                # Vuex store để quản lý state toàn cục (nếu dùng)
│   │   ├── index.js
│   │   ├── modules/
│   │   │   ├── auth.js       # Quản lý trạng thái đăng nhập
│   │   │   ├── job.js        # Quản lý trạng thái công việc
│   │   │   └── ...
│   │   └── ...
│   ├── api/                  # Các hàm gọi API
│   │   ├── auth.js           # API liên quan đến đăng nhập/đăng ký
│   │   ├── job.js            # API liên quan đến công việc
│   │   ├── wallet.js         # API liên quan đến ví và giao dịch
│   │   └── ...
│   ├── App.vue               # Component chính
│   ├── main.js               # Entry point của Vue
│   └── ...
├── Dockerfile                # Dockerfile cho frontend
├── .env                      # File môi trường (cấu hình biến môi trường)
├── vue.config.js             # File cấu hình Vue (nếu cần)
├── package.json              # File quản lý dependencies
└── README.md                 # File hướng dẫn frontend
```

Root Directory

```bash
recruitment-system/
├── backend/                  # Thư mục backend
├── frontend/                 # Thư mục frontend
├── docker-compose.yml        # File Docker Compose để chạy toàn bộ hệ thống
└── README.md                 # File hướng dẫn dự án
```

### Yêu cầu hệ thống

- Docker: v20.x hoặc cao hơn.
- Docker Compose: v2.x hoặc cao hơn.
- Email Service: Gmail (hoặc dịch vụ email khác) để gửi OTP và link đặt lại mật khẩu.

### Cài đặt với Docker

1. Clone repository

```bash
git clone https://github.com/Khoa-CNTT/XDWDTTDT2164.git
cd XDWDTTDT2164
```

2. Cấu hình biến môi trường

- Backend
  Tạo file backend/.env và thêm các biến môi trường:

```bash
# Cấu hình server
PORT=5001

# Cấu hình database (MySQL)
DB_HOST=postgres
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=recruitment_system

# Cấu hình redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=123456
NODE_ENV=development

# Cấu hình JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=30d

# Cấu hình email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cấu hình cloydinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cấu hình frontend URL
FRONTEND_URL=http://localhost:5173
```

- Frontend
  Tạo file frontend/.env và thêm các biến môi trường

```bash
VUE_APP_API_URL=http://localhost:5001
```

3. Chạy ứng dụng với Docker compose

```bash
$ docker-compose up --build
```

4. Tiếp theo migration database (Chèn bảng vào CSDL)

```bash
$ cd backend
$ docker compose exec app npx sequelize-cli db:migrate:all
```

- Backend sẽ chạy tại http://localhost:5001.
- Frontend sẽ chạy tại http://localhost:5173.

5. Kiểm tra ứng dụng

- Mở trình duyệt và truy cập http://localhost:5173.
- Đăng ký tài khoản, đăng nhập, và thử các tính năng như tìm kiếm công việc, đăng tin, hoặc quản lý ví.

### Công nghệ sử dụng

### Backend

- Backend: Node.js, Express
- Database: MySQL, Sequelize
- Xác thực: JSON Web Token (JWT)
- Lưu trữ tạm thời: Redis (tùy chọn, cho OTP và token đặt lại mật khẩu)

### Frontend

- Frontend: Vue.js
- Định tuyến: Vue Router
- Gọi API: Axios
- Quản lý state: Vuex (hoặc Pinia nếu dùng Vue 3)

### Containerization

- Docker: Để đóng gói và chạy ứng dụng.
- Docker Compose: Để quản lý các service (backend, frontend, PostgreSQL, Redis).

### Đóng góp

1. Fork repository.
2. Tạo branch mới: git checkout -b feature/your-feature.
3. Commit thay đổi: git commit -m "Add your feature".
4. Push lên branch: git push origin feature/your-feature.
5. Tạo Pull Request.

### Liên hệ

 - Trường Đại Học Duy Tân
 - Nhóm STT80
   + Thái Mai Quang - Trưởng nhóm
   + Hoàng Văn Ngọc Quý
   + Nguyễn Bảo Lưu
   + Nguyễn Gia Khánh
   + Phan Minh Khánh

### 💖 Cảm ơn

Dự án này được thực hiện trong khuôn khổ học tập tại **Trường Đại học Duy Tân**.  
Xin gửi lời cảm ơn đến các giảng viên và bạn bè đã hỗ trợ trong quá trình nghiên cứu và phát triển.
