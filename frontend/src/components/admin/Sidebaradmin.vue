<template>
    <nav class="sidebar">
        <div class="menu">
            <div class="menu-section">
                <ul class="sidebar-list">
                    <!-- Trang Chủ -->
                    <router-link to="/admin-dashboard" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-house"></i>
                            <span>Trang chủ</span>
                    </router-link>

                    <!-- Nhóm quản lý người đùng -->
                    <router-link to="/admin-dashboard/user-management" class="sidebar-item header text-dark">
                            <i class="fa-regular fa-user"></i>
                            QUẢN LÝ NGƯỜI DÙNG
                    </router-link>


                    <!-- Nhóm danh mục -->
                    <router-link to="/admin-dashboard/list-jobtype" class="text-dark sidebar-item header">
                            <i class="fa-solid fa-briefcase"></i>
                            Quản lý loại công việc
                    </router-link>

                    <router-link to="/admin-dashboard/list-skills" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-lightbulb"></i>
                            Quản lý kỹ năng
                    </router-link>

                    <router-link to="/admin-dashboard/hierarchy-management" class="text-dark sidebar-item header">
                            <i class="fa-solid fa-ranking-star"></i>
                            Quản lý cấp bậc
                    </router-link>

                    <router-link to="/admin-dashboard/formofwork-list" class="text-dark sidebar-item header">
                            <i class="fa-solid fa-clock"></i>
                            Quản lý hình thức làm việc
                    </router-link>

                    <router-link to="/admin-dashboard/expjob-list" class="text-dark sidebar-item header">
                            <i class="fa-solid fa-chart-line"></i>
                            Quản lý kinh nghiệm làm việc
                    </router-link>

                    <router-link to="/admin-dashboard/salary-management" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-coins"></i>
                            Quản lý khoản lương
                    </router-link>

                    <router-link to="/admin-dashboard/company-management" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-building"></i>
                            Quản lý công ty
                    </router-link>


                    <!-- Nhóm quản lý bài đăng -->
                    <router-link to="/admin-dashboard/post-management" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-newspaper"></i>
                            QUẢN LÝ BÀI ĐĂNG
                    </router-link>

                    <router-link to="/admin-dashboard/transaction-management" class="sidebar-item header text-dark">
                            <i class="fa-solid fa-box-open"></i>
                            Quản lý giao dịch
                    </router-link>


                    <!-- Đăng xuất -->
                    <li class="sidebar-item logout">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Đăng xuất
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'AdminSidebar'
}
</script>

<style scoped>
.menu {
    list-style: none;
}

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
    padding: 20px 0px;
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
    font-weight: 470;
    text-transform: uppercase;
    font-size: 0.7em;
    color: #7f8c8d;
    margin-top: 5px;
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