<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary p-0">
        <div class="container-fluid"
            style="padding-left: 50px; padding-right: 50px; padding-top: 20px; padding-bottom: 20px; background-color:white;border-bottom: 2px solid #dee2e6;">
            <a class="logo me-3" href="#">
                <img src="/src/assets/logo/logo.svg" alt="Superio" width="150" height="">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active text-primary" aria-current="page" href="#">Trang chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active text-primary" aria-current="page" href="#">Việc làm</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active text-primary" aria-current="page" href="#">Công Ty</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active text-primary" aria-current="page" href="#">Giới Thiệu</a>
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <router-link to="/login">
                        <a class="btn btn-outline-primary" href="login_form.html" type="button">Đăng nhập / Đăng ký</a>
                    </router-link>
                </form>
            </div>
        </div>
    </nav>
</template>
<script>
export default {

}
</script>
<style></style>