import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    //Login
    path: "/login",
    component: () => import("@/views/common/Login.vue"),
    meta: { layout: "auth" },
  },
  {
    //Register
    path: "/register",
    component: () => import("@/views/common/Sign_up.vue"),
    meta: { layout: "auth" },
  },
  {
    //Quên mật khẩu
    path: "/forgot-password",
    component: () => import("@/views/common/Forgot_password.vue"),
    meta: { layout: "auth" },

  },
  {
    //Tạo mật khẩu mới
    path: "/reset-password",
    component: () => import("@/views/common/Reset_password.vue"),
    meta: { layout: "auth" },

  },
  {
    //OTP
    path: "/confirm-otp",
    component: () => import("@/views/common/Otp.vue"),
    meta: { layout: "auth" },

  },
  {
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
        component: () =>
          import("@/views/admin/dashboard/Company-management.vue"),
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
