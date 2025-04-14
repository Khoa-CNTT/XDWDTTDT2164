<template>
    <div>
        <div class="list-skills">
            <h2>Danh Sách Kỹ Năng</h2>
            <a href="blank">Quay trở lại trang chủ?</a>
            <div class="card mt-5">
                <div class="card-header d-flex justify-content-between">
                    <h5 class="title-header mt-2">Danh Sách Kỹ Năng</h5>
                    <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
                        style="width: 150px; height: 40px;">Thêm mới</button>
                </div>
                <div class="card-body">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr class="text-center align-middle">
                                <th>STT</th>
                                <th>Tên kỹ năng</th>
                                <th>Mã code</th>
                                <th>Danh mục</th>
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
                                <td>Công nghệ thông tin</td>
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
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm mới kỹ năng</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label>Tên kỹ năng</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="mt-3">
                            <label>Danh mục công việc</label>
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
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Cập nhật kỹ năng</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label class="mb-2">Tên kỹ năng</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="mt-2">
                            <label class="mb-2">Danh mục công việc</label>
                            <select name="danh_muc_cong_viec" class="form-select"
                                aria-placeholder="Chọn danh mục công việc">
                                <option value="1">Công nghệ thông tin</option>
                                <option value="1">An ninh mạng</option>
                                <option value="1">FrontEnd ReactJS</option>
                                <option value="1">BackEnd ReactJS</option>
                            </select>
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