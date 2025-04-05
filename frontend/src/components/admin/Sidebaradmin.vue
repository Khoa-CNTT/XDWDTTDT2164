<template>
    <nav class="sidebar">
        <div class="menu">
            <div class="menu-section">
                <ul class="sidebar-list">
                    <!-- Trang Chủ -->
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/admin-starter" class="text-dark">
                            <i class="fa-solid fa-house"></i>
                            <span>Trang Chủ</span>
                        </router-link>
                    </li>
                    <!-- Nhóm quản lý người đùng -->
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/user-management" class="text-dark">
                            <i class="fa-regular fa-user"></i>
                            QUẢN LÝ NGƯỜI DÙNG
                        </router-link>
                    </li>

                    <!-- Nhóm danh mục -->
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/list-jobtype" class="text-dark">
                            <i class="fa-solid fa-briefcase"></i>
                            Quản lý loại công việc
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/list-skills" class="text-dark">
                            <i class="fa-solid fa-lightbulb"></i>
                            Quản lý kỹ năng
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/hierarchy-management" class="text-dark">
                            <i class="fa-solid fa-ranking-star"></i>
                            Quản lý cấp bậc
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/formofwork-list" class="text-dark">
                            <i class="fa-solid fa-clock"></i>
                            Quản lý hình thức làm việc
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/expjob-list" class="text-dark">
                            <i class="fa-solid fa-chart-line"></i>
                            Quản lý kinh nghiệm làm việc
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/salary-management" class="text-dark">
                            <i class="fa-solid fa-coins"></i>
                            Quản lý khoản lương
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/company-management" class="text-dark">
                            <i class="fa-solid fa-building"></i>
                            Quản lý công ty
                        </router-link>

                    </li>

                    <!-- Nhóm quản lý bài đăng -->
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/post-management" class="text-dark">
                            <i class="fa-solid fa-newspaper"></i>
                            QUẢN LÝ BÀI ĐĂNG
                        </router-link>
                    </li>
                    <li class="sidebar-item header">
                        <router-link to="/admin-dashboard/transaction-management" class="text-dark">
                            <i class="fa-solid fa-box-open"></i>
                            Quản lý giao dịch
                        </router-link>
                    </li>

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
    padding: 20px 10px;
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
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.9em;
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