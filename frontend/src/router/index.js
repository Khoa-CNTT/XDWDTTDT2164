// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@stores/useAuthStore";

const routes = [
  // Auth routes
  {
    path: "/login",
    component: () => import("@/views/common/Login.vue"),
    meta: { layout: "auth", guestOnly: true },
  },
  {
    path: "/register",
    component: () => import("@/views/common/Sign_up.vue"),
    meta: { layout: "auth", guestOnly: true },
  },
  {
    path: "/forgot-password",
    component: () => import("@/views/common/Forgot_password.vue"),
    meta: { layout: "auth", guestOnly: true },
  },
  {
    path: "/reset-password/:token",
    component: () => import("@/views/common/Reset_password.vue"),
    meta: { layout: "auth", guestOnly: true },
  },
  {
    path: "/otp",
    component: () => import("@/views/common/OTP.vue"),
    meta: { layout: "auth", guestOnly: true },
  },

  // Candidate dashboard
  {
    path: "/candidate-dashboard",
    meta: { layout: "candidate", requiresAuth: true, role: "candidate" },
    children: [
      {
        path: "",
        component: () => import("@/views/candidate/candidate-test.vue"),
      },
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

  // Employer dashboard
  {
    path: "/employer-dashboard",
    meta: { layout: "employer", requiresAuth: true, role: "employer" },
    children: [
      {
        path: "",
        component: () => import("@/views/employer/employer-info.vue"),
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
        path: "employer-update-job/:jobId",
        component: () => import("@/views/employer/employer-update-job.vue"),
      },
      {
        path: "employer-recharge",
        component: () => import("@/views/employer/employer-recharge.vue"),
      },
      {
        path: "employer-depositinformation",
        component: () =>
          import("@/views/employer/employer-depositinformation.vue"),
      },
      {
        path: "employer-paymenthistory",
        component: () => import("@/views/employer/employer-paymenthistory.vue"),
      },
      {
        path: "employer-deposithistory",
        component: () => import("@/views/employer/employer-deposithistory.vue"),
      },
      {
        path: "employer-workmanagement",
        component: () => import("@/views/employer/employer-workmanagement.vue"),
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

  // Admin dashboard
  {
    path: "/admin-dashboard",
    meta: { layout: "admin", requiresAuth: true, role: "admin" },
    children: [
      {
        path: "admin-starter",
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
    ],
  },

  // Guest routes
  {
    path: "/",
    meta: { layout: "guest" },
    children: [
      { path: "", component: () => import("@/views/common/index.vue") },
      {
        path: "job/:slug",
        component: () => import("@/views/common/Job_details.vue"),
      },
      {
        path: "condition",
        component: () => import("@/views/common/Conditions.vue"),
      },
      { path: "about", component: () => import("@/views/common/Abouts.vue") },
      {
        path: "company/:slug",
        component: () => import("@/views/common/Companydetails.vue"),
      },
      {
        path: "page-not-found",
        component: () => import("@/views/common/Pagenotfound.vue"),
      },
      {
        path: "conditions",
        component: () => import("@/views/common/Conditions.vue"),
      },
      { path: "list", component: () => import("@/views/common/List.vue") },
      {
        path: "list-company",
        component: () => import("@/views/common/ListCompany.vue"),
      },
      {
        path: "create-candidate",
        component: () => import("@/views/candidate/create-candidate.vue"),
      },
      {
        path: "create-employer-profile",
        component: () => import("@/views/employer/create-employer-profile.vue"),
      },
    ],
  },

  // 404 fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/page-not-found",
  },
];

// Init router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Đợi khởi tạo trạng thái đăng nhập nếu chưa hoàn tất
  if (!authStore.isAuthResolved) {
    await authStore.initAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Các trang chỉ dành cho khách (guest)
  const isGuestOnly = to.meta.guestOnly;

  // Redirect theo vai trò
  const redirectByRole = {
    admin: "/admin-dashboard",
    employer: "/employer-dashboard",
    candidate: "/candidate-dashboard",
  };

  // Xử lý các trường hợp
  if (isAuthenticated) {
    // Ngăn truy cập các trang guest (login, register, v.v.) khi đã đăng nhập
    console.log(to.meta);
    if (isGuestOnly) {
      next({ path: redirectByRole[userRole] || "/" });
    }
    // Kiểm tra quyền vai trò cho các trang yêu cầu đăng nhập
    else if (
      to.meta.requiresAuth &&
      to.meta.role &&
      to.meta.role !== userRole
    ) {
      next({ path: redirectByRole[userRole] || "/" });
    }
    // Cho phép truy cập nếu không có vấn đề
    else {
      next();
    }
  } else {
    // Chuyển hướng đến login nếu trang yêu cầu đăng nhập
    if (to.meta.requiresAuth) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
    // Cho phép truy cập các trang không yêu cầu đăng nhập
    else {
      next();
    }
  }
});

export default router;
