import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home/Home.vue";
import About from "./views/About/About.vue";
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
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/list/all",
      name: "listall",
      component: ListAll,
    }
  ],
});

export default router;
