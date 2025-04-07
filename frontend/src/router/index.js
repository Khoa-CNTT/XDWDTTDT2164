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
    //Forgot password
    path: "/forgot-password",
    component: () => import("@/views/common/Forgot_password.vue"),
    meta: { layout: "auth" },
  },
  {
    //Reset password
    path: "/reset-password",
    component: () => import("@/views/common/Reset_password.vue"),
    meta: { layout: "auth" },
  },
  {
    //OTP
    path: "/otp",
    component: () => import("@/views/common/OTP.vue"),
    meta: { layout: "auth" },
  },


  // Candidate
  {
    path: "/candidate-dashboard",
    meta: { layout: "candidate" },
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

  // Employer
  {
    path: "/employer-dashboard",
    meta: { layout: "employer" },
    children: [
      {
        path: "", // Mặc định khi vào /admin-dashboard
        redirect: "employer-dashboard", // Chuyển hướng sang trang con mặc định
      },
      {
        path: "employer-newjob",
        component: () => import("../views/employer/employer-newjob.vue"),
      },
      {
        path: "employer-info",
        component: () => import("../views/employer/employer-info.vue"),
      },
      {
        path: "employer-list",
        component: () => import("../views/employer/employer-list.vue"),
      },
      {
        path: "employer-recharge",
        component: () => import("../views/employer/employer-recharge.vue"),
      },
      {
        path: "employer-depositinformation",
        component: () =>
          import("../views/employer/employer-depositinformation.vue"),
      },
      {
        path: "employer-paymentpost",
        component: () => import("../views/employer/employer-paymentpost.vue"),
      },
      {
        path: "employer-paymenthistory",
        component: () =>
          import("../views/employer/employer-paymenthistory.vue"),
      },
      {
        path: "employer-deposithistory",
        component: () =>
          import("../views/employer/employer-deposithistory.vue"),
      },
      {
        path: "employer-workmanagement",
        component: () =>
          import("../views/employer/employer-workmanagement.vue"),
      },
      {
        path: "employer-candidates",
        component: () => import("../views/employer/employer-candidates.vue"),
      },
      {
        path: "employer-password",
        component: () => import("../views/employer/employer-password.vue"),
      },
      {
        path: "hierarchy-management",
        component: () =>
          import("../views/admin/dashboard/Hierarchy-management.vue"),
      },
      {
        path: "formofwork-list",
        component: () => import("../views/admin/dashboard/FormofWork-list.vue"),
      },
      {
        path: "expjob-list",
        component: () => import("../views/admin/dashboard/Expjob-list.vue"),
      },
      {
        path: "salary-management",
        component: () =>
          import("../views/admin/dashboard/Salary-management.vue"),
      },
      {
        path: "description-job",
        component: () => import("../views/admin/dashboard/Description-job.vue"),
      },
      {
        path: "transaction-management",
        component: () =>
          import("../views/admin/dashboard/Transaction-management.vue"),
      },
    ],
  },
  // Admin routes
  {
    path: "/admin-dashboard",
    meta: { layout: "admin" },
    children: [
      {
        path: "",
        component: () => import("@/views/admin/dashboard/Starter-admin.vue"),
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
        component: () => import("@/views/admin/dashboard/List-jobtype.vue"),
      },
      {
        path: "list-skills",
        component: () => import("@/views/admin/dashboard/List-skills.vue"),
      },
      {
        path: "hierarchy-management",
        component: () =>
          import("@/views/admin/dashboard/Hierarchy-management.vue"),
      },
      {
        path: "formofwork-list",
        component: () => import("@/views/admin/dashboard/FormofWork-list.vue"),
      },
      {
        path: "expjob-list",
        component: () => import("@/views/admin/dashboard/Expjob-list.vue"),
      },
      {
        path: "salary-management",
        component: () =>
          import("@/views/admin/dashboard/Salary-management.vue"),
      },
      {
        path: "description-job",
        component: () => import("@/views/admin/dashboard/Description-job.vue"),
      },
      {
        path: "transaction-management",
        component: () =>
          import("@/views/admin/dashboard/Transaction-management.vue"),
      },
    ],
  },

  // Guest
  {
    path: "/guest-dashboard",
    meta: { layout: "guest" },
    children: [
      {
        path: "",
        component: () => import("@/views/guest/index.vue"),
      },
    ],
  }
];

// Khởi tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
