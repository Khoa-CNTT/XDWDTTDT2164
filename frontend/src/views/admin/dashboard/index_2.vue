<template>
  <div class="dashboard-container">
    <!-- Top Navigation -->
    <header class="dashboard-header">
      <TopSuperio />
    </header>

    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <Sidebaradmin />
    </aside>

    <!-- Main Content Area -->
    <main class="dashboard-main" style="background-color: #edf1fc;">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <BotSuperio />
    </footer>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/css/common.css'
import '@/style.css'

import TopSuperio from '@/components/admin/TopSuperio.vue'
import BotSuperio from '@/components/admin/BotSuperio.vue'
import Sidebaradmin from '@/components/admin/Sidebaradmin.vue'

export default {
  name: "Dashboard",
  components: {
    TopSuperio,
    Sidebaradmin,
    BotSuperio
  },
  mounted() {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => console.log("Bootstrap JS loaded"))
      .catch(err => console.error("Error loading Bootstrap JS", err));
  }
}
</script>

<style>
/* dashboard*/
.dashboard-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.dashboard-header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.dashboard-sidebar {
  grid-area: sidebar;
  background-color: #f8f9fa;
  height: calc(100vh - var(--header-height) - var(--footer-height));
  position: sticky;
  top: var(--header-height);

  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE và Edge */
}


.dashboard-main {
  grid-area: main;
  padding: 20px;
  overflow-y: auto;
}

.dashboard-footer {
  grid-area: footer;
  background-color: #f8f9fa;
  padding: 10px 0;
  text-align: center;
}
</style>

<style>
:root {
  --header-height: 60px;
  --footer-height: 50px;
}
</style>