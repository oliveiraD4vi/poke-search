// Recordes do jogo, por combinação de modo e gerações, guardados no navegador.
import { defineStore } from "pinia";
import { ref } from "vue";

export type Mode = "choices" | "typing";

const KEY = "poke:best";

function load(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export const bestKey = (mode: Mode, gens: number[]) => `${mode}:${[...gens].sort((a, b) => a - b).join(",") || "all"}`;

export const useGameStore = defineStore("game", () => {
  const best = ref<Record<string, number>>(load());

  /** Registra a pontuação; devolve true se for recorde. */
  function record(key: string, score: number): boolean {
    if (score <= (best.value[key] ?? 0)) return false;
    best.value = { ...best.value, [key]: score };
    try {
      localStorage.setItem(KEY, JSON.stringify(best.value));
    } catch {
      /* sem armazenamento local */
    }
    return true;
  }

  return { best, record };
});
