<template>
    <div>
        <div class="formofwork-list">
            <h2>Danh Sách Hình Thức Làm Việc</h2>
            <a href="blank">Quay trở lại trang chủ?</a>
            <div class="card mt-5">
                <div class="card-header d-flex justify-content-between">
                    <h5 class="title-header mt-2">Danh Sách Hình Thức Làm Việc</h5>
                    <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
                        style="width: 150px; height: 40px;">Thêm mới</button>
                </div>
                <div class="card-body">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr class="text-center align-middle">
                                <th>STT</th>
                                <th>Hình thức làm việc</th>
                                <th>Mã code</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="text-center align-middle">
                            <tr>
                                <td>1</td>
                                <td>
                                    Làm việc Full-time
                                </td>
                                <td>Ful-time</td>
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
                            <tr>
                                <td>1</td>
                                <td>
                                    Làm việc Part-time
                                </td>
                                <td>Part-time</td>
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
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm mới hình thức làm việc</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label>Tên hình thức làm việc</label>
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
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Cập nhật hình thức làm việc</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label class="mb-2">Tên hình thức làm việc</label>
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