import axios from "axios";

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

export const fetch = {
  get: async (url: string) => {
    try {
      const { data } = await api.get(url);
      return { error: false, data };
    } catch (error) {
      return { error: true, data: error };
    }
  },
  getAllPokemon: async () => {
    try {
      const { data } = await api.get('/pokemon');
      return { error: false, data };
    } catch (error) {
      return { error: true, data: error };
    }
  },
  getPokemon: async (pokemon: string) => {
    try {
      const { data } = await api.get(`/pokemon/${pokemon}`);
      return { error: false, data };
    } catch (error) {
      return { error: true, data: error };
    }
  },
  getSpecies: async (id: number) => {
    try {
      const { data } = await api.get(`/pokemon-species/${id}`);
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
