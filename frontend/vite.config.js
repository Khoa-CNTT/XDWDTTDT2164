import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@apis": path.resolve(__dirname, "./src/apis"),
      "@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
  server: {
    host: true, // Lắng nghe trên tất cả các interface (0.0.0.0)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Sử dụng polling để watch file trong Docker
      interval: 1000, // Kiểm tra thay đổi mỗi 1 giây
    },
    hmr: {
      host: "localhost", // Đảm bảo HMR hoạt động với localhost
      port: 5173,
      protocol: "ws", // Sử dụng WebSocket cho HMR
    },
  },
});
