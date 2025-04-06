<template>
    <div>
        <!-- Header -->
        <!-- <header class="dashboard-header">
            <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
                <div class="container-fluid"
                    style="padding: 20px 50px; background-color: white; border-bottom: 2px solid rgb(222, 226, 230);">
                    <a class="logo me-3" href="#"><img src="/src/assets/logo/logo.svg" alt="Superio" width="150"
                            height=""></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation"><span
                            class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item"><a class="nav-link active text-primary" aria-current="page"
                                    href="#">Trang chủ</a></li>
                            <li class="nav-item"><a class="nav-link active text-primary" aria-current="page"
                                    href="#">Việc làm</a></li>
                            <li class="nav-item"><a class="nav-link active text-primary" aria-current="page"
                                    href="#">Công Ty</a></li>
                            <li class="nav-item"><a class="nav-link active text-primary" aria-current="page"
                                    href="#">Giới Thiệu</a></li>
                        </ul>
                        <form class="d-flex" role="search"><a href="/skills" class=""><a class="btn btn-outline-primary"
                                    href="login_form.html" type="button">Đăng nhập /
                                    Đăng ký</a></a></form>
                    </div>
                </div>
            </nav>
        </header> -->
        <!-- Sidebar -->
        <nav class="sidebar">
            <div class="menu">
                <div class="menu-section">
                    <ul class="sidebar-list">
                        <!-- Trang Chủ -->
                        <router-link to="/candidate-dashboard">
                            <li class="sidebar-item header"><a href="/admin-dashboard" class=""><i
                                        class="fa-solid fa-house"></i><span>
                                        Dashboard</span></a></li>
                        </router-link>
                        <!-- Coppy cái này là mẫu để làm mấy cái trong sidebar -->
                        <!-- Nhóm quản lý người đùng -->
                        <li class="sidebar-item header">
                            <!-- để đường dẫn /cadidate-dashboard/(cái đường dẫn mới tạo bên kia) -->
                            <router-link to="/candidate-dashboard/candidate-test">
                                <a href="" class=""><i class="fa-solid fa-user"></i>Hồ sơ cá nhân </a>
                            </router-link>
                        </li>
                        <li class="sidebar-item header">
                            <router-link to="/candidate-dashboard/candidate-jobs">
                                <a href="" class=""><i class="fa-solid fa-bookmark"></i>Đã lưu </a>
                            </router-link>
                        </li>
                        <li class="sidebar-item header">
                            <router-link to="/candidate-dashboard/candidate-apply">
                                <a href="" class=""><i class="fa-solid fa-calendar"></i>Ứng viên công việc</a>
                            </router-link>
                        </li>
                        <li class="sidebar-item header">
                            <router-link to="/candidate-dashboard/candidate-password">
                                <a href="" class=""><i class="fa-solid fa-lock"></i>Đổi mật khẩu</a>
                            </router-link>
                        </li>
                        <!-- Bỏ hết mấy cái dưới này  -->
                        <!-- Đăng xuất -->
                        <li class="sidebar-item logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>

</template>
<script>
export default {

}
</script>
<style>
a {
    text-decoration: none !important;
    /* Tắt dấu gạch dưới của router-link */
}

/* .router-link-active,
.router-link-exact-active {
    all: unset !important;
} */

.sidebar {
    background: white;
    color: black;
    width: 280px;
    height: 100vh;
    padding: 20px 0;
}

.sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-item {
    padding: 12px 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
}

.sidebar-item.header {
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.7em;
    color: #7f8c8d;
    margin-top: 5px;
}

.sidebar-item.sub-item {
    padding-left: 50px;
    font-size: 0.9em;
}

.sidebar-item:hover {
    background: #c3d2ff;
}

.sidebar-item.logout {
    margin-top: 30px;
    border-top: 1px solid #34495e;
    padding-top: 20px;
    color: #e74c3c;
}

.sidebar-item i {
    width: 25px;
    text-align: center;
}
</style>