<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import AdminLayout from "@/components/layouts/AdminLayout.vue";
import CandidateLayout from "@/components/layouts/CandidateLayout.vue";
import EmployerLayout from "@/components/layouts/EmployerLayout.vue";
import GuestLayout from "@/components/layouts/GuestLayout.vue";

export default {
  computed: {
    layout() {
      switch (this.$route.meta.layout) {
        case "admin":
          return AdminLayout;
        case "candidate":
          return CandidateLayout;
        case "employer":
          return EmployerLayout;
        case "guest":
          return GuestLayout;
        default:
          return "div";
      }
    },
  },
};
</script>
