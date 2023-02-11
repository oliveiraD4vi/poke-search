import { Pokemon } from "../types/Pokemon";
import { fetch } from "./api";

// Convert from decimeters to meters
export function decimetersToMeters(decimeters: number): number {
  return decimeters / 10;
}

// Convert from hectograms to kilograms
export function hectogramsToKilograms(hectograms: number): number {
  return hectograms / 10;
}

// Returns a string with the ID formated
export const formatPokemonId = (id: number) => {
  if (id < 10) {
    return `#00${id}`;
  } else if (id >= 10 && id < 99) {
    return `#0${id}`;
  } else {
    return `#${id}`;
  }
};

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
