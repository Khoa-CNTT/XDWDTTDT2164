const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": require("path").resolve(__dirname, "src"), // Alias '@' trỏ tới thư mục src
        "@components": require("path").resolve(__dirname, "src/components"), // Alias cho components
        "@views": require("path").resolve(__dirname, "src/views"), // Alias cho views
        "@assets": require("path").resolve(__dirname, "src/assets"), // Alias cho assets
        "@routes": require("path").resolve(__dirname, "src/routes"), // Alias cho routes
        "@stores": require("path").resolve(__dirname, "src/stores"), // Alias cho stores
      },
    },
  },
});
