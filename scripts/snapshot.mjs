// Baixa todas as espécies de Pokémon da PokéAPI (GraphQL) para src/data/pokemon.json.
// Uma única consulta; os nomes de exibição vêm em inglês (os mesmos usados no Brasil).
// Uso: npm run snapshot
import { writeFile } from "node:fs/promises";

const OUT = new URL("../src/data/pokemon.json", import.meta.url);
const QUERY = `query {
  species: pokemon_v2_pokemonspecies(order_by: { id: asc }) {
    id
    name
    generation_id
    is_legendary
    is_mythical
    names: pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: 9 } }) { name genus }
    forms: pokemon_v2_pokemons(where: { is_default: { _eq: true } }) {
      height
      weight
      types: pokemon_v2_pokemontypes(order_by: { slot: asc }) { type: pokemon_v2_type { name } }
      stats: pokemon_v2_pokemonstats { base_stat stat: pokemon_v2_stat { name } }
      abilities: pokemon_v2_pokemonabilities(order_by: { slot: asc }) { is_hidden ability: pokemon_v2_ability { name } }
    }
  }
}`;

const res = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: QUERY }),
});
if (!res.ok) throw new Error(`PokéAPI respondeu ${res.status}`);
const { data, errors } = await res.json();
if (errors) throw new Error(JSON.stringify(errors));

const STAT = { hp: "hp", attack: "atk", defense: "def", "special-attack": "spa", "special-defense": "spd", speed: "spe" };

const pokemon = data.species.flatMap((s) => {
  const form = s.forms[0];
  if (!form) return [];
  const stats = Object.fromEntries(form.stats.map((x) => [STAT[x.stat.name], x.base_stat]));
  return [
    {
      id: s.id,
      name: s.names[0]?.name ?? s.name,
      genus: s.names[0]?.genus ?? "",
      gen: s.generation_id,
      types: form.types.map((t) => t.type.name),
      stats,
      height: form.height, // decímetros
      weight: form.weight, // hectogramas
      abilities: form.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
      legendary: s.is_legendary,
      mythical: s.is_mythical,
    },
  ];
});

await writeFile(OUT, JSON.stringify(pokemon));
console.log(`ok: ${pokemon.length} pokémons, gerações 1–${Math.max(...pokemon.map((p) => p.gen))}`);
