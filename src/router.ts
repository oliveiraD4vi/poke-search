import { createRouter, createWebHistory } from "vue-router";
import PokedexView from "./views/PokedexView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dex", component: PokedexView },
    // O jogo carrega sob demanda: quem só usa a Pokédex não baixa o código dele.
    { path: "/jogo", name: "game", component: () => import("./views/GameView.vue") },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
