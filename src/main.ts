import { createPinia } from "pinia";
import { createApp, ref } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import "./index.css";
import messages from "./translatables";
import "/node_modules/focus-visible/dist/focus-visible.min.js";

import '@/assets/scss/main.scss';
import { router } from "./router";

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
// await router.isReady()
app.mount("#app");

export default {}