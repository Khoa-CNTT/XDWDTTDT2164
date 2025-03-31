<template>
  <div>
    <nav>
      <router-link to="/">Trang Chủ</router-link>
      <router-link to="/about">Giới Thiệu</router-link>
    </nav>

    <router-view />
    <!-- Nơi hiển thị nội dung trang -->
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
