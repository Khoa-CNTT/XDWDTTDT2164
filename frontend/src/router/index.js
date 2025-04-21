import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/useAuthStore";

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
        component: () => import("@/views/employer/employer-newjob.vue"),
      },
      {
        path: "employer-job-payment/:jobId",
        component: () => import("@/views/employer/employer-job-payment.vue"),
      },
      {
        path: "employer-info",
        component: () => import("@/views/employer/employer-info.vue"),
      },
      {
        path: "employer-list",
        component: () => import("@/views/employer/employer-list.vue"),
      },
      {
        path: "employer-recharge",
        component: () => import("@/views/employer/employer-recharge.vue"),
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
        path: "employer-candidates/:jobId",
        component: () => import("@/views/employer/employer-candidates.vue"),
      },
      {
        path: "employer-candidate-detail/:applyId",
        component: () =>
          import("@/views/employer/employer-candidate-detail.vue"),
      },
      {
        path: "employer-password",
        component: () => import("@/views/employer/employer-password.vue"),
      },
    ],
  },

  // Admin routes
  {
    path: "/admin-dashboard",
    meta: { layout: "admin", requiresAuth: true, role: "admin" },
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
        path: "description-job/:jobId",
        component: () => import("@/views/admin/dashboard/Description-job.vue"),
      },
      {
        path: "transaction-management",
        component: () =>
          import("@/views/admin/dashboard/Transaction-management.vue"),
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
    path: "/",
    meta: { layout: "guest" },
    children: [
      {
        path: "/",
        component: () => import("@/views/common/index.vue"),
      },
      {
        path: "/job_details",
        component: () => import("@/views/common/Job_details.vue"),
      },
      {
        path: "/conditions",
        component: () => import("../views/common/Conditions.vue"),
      },
      {
        path: "/abouts",
        component: () => import("../views/common/Abouts.vue"),
      },
      {
        path: "/company-details",
        component: () => import("../views/common/Companydetails.vue"),
      },
      {
        path: "/page-not-found",
        component: () => import("../views/common/Pagenotfound.vue"),
      },
      {
        path: "/list",
        component: () => import("../views/common/List.vue"),
      },
      {
        path: "/list-company",
        component: () => import("../views/common/ListCompany.vue"),
      },
    ],
  },
];

// Khởi tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Nếu đã đăng nhập và cố gắng truy cập vào trang login, chuyển hướng đến trang dashboard hoặc trang chủ
  if (
    isAuthenticated &&
    (to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/forgot-password" ||
      to.path === "/reset-password" ||
      to.path === "/otp")
  ) {
    next({ path: "/" }); // Chuyển hướng tới trang chủ hoặc trang dashboard
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // Nếu yêu cầu đăng nhập nhưng người dùng chưa đăng nhập, chuyển hướng đến trang login
    next({ path: "/login" });
  } else if (to.meta.role && to.meta.role !== authStore.user?.role) {
    // Kiểm tra quyền nếu có yêu cầu role
    next({ path: "/" });
  } else {
    // Nếu không có vấn đề gì, tiếp tục điều hướng
    next();
  }
});

export default router;
