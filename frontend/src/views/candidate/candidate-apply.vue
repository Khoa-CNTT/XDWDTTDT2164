<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div>
      <h2 class="text-2xl font-bold mb-2 mt-4">Công việc đã ứng tuyển</h2>
      <h6>Trở lại trang chủ</h6>
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <div
        class="d-flex justify-content-between items-center border-b pb-2 mb-2"
      >
        <span class="font-semibold">Đã ứng tuyển</span>
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
                  <div class="text-gray-500 text-sm me-3">
                    <i class="fa-solid fa-calendar"></i> {{ job.segment }}
                  </div>
                  <div class="text-gray-500 text-sm">
                    <i class="fa-solid fa-location-dot"></i> {{ job.location }}
                  </div>
                </div>
              </div>
            </td>
            <td class="p-2 text-start">{{ job.deadline }}</td>
            <td class="p-2 text-green-500 text-success">{{ job.status }}</td>
            <td class="p-2">
              <button class="mr-2 text-blue-500 me-3">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click="removeJob(index)" class="text-red-500">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const timeFilter = ref(6);
    const jobs = ref([
      {
        title: "Software Engineer (Android), Libraries",
        segment: "Phân đoạn",
        location: "Đà Nẵng",
        deadline: "Tháng 3, 03, 2025",
        status: "Hoạt động",
        logo: "https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg",
      },
      {
        title: "Software Engineer (Android), Libraries",
        segment: "Phân đoạn",
        location: "Đà Nẵng",
        deadline: "Tháng 3, 03, 2025",
        status: "Hoạt động",
        logo: "https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg",
      },
      {
        title: "Software Engineer (Android), Libraries",
        segment: "Phân đoạn",
        location: "Đà Nẵng",
        deadline: "Tháng 3, 03, 2025",
        status: "Hoạt động",
        logo: "https://careers.techvify.com.vn/wp-content/uploads/2022/07/vuejs-la-gi-2.jpg",
      },
    ]);

    const removeJob = (index) => {
      jobs.value.splice(index, 1);
    };

    return {
      timeFilter,
      jobs,
      removeJob,
    };
  },
};
</script>

<style scoped>
/* Table base style */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
}

thead th {
  background-color: #f4f6f8;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.875rem;
  border-bottom: 2px solid #e5e7eb;
}

tbody tr:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s ease-in-out;
}

tbody td {
  font-size: 0.95rem;
  color: #4b5563;
  vertical-align: middle;
}

/* Job title cell */
td .font-semibold {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

td img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}

td .text-sm {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Buttons */
button {
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.1);
}

.text-blue-500:hover {
  color: #2563eb;
}

.text-red-500:hover {
  color: #dc2626;
}

/* Filter select */
select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  font-size: 0.9rem;
  outline: none;
}

select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Section titles */
h2 {
  color: #1f2937;
}

h6 {
  color: #6b7280;
  cursor: pointer;
}

h6:hover {
  text-decoration: underline;
}

/* Status color */
.text-success {
  color: #10b981;
}
</style>
