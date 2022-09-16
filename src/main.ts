import "/node_modules/focus-visible/dist/focus-visible.min.js";
import { ref, createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import messages from "./translatables";
import { createI18n } from "vue-i18n";
import "./index.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import MapLayout from "@/layouts/MapLayout.vue";

import '@/assets/scss/main.scss';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: "/location/:id/report",
    //   name: "Report location",
    //   component: () => import("./components/forms/ReportLocation.vue"),
    // },
    // {
    //   path: "/location/add",
    //   name: "Add location",
    //   component: () => import("./components/forms/AddLocation.vue"),
    // },
    {
      path: "/",
      component: MapLayout,
    },

  ],
});

const languageUser: string = navigator.language;
export const i18n = ref(
  createI18n<false>({
    legacy: false,
    locale: languageUser,
    fallbackLocale: "en",
    messages,
  })
);

const app = createApp(App);

app.use(router);
app.use(i18n.value);
app.use(createPinia());

// fix router.params not ready initially
await router.isReady()

app.mount("#app");

export default {}