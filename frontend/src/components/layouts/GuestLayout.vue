<template>
  <div class="dashboard-layout">
    <!-- Header -->
    <header class="dashboard-header">
      <TopSuperio />
    </header>

    <!-- Main Content -->
    <main class="dashboard-main container-fluid">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <BotGuest />
    </footer>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "@/css/common.css";
import "@/style.css";

import TopSuperio from "@/components/admin/TopSuperio.vue";
import BotGuest from "@/components/guest/Bot-guest.vue";

export default {
  name: "DashboardLayout",
  components: {
    TopSuperio,
    BotGuest,
  },
  mounted() {
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .then(() => console.log("Bootstrap JS loaded"))
      .catch((err) => console.error("Error loading Bootstrap JS", err));
  },
};
</script>

<style>
:root {
  --header-height: 60px;
  --footer-height: 80px;
}

.dashboard-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--header-height);
}

.dashboard-main {
  flex: 1;
  padding: 20px;
  /* margin-top: var(--header-height); */
  /* margin-bottom: var(--footer-height); */
}

.dashboard-footer {
  background-color: #f8f9fa;
  padding: 15px 0;
  bottom: 0;
  width: 100%;
  height: var(--footer-height);
  z-index: 1000;
}
</style>