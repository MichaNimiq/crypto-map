import MapLayout from "@/layouts/MapLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import "./index.css";
import "/node_modules/focus-visible/dist/focus-visible.min.js";


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/establishment/add",
      name: "add_establishment",
      component: () => import("@/components/forms/NewCandidate.vue"),
    },
    {
      path: "/establishment/:id",
      name: "establishment_detail",
      component: MapLayout,
    },
    {
      path: "/establishment/:id/report",
      name: "report_establishment",
      component: () => import("@/components/forms/ReportEstablishment.vue"),
    },
    {
      path: "/@:lat(-\?\\d\+\.\?\\d\+\?),:lng(-\?\\d\+\.\?\\d\+\?),:zoom(\\d\+)z",
      component: MapLayout,
      name: 'coords'
    },
    {
      path: "/",
      component: MapLayout,
    },
  ],
});