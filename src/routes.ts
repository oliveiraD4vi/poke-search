import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home/Home.vue";
import ListAll from "./views/ListAll/ListAll.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/list/all",
      name: "listall",
      component: ListAll,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: Home,
    },
  ],
});

export default router;
