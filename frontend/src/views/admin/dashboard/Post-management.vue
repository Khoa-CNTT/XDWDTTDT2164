<template>
    <div class="post-management">
        <h2 class="mt-5">Danh Sách Bài Đăng</h2>
        <a href="blank">Quay trở lại trang chủ?</a>
        <div class="card mt-5">
            <div class="card-header">
                <h5 class="title-header">Danh Sách Bài Đăng</h5>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center align-middle">
                            <th>STT</th>
                            <th>Tên bài đăng</th>
                            <th>Tên công ty</th>
                            <th>Tên người dùng</th>
                            <th>Ngày kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-center align-middle">
                        <tr>
                            <td>1</td>
                            <td>
                                Tuyển FullStack ReactJS
                                <router-link to="/admin-dashboard/description-job">
                                    <button class="badge bg-info ms-2">Chi tiết</button>
                                </router-link>
                            </td>
                            <td>Công ty TNHH Superio</td>
                            <td>Holy Nam</td>
                            <td>15/04/2025</td>
                            <td><span class="badge bg-success">Đã duyệt</span></td>
                            <td>
                                <button class="btn btn-success me-2"><i class="fa-solid fa-check"></i></button>
                                <button class="btn btn-danger me-2"><i class="fa-solid fa-xmark"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "UserManagement",

}
</script>

<style scoped>
.title-header {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>