<template>
    <div class="hierarchy-management">
        <h2>Quản Lý Cấp Bậc</h2>
        <a href="blank">Quay trở lại trang chủ?</a>
        <div class="card mt-5">
            <div class="card-header d-flex justify-content-between">
                <h5 class="title-header mt-2">Quản Lý Cấp Bậc</h5>
                <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
                    style="width: 150px; height: 40px;">Thêm mới</button>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center align-middle">
                            <th>STT</th>
                            <th>Tên cấp bậc</th>
                            <th>Mã code</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-center align-middle">
                        <tr>
                            <td>1</td>
                            <td>
                                ReactJS
                            </td>
                            <td>reactjs</td>
                            <td><span class="badge bg-success">Hoạt động</span></td>
                            <td>
                                <button class="btn btn-success me-2" data-bs-toggle="modal"
                                    data-bs-target="#update-modal">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="btn btn-danger me-2">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal thêm mới -->
    <div class="modal fade" id="add-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm mới cấp bậc</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <label>Tên cấp bậc</label>
                        <input type="text" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal cập nhật -->
    <div class="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Cập nhật cấp bậc</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <label class="mb-2">Tên cấp bậc</label>
                        <input type="text" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Listjobtype",

}
</script>

<style scoped>
.title-header {
    padding-top: 10px;
    padding-bottom: 10px;
}

.img-logo {
    width: 100px;
    white-space: nowrap;
}
</style>