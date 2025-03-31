import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/admin/dashboard/index_2.vue"; // Trang chứa layout chính

const routes = [
  {
    //Login
    // path: "/login-signup",
    // component: ()=> import("@/views/common/Login.vue"),


    path: "/admin-dashboard",
    // component: Dashboard, // Luôn hiển thị Dashboard.vue
    children: [
      {
        path: "", // Mặc định khi vào /admin-dashboard
        redirect: "admin-dashboard", // Chuyển hướng sang trang con mặc định
      },
      {
        path: "user-management", 
        component: () => import("@/views/admin/dashboard/User-management.vue"),
      },
      
      {
        path: "company-management",
        component: () => import("@/views/admin/dashboard/Company-management.vue"),
      },
      {
        path: "post-management",
        component: () => import("@/views/admin/dashboard/Post-management.vue"),
      },
      {
        path: "list-jobtype",
        component: () => import("../views/admin/dashboard/List-jobtype.vue"),
      },
      {
        path: "list-skills",
        component: () => import("../views/admin/dashboard/List-skills.vue"),
      },
    ],
  },
];

// Khởi tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
