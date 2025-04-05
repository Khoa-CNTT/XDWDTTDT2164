<template>
  <div class="dashboard-container">
    <!-- Top Navigation -->
    <header class="dashboard-header">
      <TopSuperio />
    </header>

    <!-- Sidebar -->
    <!-- <aside class="">
          
        </aside> -->
    <SidebarEmployer></SidebarEmployer>
    <!-- Main Content Area -->
    <main class="dashboard-main" style="background-color: #edf1fc">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <BotSuperio />
    </footer>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "@/css/common.css";
import "@/style.css";

import TopSuperio from "@/components/admin/TopSuperio.vue";
import BotSuperio from "@/components/admin/BotSuperio.vue";
import SidebarEmployer from "@/components/employer/SidebarEmployer.vue";

export default {
  name: "Dashboard",
  components: {
    TopSuperio,
    SidebarEmployer,
    BotSuperio,
  },
  mounted() {
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .then(() => console.log("Bootstrap JS loaded"))
      .catch((err) => console.error("Error loading Bootstrap JS", err));
  },
};
</script>

<style></style>

<style>
:root {
  --header-height: 60px;
  --footer-height: 50px;
}
</style>
