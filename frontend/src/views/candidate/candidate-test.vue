<template>
    <div>
        <div>
            <h1 class="mt-3">Xin chào , Shu</h1>
            <h6>Trở lại trang chủ ?</h6>
        </div>
        <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h4 class="text-xl font-semibold mb-6 ms-5 pt-4">Hồ sơ của tôi</h4>
            <div class="d-flex align-items-center justify-content-between mb-4 ms-5">
                <div class="d-flex align-items-start">
                    <label for="uploadImage" class="position-relative d-inline-block text-center cursor-pointer">
                        <div class="border border-dashed rounded-3" style="width: 150px; height: 150px;">
                            <div class="d-flex flex-column align-items-center justify-content-center h-100">
                                <i class="fas fa-arrow-up fa-2x text-muted mb-2"></i>
                                <span class="text-muted">Chèn ảnh</span>
                            </div>
                        </div>
                    </label>
                    <input type="file" id="uploadImage" class="d-none" accept=".jpg, .png"
                        onchange="previewImage(event)">

                    <div class="ms-4 flex-grow-1">
                        <small class="text-muted d-block mb-2">
                            Kích thước tệp tối đa là 1MB, kích thước tối thiểu: 330x300 và các tệp phù hợp: .jpg & .png
                        </small>
                    </div>
                </div>

            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="row">
                    <div class="col-lg-5">
                        <div>
                            <label class="block mb-1 mt-1 ms-5 me-4">Tên đầy đủ</label> <br>
                            <input v-model="profile.fullName" class="form-control p-2 ms-5"
                                placeholder="Nguyễn Văn A" />
                        </div>
                        <div>
                            <label class="block mb-1 mt-4 ms-5 me-4">Số điện thoại</label><br>
                            <input v-model="profile.phone" class="form-control p-2 ms-5" placeholder="0123456789" />
                        </div>
                        <div>
                            <label class="block mb-1 mt-4 ms-5 me-4">Kinh nghiệm làm việc</label> <br>
                            <input v-model="profile.experience" class="form-control p-2 ms-5"
                                placeholder="5 - 10 năm" />
                        </div>
                        <div>
                            <label class="block mb-1 mt-4 ms-5 me-4">Địa chỉ</label><br>
                            <input v-model="profile.address" class="form-control p-2 ms-5" />
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div>
                            <label class="block mb-1 mt-1 ms-5 me-4">Danh mục làm việc</label> <br>
                            <input v-model="profile.workingdirectory" class="form-control p-2 ms-5"
                                placeholder="FullStack Development" />
                        </div>
                        <div>
                            <label class="block mb-1 mt-4 ms-5 me-4">Vị trí ứng tuyển</label> <br>
                            <input v-model="profile.candidateposition" class="form-control p-2 ms-5"
                                placeholder="ReactJS , Node JS" />
                        </div>
                        <div>
                            <label class="block mb-1 mt-4 ms-5 me-4">Ngày sinh</label><br>
                            <input v-model="profile.date" class="form-control p-2 ms-5" placeholder="22/12/2003" />
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div>
                                    <label class="block mb-1 mt-4 ms-5 me-4">Mức lương</label><br>
                                    <input v-model="profile.expectedSalary" class="form-control p-2 ms-5"
                                        placeholder="4K - 5K                                 USD" />
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div>
                                    <label class="block mb-1 mt-4 ms-5 me-4">Giới tính</label><br>
                                    <input v-model="profile.gender" class="form-control p-2 ms-5" placeholder="Nam" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="saveProfile"
                class="mt-4 bg-blue-500 text-white px-4 py-2 rounded ms-5 mb-5 bg-primary">Lưu</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile: {
                fullName: "",
                phone: "",
                experience: "",
                address: "",
                workingdirectory: "",
                candidateposition: "",
                date: "",
                education: "",
                expectedSalary: "",
                gender: "",
            }
        };
    },
    methods: {
        uploadImage(event) {
            console.log("Image selected", event.target.files[0]);
        },
        saveProfile() {
            console.log("Profile saved", this.profile);
        }
    }
};
</script>

<style>
body {
    background-color: #f3f4f6;
}
</style>