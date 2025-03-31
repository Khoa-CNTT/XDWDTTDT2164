<template>
    <div class="list-jobtype">
        <h2>Danh Sách Loại Công Việc</h2>
        <a href="blank">Quay trở lại trang chủ?</a>
        <div class="card mt-5">
            <div class="card-header d-flex justify-content-between">
                <h5 class="title-header mt-2">Danh Sách Loại Công Việc</h5>
                <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add-modal"
                    style="width: 150px; height: 40px;">Thêm mới</button>
            </div>
            <div class="card-body">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center align-middle">
                            <th>STT</th>
                            <th>Tên công việc</th>
                            <th>Slug công việc</th>
                            <th>Hình ảnh</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-center align-middle">
                        <tr>
                            <td>1</td>
                            <td>
                                Công nghệ thông tin
                            </td>
                            <td>cong-nghe-thong-tin</td>
                            <td><img class="img-logo"
                                    src="https://alumninetwork.rmit.edu.vn/wp-content/uploads/formidable/3/image-20221220115751-1.png"
                                    alt="logo-company"></td>
                            <td><span class="badge bg-success">Hoạt động</span></td>
                            <td>
                                <button class="btn btn-success me-2" data-bs-toggle="modal"
                                    data-bs-target="#update-modal"><i class="fa-solid fa-pen-to-square"></i></button>
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
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Thêm mới loại công việc</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6">
                            <label>Tên công việc</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-6">
                            <label>Slug công việc</label>
                            <input type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-6">
                            <label>Hình ảnh</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-6 ">
                            <label>Trạng thái</label>
                            <select class="form-select" name="trang-thai" id="trang-thai"
                                aria-placeholder="Chọn trạng thái...">
                                <option value="hoat-dong">Hoạt động</option>
                                <option value="ngung-hoat-dong">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Thêm mới</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal cập nhật -->
    <div class="modal fade" id="update-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Cập nhật loại công việc</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6">
                            <label>Tên công việc</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-6">
                            <label>Slug công việc</label>
                            <input type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-6">
                            <label>Hình ảnh</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-6 ">
                            <label>Trạng thái</label>
                            <select class="form-select" name="trang-thai" id="trang-thai"
                                aria-placeholder="Chọn trạng thái...">
                                <option value="hoat-dong">Hoạt động</option>
                                <option value="ngung-hoat-dong">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cập nhật</button>
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