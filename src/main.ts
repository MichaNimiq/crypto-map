import { createPinia } from "pinia";
import { createApp, ref, markRaw } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import "./index.css";
import { messages } from "./locales";
import "/node_modules/focus-visible/dist/focus-visible.min.js";
import { Loader } from "@googlemaps/js-api-loader";

import '@/assets/scss/main.scss';
import { router } from "./router";

const languageUser = navigator.language;
export const i18n = createI18n<false>({
  locale: languageUser,
  fallbackLocale: "en",
  messages,
})

const app = createApp(App);
const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router)
});
app.use(pinia);
app.use(router);
app.use(i18n);

new Loader({ apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY, version: "weekly", libraries: ['places'] }).load().then(() => {
  app.mount("#app");
});

export default {}