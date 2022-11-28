import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pluginRewriteAll from 'vite-plugin-rewrite-all';

import { resolve } from "path";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pluginRewriteAll(), // Allow have dots in the path for the coords like /@1.23,14.567,12z
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
