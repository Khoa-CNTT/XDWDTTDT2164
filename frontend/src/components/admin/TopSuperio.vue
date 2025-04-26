<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
    <div class="container-fluid" style="
        padding-left: 50px;
        padding-right: 50px;
        height: 70px;
        background-color: white;
        border-bottom: 2px solid #dee2e6;
      ">
      <!-- Logo -->
      <a class="logo me-3" href="/">
        <img src="/src/assets/logo/logo.svg" alt="Superio" width="150" />
      </a>

      <!-- Toggler button for mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation content -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-center">
          <!-- Avatar người dùng -->
          <li class="nav-item">
            <img src="../../../src/assets/images/12.jpg" alt="Avatar" class="rounded-circle" width="40" height="40"
              style="object-fit: cover; cursor: pointer" />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
</style>
