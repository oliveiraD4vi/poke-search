// Dados dos Pokémon: cópia da PokéAPI em src/data/pokemon.json (gerada por `npm run snapshot`),
// para a busca e o jogo não dependerem da API nem do limite de requisições dela.
import raw from "./data/pokemon.json";

export type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe";

export interface Pokemon {
  id: number;
  name: string;
  genus: string;
  gen: number;
  types: string[];
  stats: Record<StatKey, number>;
  /** Decímetros. */
  height: number;
  /** Hectogramas. */
  weight: number;
  abilities: { name: string; hidden: boolean }[];
  legendary: boolean;
  mythical: boolean;
}

export const POKEMON = raw as Pokemon[];
export const BY_ID = new Map(POKEMON.map((p) => [p.id, p]));
export const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const TYPES = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
export const STATS: StatKey[] = ["hp", "atk", "def", "spa", "spd", "spe"];

/** Imagens passam pelo nosso servidor, que guarda uma cópia (veja o nginx em coaladev.com.br). */
export const spriteUrl = (id: number) => `/sprites/${id}.png`;
export const artworkUrl = (id: number) => `/sprites/other/official-artwork/${id}.png`;

export const dexNumber = (id: number) => `#${String(id).padStart(4, "0")}`;

export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** "lightning-rod" -> "Lightning Rod" */
export const abilityName = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
