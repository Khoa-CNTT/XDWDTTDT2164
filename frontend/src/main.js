import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import DefaultEmployer from "./views/employer/index.vue";
import DefaultAdmin from "./views/admin/dashboard/index_2.vue";
import DefaultCandidate from "./views/candidate/index.vue";

import PrimeVue from "primevue/config";

import "./style.css";

const app = createApp(App);

app.use(router);
app.component("default-layout", DefaultEmployer);
app.component("default-admin", DefaultAdmin);
app.component("default-candidate", DefaultCandidate);
app.mount("#app");
app.use(PrimeVue);