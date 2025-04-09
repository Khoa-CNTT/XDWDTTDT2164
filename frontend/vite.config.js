import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Định nghĩa alias '@' trỏ vào thư mục 'src'
      "@components": path.resolve(__dirname, "./src/components"), // Alias cho components
      "@views": path.resolve(__dirname, "./src/views"), // Alias cho views
      "@config": path.resolve(__dirname, "./src/config"), // Alias cho config
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
});
