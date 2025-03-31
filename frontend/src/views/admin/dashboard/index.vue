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
      <main class="dashboard-main">
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

import TopSuperio from '@/components/common/TopSuperio.vue'
import BotSuperio from '@/components/common/BotSuperio.vue'
import Sidebaradmin from '@/components/admin/Sidebaradmin.vue'

export default {
    name: "#app",
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

</style>
