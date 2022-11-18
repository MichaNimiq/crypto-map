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
      meta: { transition: 'slide-left' },
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
      meta: { transition: 'slide-left' },
    },
    {
      path: "/@:lat(-\?\\d\+\.\?\\d\+\?),:lng(-\?\\d\+\.\?\\d\+\?),:zoom(\\d\+)z",
      component: MapLayout,
      name: 'coords'
    },
    {
      path: "/",
      component: MapLayout,
      name: 'map'
    },
  ],
});

router.afterEach((to, from) => {
  const mapViews = ['map', 'coords', 'establishment_detail'];
  const formViews = ['add_establishment', 'report_establishment'];
  if (to.name && typeof to.name === 'string' && mapViews.includes(to.name) &&
    from.name && typeof from.name === 'string' && formViews.includes(from.name)) {
    console.log('map slideing rig');
    to.meta.transition = 'slide-right';
  }
})