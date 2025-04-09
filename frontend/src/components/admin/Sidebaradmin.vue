<template>
    <nav class="sidebar">
        <div class="menu">
            <div class="menu-section">
                <ul class="sidebar-list">
                    <!-- Trang Chủ -->
                    <router-link to="/admin-dashboard" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-house"></i>
                            <span>Trang Chủ</span>
                        </li>
                    </router-link>

                    <!-- Nhóm quản lý người đùng -->
                    <router-link to="/admin-dashboard/user-management" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-regular fa-user"></i>
                            QUẢN LÝ NGƯỜI DÙNG
                        </li>
                    </router-link>


                    <!-- Nhóm danh mục -->
                    <router-link to="/admin-dashboard/list-jobtype" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-briefcase"></i>
                            Quản lý loại công việc
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/list-skills" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-lightbulb"></i>
                            Quản lý kỹ năng
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/hierarchy-management" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-ranking-star"></i>
                            Quản lý cấp bậc
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/formofwork-list" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-clock"></i>
                            Quản lý hình thức làm việc
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/expjob-list" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-chart-line"></i>
                            Quản lý kinh nghiệm làm việc
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/salary-management" class="text-dark">

                        <li class="sidebar-item header">
                            <i class="fa-solid fa-coins"></i>
                            Quản lý khoản lương
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/company-management" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-building"></i>
                            Quản lý công ty
                        </li>
                    </router-link>


                    <!-- Nhóm quản lý bài đăng -->
                    <router-link to="/admin-dashboard/post-management" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-newspaper"></i>
                            QUẢN LÝ BÀI ĐĂNG
                        </li>
                    </router-link>

                    <router-link to="/admin-dashboard/transaction-management" class="text-dark">
                        <li class="sidebar-item header">
                            <i class="fa-solid fa-box-open"></i>
                            Quản lý giao dịch
                        </li>
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