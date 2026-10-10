// Textos em português e inglês. O idioma é um estado global simples (ref) compartilhado pelo app.
import { computed, ref } from "vue";
import type { StatKey } from "./data";

export type Lang = "pt" | "en";

const pt = {
  title: "Poké Search",
  nav: { dex: "Pokédex", game: "Quem é esse Pokémon?" },
  language: "Idioma",
  dexEyebrow: "Pokédex",
  dexTitle: "Todos os Pokémon",
  dexLead: "As nove gerações, com tipos, atributos e habilidades. Busque pelo nome ou pelo número.",
  search: "Buscar pelo nome ou número",
  allTypes: "Tipo: todos",
  allGens: "Geração: todas",
  clear: "Limpar",
  count: (n: number) => `${n} ${n === 1 ? "Pokémon" : "Pokémon"}`,
  empty: "Nenhum Pokémon encontrado",
  emptyHint: "Tente outro nome ou remova algum filtro.",
  loadMore: "Carregar mais",
  generation: (n: number) => `Geração ${n}`,
  details: (name: string) => `Ver detalhes de ${name}`,
  height: "Altura",
  weight: "Peso",
  abilities: "Habilidades",
  hidden: "oculta",
  baseStats: "Atributos base",
  total: "Total",
  legendary: "Lendário",
  mythical: "Mítico",
  previous: "Anterior",
  next: "Próximo",
  close: "Fechar",
  // Jogo
  gameEyebrow: "Jogo",
  gameTitle: "Quem é esse Pokémon?",
  gameLead: "Adivinhe o Pokémon pela silhueta. Você tem três vidas; cada acerto vale mais quanto maior a sequência.",
  gens: "Gerações",
  allGenerations: "Todas",
  mode: "Modo",
  modeChoices: "Alternativas",
  modeChoicesHint: "Escolha entre quatro nomes",
  modeTyping: "Digitar",
  modeTypingHint: "Escreva o nome, sem ajuda",
  start: "Começar",
  lives: "Vidas",
  score: "Pontos",
  streak: "Sequência",
  best: "Recorde",
  typeName: "Digite o nome",
  guess: "Chutar",
  skip: "Não sei",
  itsName: (name: string) => `É o ${name}!`,
  right: "Acertou!",
  wrong: "Errou!",
  nextRound: "Próximo",
  gameOver: "Fim de jogo",
  finalScore: (n: number) => `${n} pontos`,
  newBest: "Novo recorde!",
  seen: "Pokémon que apareceram",
  playAgain: "Jogar de novo",
  changeSettings: "Mudar as regras",
  hint: "Dica",
  hintText: (gen: number, types: string) => `Geração ${gen}, tipo ${types}`,
  madeBy: "Feito por",
  code: "Código no GitHub",
  data: "Dados da PokéAPI",
};

const en: typeof pt = {
  title: "Poké Search",
  nav: { dex: "Pokédex", game: "Who's that Pokémon?" },
  language: "Language",
  dexEyebrow: "Pokédex",
  dexTitle: "Every Pokémon",
  dexLead: "All nine generations, with types, stats and abilities. Search by name or number.",
  search: "Search by name or number",
  allTypes: "Type: all",
  allGens: "Generation: all",
  clear: "Clear",
  count: (n: number) => `${n} Pokémon`,
  empty: "No Pokémon found",
  emptyHint: "Try another name or remove a filter.",
  loadMore: "Load more",
  generation: (n: number) => `Generation ${n}`,
  details: (name: string) => `See details for ${name}`,
  height: "Height",
  weight: "Weight",
  abilities: "Abilities",
  hidden: "hidden",
  baseStats: "Base stats",
  total: "Total",
  legendary: "Legendary",
  mythical: "Mythical",
  previous: "Previous",
  next: "Next",
  close: "Close",
  gameEyebrow: "Game",
  gameTitle: "Who's that Pokémon?",
  gameLead: "Guess the Pokémon from its silhouette. You have three lives; each hit is worth more the longer your streak.",
  gens: "Generations",
  allGenerations: "All",
  mode: "Mode",
  modeChoices: "Choices",
  modeChoicesHint: "Pick one of four names",
  modeTyping: "Typing",
  modeTypingHint: "Type the name, no help",
  start: "Start",
  lives: "Lives",
  score: "Score",
  streak: "Streak",
  best: "Best",
  typeName: "Type the name",
  guess: "Guess",
  skip: "I don't know",
  itsName: (name: string) => `It's ${name}!`,
  right: "Correct!",
  wrong: "Wrong!",
  nextRound: "Next",
  gameOver: "Game over",
  finalScore: (n: number) => `${n} points`,
  newBest: "New best score!",
  seen: "Pokémon you saw",
  playAgain: "Play again",
  changeSettings: "Change the rules",
  hint: "Hint",
  hintText: (gen: number, types: string) => `Generation ${gen}, ${types} type`,
  madeBy: "Made by",
  code: "Code on GitHub",
  data: "Data from PokéAPI",
};

const TYPE_NAMES: Record<Lang, Record<string, string>> = {
  pt: {
    normal: "Normal", fire: "Fogo", water: "Água", grass: "Planta", electric: "Elétrico", ice: "Gelo", fighting: "Lutador",
    poison: "Venenoso", ground: "Terrestre", flying: "Voador", psychic: "Psíquico", bug: "Inseto", rock: "Pedra",
    ghost: "Fantasma", dragon: "Dragão", dark: "Sombrio", steel: "Aço", fairy: "Fada",
  },
  en: {
    normal: "Normal", fire: "Fire", water: "Water", grass: "Grass", electric: "Electric", ice: "Ice", fighting: "Fighting",
    poison: "Poison", ground: "Ground", flying: "Flying", psychic: "Psychic", bug: "Bug", rock: "Rock",
    ghost: "Ghost", dragon: "Dragon", dark: "Dark", steel: "Steel", fairy: "Fairy",
  },
};

const STAT_NAMES: Record<Lang, Record<StatKey, string>> = {
  pt: { hp: "PS", atk: "Ataque", def: "Defesa", spa: "Atq. esp.", spd: "Def. esp.", spe: "Velocidade" },
  en: { hp: "HP", atk: "Attack", def: "Defense", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed" },
};

/** Região de cada geração (nomes iguais nos dois idiomas, exceto Unova/Unova). */
export const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];

function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get("lang");
  if (param === "pt" || param === "en") return param;
  try {
    const saved = localStorage.getItem("poke:lang");
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* sem armazenamento local */
  }
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export const lang = ref<Lang>(initialLang());
export const t = computed(() => (lang.value === "pt" ? pt : en));

export function setLang(next: Lang) {
  lang.value = next;
  try {
    localStorage.setItem("poke:lang", next);
  } catch {
    /* sem armazenamento local */
  }
  const url = new URL(location.href);
  if (url.searchParams.has("lang")) {
    url.searchParams.set("lang", next);
    history.replaceState(history.state, "", url);
  }
}

export const typeName = (type: string) => TYPE_NAMES[lang.value][type] ?? type;
export const statName = (stat: StatKey) => STAT_NAMES[lang.value][stat];
export const locale = () => (lang.value === "pt" ? "pt-BR" : "en");

/** 4 dm -> "0,4 m" / "0.4 m" */
export const formatHeight = (dm: number) => `${(dm / 10).toLocaleString(locale(), { maximumFractionDigits: 1 })} m`;
export const formatWeight = (hg: number) => `${(hg / 10).toLocaleString(locale(), { maximumFractionDigits: 1 })} kg`;
