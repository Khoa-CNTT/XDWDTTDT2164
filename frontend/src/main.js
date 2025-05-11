import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vue3-toastify/dist/index.css";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
app.use(PrimeVue);
