import "/node_modules/focus-visible/dist/focus-visible.min.js";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import messages from "./translatables";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./assets/scss/main.scss";

// only one route with parameters available
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:lat/:lng",
      name: "Home",
      props: true,
      component: () => import("./App.vue"),
    },
  ],
});

const i18n = ref(
  createI18n<false>({
    legacy: false,
    locale: "de",
    fallbackLocale: "en",
    messages,
  })
);

const app = createApp(App);

app.use(router);
app.use(i18n.value);
app.use(createPinia());

// fix router.params not ready initially
router.isReady().then(() => {
  app.mount("#app");
});
