import axios from "axios";

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

export const fetch = {
  getPokemon: async (pokemon: string) => {
    try {
      const { data } = await api.get(`/pokemon/${pokemon}`);
      return { error: false, data };
    } catch (error) {
      return { error: true, data: error };
    }
  },
  getEvolutionChain: async (id: number) => {
    try {
      const { data } = await api.get(`/evolution-chain/${id}`);
      return { error: false, data };
    } catch (error) {
      return { error: true, data: error };
    }
  },
};
