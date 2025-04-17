<template>
    <div class="company-management">
        <h2 class="mt-5">Danh Sách Công Ty</h2>
        <a href="blank">Quay trở lại trang chủ?</a>
        <div class="card mt-5">
            <div class="card-header">
                <h5 class="title-header">Danh Sách Công Ty</h5>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center align-middle">
                            <th>STT</th>
                            <th>Mã công ty</th>
                            <th>Tên công ty</th>
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>
                            <th>Kiểm duyệt</th>
                            <th>Ngày khởi tạo</th>
                        </tr>
                    </thead>
                    <tbody class="text-center align-middle">
                        <tr>
                            <td>1</td>
                            <td>21</td>
                            <td>Công ty TNHH Superio</td>
                            <td>012345567</td>
                            <td><span class="badge bg-success">Hoạt Động</span></td>
                            <td><span class="badge bg-success">Đã kiểm duyệt</span></td>
                            <td>30/4/2025 </td>
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