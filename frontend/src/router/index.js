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

  // Candidate
  {
    path: "/candidate-dashboard",
    // component: Dashboard, // Luôn hiển thị Dashboard.vue
    children: [
      {
        path: "candidate-test",
        component: () => import("@/views/candidate/candidate-test.vue"),
      },
      {
        path: "candidate-jobs",
        component: () => import("@/views/candidate/candidate-jobs.vue"),
      },
      {
        path: "candidate-apply",
        component: () => import("@/views/candidate/candidate-apply.vue"),
      },
      {
        path: "candidate-password",
        component: () => import("@/views/candidate/candidate-password.vue"),
      },
    ],
  },
{
  path: "/employer-dashboard",
  children:[
      {
        path: "", // Mặc định khi vào /admin-dashboard
        redirect: "employer-dashboard", // Chuyển hướng sang trang con mặc định
      },
      {
        path: "employer-morestaff",
        component: () => import("../views/employer/employer-morestaff.vue"),
        //Thêm mới nhân viên
      },
      {
        path: "employer-newjob",
        component: () => import("../views/employer/employer-newjob.vue"),
        // Cập nhật thông tin 
      },
      {
        path: "employer-info",
        component: () => import("../views/employer/employer-info.vue"),
        // Hồ sơ công ty
      },
      {
        path: "employer-list",
        component: () => import("../views/employer/employer-list.vue"),
        // Danh sách nhân viên 
      },
      {
        path: "employer-recharge",
        component: () => import("../views/employer/employer-recharge.vue"),
        // Nạp tiền vào tài khoản
      },
      {
        path: "employer-depositinformation",
        component: () => import("../views/employer/employer-depositinformation.vue"),
        // Thông tin nạp tiền
      },
      {
        path: "employer-paymentpost",
        component: () => import("../views/employer/employer-paymentpost.vue"),
        // Thanh toán bài đăng
      },
      {
        path: "employer-paymenthistory",
        component: () => import("../views/employer/employer-paymenthistory.vue"),
        // Lịch sử thanh toán
      },
      {
        path: "employer-deposithistory",
        component: () => import("../views/employer/employer-deposithistory.vue"),   
        // Lịch sử nạp tiền
      },

  ]
},

  {
    path: "/employer-dashboard",
    children: [
      {
        path: "", // Mặc định khi vào /admin-dashboard
        redirect: "employer-dashboard", // Chuyển hướng sang trang con mặc định
      },
      {
        path: "employer-info",
        component: () => import("../views/employer/employer-info.vue"),
      },
      {
        path: "employer-workmanagement",
        component: () => import("../views/employer/employer-workmanagement.vue"),
      },
      {
        path: "employer-candidates",
        component: () => import("../views/employer/employer-candidates.vue"),
      },
      {
        path: "employer-password",
        component: () => import("../views/employer/employer-password.vue"),
      },
    ],
  },


  //Admin
  // {
  //   path: "/admin-dashboard",
  //   // component: Dashboard, // Luôn hiển thị Dashboard.vue
  //   children: [
  //     {
  //       path: "", // Mặc định khi vào /admin-dashboard
  //       redirect: "admin-dashboard", // Chuyển hướng sang trang con mặc định
  //     },
  //     {
  //       path: "user-management",
  //       component: () => import("@/views/admin/dashboard/User-management.vue"),
  //     },

  //     {
  //       path: "company-management",
  //       component: () =>
  //         import("@/views/admin/dashboard/Company-management.vue"),
  //     },
  //     {
  //       path: "post-management",
  //       component: () => import("@/views/admin/dashboard/Post-management.vue"),
  //     },
  //     {
  //       path: "list-jobtype",
  //       component: () => import("../views/admin/dashboard/List-jobtype.vue"),
  //     },
  //     {
  //       path: "list-skills",
  //       component: () => import("../views/admin/dashboard/List-skills.vue"),
  //     },
  //   ],
  // },
];

// Khởi tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
