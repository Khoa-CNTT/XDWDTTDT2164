import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Default from "./views/employer/index.vue";

import PrimeVue from "primevue/config";

import "./style.css";

const app = createApp(App);

app.use(router);
app.component("default-layout", Default);
app.mount("#app");
app.use(PrimeVue);
