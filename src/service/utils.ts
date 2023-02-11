import { Pokemon } from "../types/Pokemon";
import { fetch } from "./api";

// Returns the data of the pokémons in th list
export async function getPokemonData(names: string[]): Promise<Pokemon[]> {
  const pokemonData: Pokemon[] = [];

  for (const name of names) {
    const response = await fetch.getPokemon(name);

    if (!response.error) {
      pokemonData.push(response.data);
    } else {
      console.error(response.data);
    }
  }

  return pokemonData;
}

// Returns a list with the names of all pokémons in the evolution chain
export async function parseEvolutionChain(evolution: unknown): Promise<Pokemon[]> {
  const chain: string[] = [];

  // Recursive function that push the name of the pokémons in the evolution chain
  const iterateEvolution = (evolutionData: any) => {
    chain.push(evolutionData.species.name);

    if (evolutionData.evolves_to.length > 0) {
      for (const ev of evolutionData.evolves_to) {
        iterateEvolution(ev);
      }
    }
  };

  iterateEvolution(evolution);

  return await getPokemonData(chain);
}
