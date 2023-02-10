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
      return data;
    } catch (error) {
      return error;
    }
  },
};
