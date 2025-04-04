<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">Thay đổi mật khẩu</h2>
        <p class="text-sm text-gray-500 mb-6 cursor-pointer">🔙 Trở lại trang chủ?</p>
        <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
            <div class="bg-gray-100 p-6 rounded-md">
                <h3 class="text-lg font-semibold mb-4 pt-3 ms-2">Thay đổi mật khẩu</h3>
                <div class="col-lg-7">
                    <form @submit.prevent="changePassword">
                        <label class="block text-sm font-medium mb-2 ms-4">Mật khẩu cũ</label> <br>
                        <input v-model="oldPassword" type="password"
                            class=" form-control border p-2 rounded-md mb-4 ms-4" required /> <br>

                        <label class="block text-sm font-medium mb-2 ms-4">Mật khẩu mới</label> <br>
                        <input v-model="newPassword" type="password"
                            class="form-control  border p-2 rounded-md mb-4 ms-4" required /> <br>

                        <label class="block text-sm font-medium mb-2 ms-4">Nhập lại mật khẩu</label> <br>
                        <input v-model="confirmPassword" type="password"
                            class="form-control border p-2 rounded-md mb-4 ms-4" br required />

                        <button @click="saveProfile"
                            class="mt-4 bg-blue-500 text-white px-5 py-2 rounded ms-4 mb-5 bg-primary">Lưu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        };
    },
    methods: {
        changePassword() {
            if (this.newPassword !== this.confirmPassword) {
                alert("Mật khẩu mới không khớp!");
                return;
            }
            alert("Mật khẩu đã được thay đổi thành công!");
            // Xử lý lưu mật khẩu vào backend tại đây
        }
    }
};
</script>

<style scoped>
button {
    cursor: pointer;
}
</style>