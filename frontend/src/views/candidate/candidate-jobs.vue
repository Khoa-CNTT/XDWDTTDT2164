<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div>
            <h2 class="text-2xl font-bold mb-2 mt-4">Danh sách công việc đã lưu.</h2>
            <h6>Trở lại trang chủ</h6>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
            <div class="d-flex justify-content-between items-center border-b pb-2 mb-2">
                <span class="font-semibold">Công việc yêu thích</span>
                <select v-model="timeFilter" class="border rounded p-1">
                    <option value="6">6 tháng trước</option>
                    <option value="12">12 tháng trước</option>
                </select>
            </div>
            <table class="w-full border-collapse">
                <thead>
                    <tr class="border-b text-primary">
                        <th class="text-left p-2">Tên công việc</th>
                        <th class="p-2">Hạn nhận CV</th>
                        <th class="p-2">Trạng thái</th>
                        <th class="p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(job, index) in jobs" :key="index" class="border-b">
                        <td class="d-flex items-center p-2">
                            <img :src="job.logo" class="w-10 h-10 mr-2" width="70px" />
                            <div class="ms-3">
                                <div class="font-semibold">{{ job.title }}</div>
                                <div class="d-flex">
                                    <div class="text-gray-500 text-sm me-3"><i class="fa-solid fa-calendar"></i> {{
                                        job.segment }}</div>
                                    <div class="text-gray-500 text-sm"><i class="fa-solid fa-location-dot"></i> {{
                                        job.location }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="p-2 text-start">{{ job.deadline }}</td>
                        <td class="p-2 text-green-500 text-success">{{ job.status }}</td>
                        <td class="p-2 ">
                            <button class="mr-2 text-blue-500 me-3"><i class="fa-solid fa-eye"></i></button>
                            <button @click="removeJob(index)" class="text-red-500"><i
                                    class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const timeFilter = ref(6);
        const jobs = ref([
            {
                title: 'Software Engineer (Android), Libraries',
                segment: 'Phân đoạn',
                location: 'Đà Nẵng',
                deadline: 'Tháng 3, 10, 2025',
                status: 'Hoạt động',
                logo: 'https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg',
            },
            {
                title: 'Software Engineer (Android), Libraries',
                segment: 'Phân đoạn',
                location: 'Đà Nẵng',
                deadline: 'Tháng 3, 10, 2025',
                status: 'Hoạt động',
                logo: 'https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg',
            },
            {
                title: 'Software Engineer (Android), Libraries',
                segment: 'Phân đoạn',
                location: 'Đà Nẵng',
                deadline: 'Tháng 3, 10, 2025',
                status: 'Hoạt động',
                logo: 'https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg',
            }
        ]);

        const removeJob = (index) => {
            jobs.value.splice(index, 1);
        };

        return {
            timeFilter,
            jobs,
            removeJob
        };
    }
};
</script>

<style>
table {
    width: 100%;
    border-spacing: 0;
}

th,
td {
    border-bottom: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f9f9f9;
}
</style>