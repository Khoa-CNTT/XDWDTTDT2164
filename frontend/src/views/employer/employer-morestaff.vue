<template>
    <div class="min-h-screen bg-blue-50 p-6">
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Thêm mới nhân viên</h2>
            <a href="#" class="text-blue-500 text-sm mb-6 inline-block">Trở lại trang chủ?</a>
        </div>
        <div class="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="row">
                    <h3 class="mt-3 ms-3">Tuyển dụng nhân viên</h3>
                    <div class="col-lg-5">
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Tên nhân viên</label>
                            <input type="text"
                                class="form-control mt-1 px-4 py-2 border rounded-lg bg-gray-100 mt-3 ms-3"
                                placeholder="Hoàng Văn Ngọc Quý" />
                        </div>
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Số điện thoại</label>
                            <input type="text"
                                class="form-control mt-1 px-4 py-2 border rounded-lg bg-gray-100 mt-3 ms-3"
                                placeholder="0123 456 789" />
                        </div>
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Địa chỉ</label>
                            <input type="text"
                                class="form-control mt-1 px-4 py-2 border rounded-lg bg-gray-100 mt-3 ms-3"
                                placeholder="256 Nguyen Van Linh, DN" />
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Địa chỉ email</label>
                            <input type="email"
                                class="form-control mt-1 px-4 py-2 border rounded-lg bg-gray-100 mt-3 ms-3"
                                placeholder="info@gmail.com" />
                        </div>
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Mật khẩu</label>
                            <div class=" d-flex relative mt-1 ms-3">
                                <input :type="showPassword ? 'text' : 'password'"
                                    class="form-control w-full px-4 py-2 border rounded-lg bg-gray-100 pr-10"
                                    placeholder="11122233" />
                                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    @click="togglePassword">
                                    <span v-if="showPassword">🙈</span>
                                    <span v-else>👁️</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 mt-3 ms-3">Quyền</label>
                            <input type="text"
                                class="form-control mt-1 px-4 py-2 border rounded-lg bg-gray-100 mt-3 ms-3"
                                placeholder="Công ty" />
                        </div>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <button type="submit"
                        class="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow mt-5 mb-5 ms-3">
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
// Không cần logic gì thêm vì đây là giao diện tĩnh
import { ref } from 'vue'

const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}
</script>

<style>
/* Nếu cần thêm CSS tuỳ chỉnh ngoài Tailwind */
</style>