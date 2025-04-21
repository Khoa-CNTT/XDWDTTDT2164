<template>
  <div class="dashboard-container" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Top Navigation -->
    <header class="dashboard-header">
      <TopSuperio />
    </header>

    <!-- Sidebar -->
    <SidebarEmployer></SidebarEmployer>

    <!-- Main Content Area -->
    <main class="dashboard-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <BotSuperio />
    </footer>

    <!-- Mobile Sidebar Toggle -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </button>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "@/css/common.css";
import "@/style.css";

import TopSuperio from "@/components/admin/TopSuperio.vue";
import BotSuperio from "@/components/admin/BotSuperio.vue";
import SidebarEmployer from "../../components/employer/SidebarEmployer.vue";

export default {
  name: "Dashboard",
  components: {
    TopSuperio,
    SidebarEmployer,
    BotSuperio,
  },
  data() {
    return {
      sidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
  mounted() {
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .then(() => console.log("Bootstrap JS loaded"))
      .catch((err) => console.error("Error loading Bootstrap JS", err));

    // Close sidebar when clicking outside on mobile
    const handleWindowClick = (event) => {
      if (
        this.sidebarOpen &&
        window.innerWidth <= 768 &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        this.sidebarOpen = false;
      }
    };

    window.addEventListener("click", handleWindowClick);

    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("click", handleWindowClick);
    });
  },
};
</script>

<style>
:root {
  --header-height: 70px;
  --footer-height: 60px;
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 70px;
  --primary-color: #3b82f6;
  --background-light: #edf1fc;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  --transition-normal: all 0.3s ease;
}

/* Layout Container */
.dashboard-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  min-height: 100vh;
  width: 100%;
}

/* Header */
.dashboard-header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  background-color: #ffffff;
  height: var(--header-height);
}

/* Sidebar */
.dashboard-container :deep(.sidebar) {
  grid-area: sidebar;
  height: calc(100vh - var(--header-height));
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  transition: var(--transition-normal);
  z-index: 999;
  overflow-y: auto;
}

/* Main Content Area */
.dashboard-main {
  grid-area: main;
  background-color: var(--background-light);
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding: 24px;
  transition: var(--transition-normal);
  overflow-x: hidden;
}

/* Footer */
.dashboard-footer {
  grid-area: footer;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  height: var(--footer-height);
  z-index: 900;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .dashboard-container {
    grid-template-columns: var(--sidebar-width-collapsed) 1fr;
  }

  .dashboard-main {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-areas:
      "header header"
      "main main"
      "footer footer";
    grid-template-columns: 1fr;
  }

  .dashboard-container :deep(.sidebar) {
    position: fixed;
    left: 0;
    transform: translateX(-100%);
    box-shadow: var(--shadow-md);
  }

  .dashboard-container.sidebar-open :deep(.sidebar) {
    transform: translateX(0);
  }

  .dashboard-main {
    padding: 16px;
  }
}

/* Main Content & Components General Styling */
.dashboard-main :deep(.card) {
  border-radius: 12px;
  border: none;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.dashboard-main :deep(.card:hover) {
  box-shadow: var(--shadow-md);
}

.dashboard-main :deep(h1),
.dashboard-main :deep(h2),
.dashboard-main :deep(h3) {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.dashboard-main :deep(.btn-primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.dashboard-main :deep(.btn-primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

/* Animations & Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark Theme Support (Optional) */
.dark-theme {
  --background-light: #1a1a2e;

  & .dashboard-header,
  & .dashboard-footer,
  & :deep(.sidebar) {
    background-color: #16213e;
    color: #e1e1e1;
  }

  & .dashboard-main :deep(.card) {
    background-color: #1f1f1f;
    color: #e1e1e1;
  }

  & .dashboard-main :deep(h1),
  & .dashboard-main :deep(h2),
  & .dashboard-main :deep(h3) {
    color: #e1e1e1;
  }
}

/* Toggle Button for Sidebar on Mobile */
.sidebar-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: pointer;
  border: none;
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }
}
</style>
