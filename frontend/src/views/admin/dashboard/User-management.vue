<template>
    <div>
        <div class="user-management">
            <h2 class="mt-5">Danh Sách Người Dùng</h2>
            <a href="blank">Quay trở lại trang chủ?</a>
            <div class="card mt-5">
                <div class="card-header">
                    <h5 class="title-header">Danh Sách Người Dùng</h5>
                </div>
                <div class="card-body">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr class="text-center align-middle">
                                <th>STT</th>
                                <th>Họ và Tên</th>
                                <th>Số điện thoại</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Quyền</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="text-center align-middle">
                            <tr>
                                <td>1</td>
                                <td>Thái Mai Quang</td>
                                <td>012345567</td>
                                <td>Nam</td>
                                <td>22/12/2003</td>
                                <td>admin</td>
                                <td><span class="badge bg-success">Đã kích hoạt</span></td>
                                <td>
                                    <button class="btn btn-warning me-2" data-bs-toggle="modal"
                                        data-bs-target="#update-modal"><i
                                            class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger"><i class="fa-solid fa-user-xmark"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal cập nhật -->
        <div class="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Cập nhật người dùng</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <label>Tên người dùng</label>
                                <input class="form-control" type="text">
                            </div>
                            <div class="col-6">
                                <label>Số điện thoại</label>
                                <input class="form-control" type="text">
                            </div>
                        </div>
                        <div class="mt-2">
                            <label>Địa chỉ</label>
                            <input class="form-control" type="text">
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <label for="gioi_tinh" class="form-label">Giới tính</label>
                                <select class="form-select" id="gioi_tinh" name="gioi_tinh"
                                    aria-placeholder="Chọn giới tính...">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label>Ngày sinh</label>
                                <input class="form-control" type="date">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <label for="gioi_tinh" class="form-label">Quyền</label>
                                <select class="form-select" id="gioi_tinh" name="gioi_tinh"
                                    aria-placeholder="Chọn quyền truy cập">
                                    <option value="Nam">admin</option>
                                    <option value="Nữ">Ứng viên</option>
                                    <option value="Khác">Công ty</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="gioi_tinh" class="form-label">Trạng thái</label>
                                <select class="form-select" id="gioi_tinh" name="gioi_tinh"
                                    aria-placeholder="Chọn trạng thái...">
                                    <option value="Nam">Kích hoạt</option>
                                    <option value="Nữ">Dừng hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-primary">Cập nhật</button>
                    </div>
                </div>
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