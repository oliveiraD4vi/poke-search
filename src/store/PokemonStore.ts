import { defineStore } from "pinia";
import { Pokemon } from "../types/Pokemon";

export const PokemonStore = defineStore("pokemon", {
  state: () => {
    return {
      data: () => ({} as Pokemon),
      url: "",
    };
  },
  actions: {
    setData(newState: Pokemon) {
      Object.assign(this.data, newState);
    },
    setUrl(newState: string) {
      this.url = newState;
    },
  },
});
