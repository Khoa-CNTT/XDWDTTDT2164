<template>
    <div>
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
                                        data-bs-target="#update-modal"><i
                                            class="fa-solid fa-pen-to-square"></i></button>
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
                        <div class="card">
                            <div class="card-header">
                                <h5>Thông tin loại công việc</h5>
                            </div>
                            <div class="card-body">
                                <form>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Tên loại công việc</label>
                                            <input type="text" class="form-control" placeholder="Công nghệ thông tin"
                                                v-model="newJobType.name">
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Hình ảnh</label>
                                        <div class="image-upload-container">
                                            <div class="upload-actions mb-3">
                                                <button type="button" class="btn btn-outline-primary"
                                                    @click="triggerFileInput">
                                                    <i class="fas fa-image"></i> Chèn ảnh
                                                </button>
                                                <input type="file" ref="fileInput" style="display: none;"
                                                    @change="handleImageUpload">
                                                <button type="button" class="btn btn-primary" @click="saveImage">
                                                    <i class="fas fa-save"></i> Lưu
                                                </button>
                                            </div>
                                            <div class="image-preview">
                                                <p>Hình ảnh hiển thị</p>
                                                <div v-if="newJobType.imageUrl" class="preview-image">
                                                    <img :src="newJobType.imageUrl" alt="Preview">
                                                </div>
                                                <div v-else class="empty-preview">
                                                    <i class="fas fa-image"></i>
                                                    <span>Chưa có hình ảnh</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-primary" @click="addNewJobType">Thêm mới</button>
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
                        <div class="card">
                            <div class="card-header">
                                <h5>Thông tin loại công việc</h5>
                            </div>
                            <div class="card-body">
                                <form>
                                    <div class="row mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Tên loại công việc</label>
                                            <input type="text" class="form-control" placeholder="Công nghệ thông tin"
                                                v-model="updateJobType.name">
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Hình ảnh</label>
                                        <div class="image-upload-container">
                                            <div class="upload-actions mb-3">
                                                <button type="button" class="btn btn-outline-primary"
                                                    @click="triggerFileInputUpdate">
                                                    <i class="fas fa-image"></i> Chèn ảnh
                                                </button>
                                                <input type="file" ref="fileInputUpdate" style="display: none;"
                                                    @change="handleImageUploadUpdate">
                                                <button type="button" class="btn btn-primary" @click="saveImageUpdate">
                                                    <i class="fas fa-save"></i> Lưu
                                                </button>
                                            </div>
                                            <div class="image-preview">
                                                <p>Hình ảnh hiển thị</p>
                                                <div v-if="updateJobType.imageUrl" class="preview-image">
                                                    <img :src="updateJobType.imageUrl" alt="Preview">
                                                </div>
                                                <div v-else class="empty-preview">
                                                    <i class="fas fa-image"></i>
                                                    <span>Chưa có hình ảnh</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-primary" @click="updateJobTypeDetails">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Listjobtype",
    data() {
        return {
            newJobType: {
                name: '',
                slug: '',
                status: 'active',
                imageUrl: null,
                imageFile: null
            },
            updateJobType: {
                name: '',
                slug: '',
                status: 'active',
                imageUrl: null,
                imageFile: null
            }
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.newJobType.imageFile = file;
                this.newJobType.imageUrl = URL.createObjectURL(file);
            }
        },
        saveImage() {
            if (!this.newJobType.imageFile) {
                alert('Vui lòng chọn ảnh trước khi lưu');
                return;
            }
            // Xử lý lưu ảnh ở đây (có thể gọi API)
            alert('Đã lưu ảnh thành công');
        },
        addNewJobType() {
            if (!this.newJobType.name) {
                alert('Vui lòng nhập tên loại công việc');
                return;
            }

            // Tạo slug từ tên
            this.newJobType.slug = this.createSlug(this.newJobType.name);

            // Xử lý thêm mới ở đây (có thể gọi API)
            console.log('Thêm mới loại công việc:', this.newJobType);
            alert('Đã thêm mới loại công việc thành công');

            // Reset form
            this.resetForm();

            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('add-modal'));
            modal.hide();
        },
        createSlug(name) {
            return name.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
        },
        resetForm() {
            this.newJobType = {
                name: '',
                slug: '',
                status: 'active',
                imageUrl: null,
                imageFile: null
            };
        },
        triggerFileInputUpdate() {
            this.$refs.fileInputUpdate.click();
        },
        handleImageUploadUpdate(event) {
            const file = event.target.files[0];
            if (file) {
                this.updateJobType.imageFile = file;
                this.updateJobType.imageUrl = URL.createObjectURL(file);
            }
        },
        saveImageUpdate() {
            if (!this.updateJobType.imageFile) {
                alert('Vui lòng chọn ảnh trước khi lưu');
                return;
            }
            // Xử lý lưu ảnh ở đây (có thể gọi API)
            alert('Đã lưu ảnh thành công');
        },
        updateJobTypeDetails() {
            if (!this.updateJobType.name) {
                alert('Vui lòng nhập tên loại công việc');
                return;
            }
        },

        // // Tạo slug từ tên
        // this.updateJobType.slug = this.createSlug(this.updateJobType.name);

        // // Xử lý cập nhật ở đây (có thể gọi API)
        // console.log('Cập nhật loại công việc:', this.updateJobType);
        // alert('Đã cập nhật loại công việc thành công');

        // // Reset form
        // this.resetFormUpdate();

        // // Đóng modal
        // const modal = bootstrap.Modal.getInstance(document.getElementById('update-modal'));
        // modal.hide();
    },
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

/* Style cho card trong modal */
.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: none;
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    padding: 15px;
}

.card-header h5 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
}

.card-body {
    padding: 20px;
}

.image-upload-container {
    border: 1px dashed #ced4da;
    border-radius: 4px;
    padding: 15px;
}

.upload-actions {
    display: flex;
    gap: 10px;
}

.empty-preview {
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 4px;
    color: #adb5bd;
    text-align: center;
}

.empty-preview i {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
}

.preview-image img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
}

.image-preview p {
    margin-bottom: 15px;
    color: #6c757d;
    text-align: center;
}
</style>