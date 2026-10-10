<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import PokemonImage from "../components/PokemonImage.vue";
import { GENERATIONS, POKEMON, artworkUrl, dexNumber, normalize, spriteUrl, type Pokemon } from "../data";
import { REGIONS, t, typeName } from "../i18n";
import { bestKey, useGameStore, type Mode } from "../stores/game";

const LIVES = 3;
const store = useGameStore();

// ---------- Regras ----------
const gens = ref<number[]>([]); // vazio = todas
const mode = ref<Mode>("choices");
function toggleGen(g: number) {
  gens.value = gens.value.includes(g) ? gens.value.filter((x) => x !== g) : [...gens.value, g].sort((a, b) => a - b);
}
const pool = computed(() => (gens.value.length ? POKEMON.filter((p) => gens.value.includes(p.gen)) : POKEMON));
const key = computed(() => bestKey(mode.value, gens.value));
const best = computed(() => store.best[key.value] ?? 0);

// ---------- Partida ----------
type Phase = "setup" | "play" | "over";
interface Seen {
  pokemon: Pokemon;
  correct: boolean;
}
const phase = ref<Phase>("setup");
const target = ref<Pokemon | null>(null);
const options = ref<Pokemon[]>([]);
const answer = ref<{ correct: boolean; choice: number | null } | null>(null);
const lives = ref(LIVES);
const score = ref(0);
const streak = ref(0);
const gained = ref(0);
const hinted = ref(false);
const typed = ref("");
const seen = ref<Seen[]>([]);
const isNewBest = ref(false);
const input = ref<HTMLInputElement | null>(null);
const nextButton = ref<HTMLButtonElement | null>(null);
let used = new Set<number>();

const random = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function pickTarget(): Pokemon {
  const fresh = pool.value.filter((p) => !used.has(p.id));
  const pokemon = random(fresh.length ? fresh : pool.value);
  used.add(pokemon.id);
  return pokemon;
}

/** Três nomes errados, de preferência com algum tipo em comum, para não ser óbvio. */
function pickOptions(right: Pokemon): Pokemon[] {
  const others = pool.value.filter((p) => p.id !== right.id);
  const similar = others.filter((p) => p.types.some((ty) => right.types.includes(ty)));
  const wrong: Pokemon[] = [];
  for (const source of [similar, others]) {
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    for (const p of shuffled) {
      if (wrong.length === 3) break;
      if (!wrong.includes(p)) wrong.push(p);
    }
  }
  return [right, ...wrong].sort(() => Math.random() - 0.5);
}

async function newRound() {
  answer.value = null;
  hinted.value = false;
  typed.value = "";
  gained.value = 0;
  target.value = pickTarget();
  options.value = mode.value === "choices" ? pickOptions(target.value) : [];
  await nextTick();
  if (mode.value === "typing") input.value?.focus();
}

function start() {
  used = new Set();
  lives.value = LIVES;
  score.value = 0;
  streak.value = 0;
  seen.value = [];
  isNewBest.value = false;
  phase.value = "play";
  newRound();
}

async function resolve(correct: boolean, choice: number | null) {
  if (answer.value || !target.value) return;
  answer.value = { correct, choice };
  seen.value.push({ pokemon: target.value, correct });
  if (correct) {
    streak.value++;
    // Cada três acertos seguidos aumentam o valor da rodada; digitar vale mais; dica vale metade.
    const base = (mode.value === "typing" ? 150 : 100) * (1 + Math.floor((streak.value - 1) / 3) * 0.5);
    gained.value = Math.round(hinted.value ? base / 2 : base);
    score.value += gained.value;
  } else {
    streak.value = 0;
    lives.value--;
  }
  await nextTick();
  nextButton.value?.focus();
}

function choose(index: number) {
  resolve(options.value[index].id === target.value?.id, index);
}

function guess() {
  if (!target.value || !typed.value.trim()) return;
  resolve(normalize(typed.value) === normalize(target.value.name), null);
}

function next() {
  if (lives.value <= 0) {
    phase.value = "over";
    isNewBest.value = store.record(key.value, score.value);
  } else newRound();
}

const optionState = (index: number) => {
  if (!answer.value || !target.value) return "idle";
  if (options.value[index].id === target.value.id) return "right";
  return index === answer.value.choice ? "wrong" : "idle";
};
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">{{ t.gameEyebrow }}</p>
      <h1>{{ t.gameTitle }}</h1>
      <p v-if="phase === 'setup'" class="lead">{{ t.gameLead }}</p>
    </div>
  </section>

  <main class="wrap game">
    <!-- Regras -->
    <div v-if="phase === 'setup'" class="panel setup">
      <div class="field">
        <span class="label">{{ t.gens }}</span>
        <div class="chips">
          <button type="button" :aria-pressed="gens.length === 0" @click="gens = []">{{ t.allGenerations }}</button>
          <button v-for="g in GENERATIONS" :key="g" type="button" :aria-pressed="gens.includes(g)" @click="toggleGen(g)">
            {{ g }} · {{ REGIONS[g - 1] }}
          </button>
        </div>
      </div>
      <div class="field">
        <span class="label">{{ t.mode }}</span>
        <div class="modes">
          <button type="button" class="mode" :aria-pressed="mode === 'choices'" @click="mode = 'choices'">
            <strong>{{ t.modeChoices }}</strong>
            <span>{{ t.modeChoicesHint }}</span>
          </button>
          <button type="button" class="mode" :aria-pressed="mode === 'typing'" @click="mode = 'typing'">
            <strong>{{ t.modeTyping }}</strong>
            <span>{{ t.modeTypingHint }}</span>
          </button>
        </div>
      </div>
      <div class="setup-foot">
        <button type="button" class="btn btn-primary btn-lg" @click="start">{{ t.start }}</button>
        <span v-if="best" class="muted">{{ t.best }}: {{ best }}</span>
      </div>
    </div>

    <!-- Rodada -->
    <div v-else-if="phase === 'play' && target" class="panel round">
      <div class="hud">
        <span class="hearts" :aria-label="`${t.lives}: ${lives}`">
          <span v-for="i in LIVES" :key="i" class="heart" :data-on="i <= lives" aria-hidden="true">♥</span>
        </span>
        <span><strong>{{ score }}</strong> {{ t.score.toLowerCase() }}</span>
        <span v-if="streak > 1" class="streak">{{ t.streak }}: {{ streak }}</span>
      </div>

      <div class="stage" :data-revealed="answer !== null">
        <PokemonImage :key="target.id" :src="artworkUrl(target.id)" :alt="answer ? target.name : '?'" :size="300" :silhouette="answer === null" />
      </div>

      <p v-if="answer" class="verdict" :data-good="answer.correct">
        {{ answer.correct ? t.right : t.wrong }} {{ t.itsName(target.name) }}
        <span v-if="gained"> +{{ gained }}</span>
      </p>

      <ol v-if="mode === 'choices'" class="options">
        <li v-for="(p, i) in options" :key="p.id">
          <button type="button" class="option" :data-state="optionState(i)" :disabled="answer !== null" @click="choose(i)">{{ p.name }}</button>
        </li>
      </ol>

      <form v-else class="typing" @submit.prevent="guess">
        <input ref="input" v-model="typed" :placeholder="t.typeName" :aria-label="t.typeName" :disabled="answer !== null" autocomplete="off" spellcheck="false" />
        <button type="submit" class="btn btn-primary" :disabled="answer !== null || !typed.trim()">{{ t.guess }}</button>
        <button type="button" class="btn" :disabled="answer !== null" @click="resolve(false, null)">{{ t.skip }}</button>
      </form>
      <p v-if="mode === 'typing' && !answer" class="hint">
        <button v-if="!hinted" type="button" class="text-btn" @click="hinted = true">{{ t.hint }}</button>
        <span v-else>{{ t.hintText(target.gen, target.types.map(typeName).join(" / ")) }}</span>
      </p>

      <div v-if="answer" class="actions">
        <button ref="nextButton" type="button" class="btn btn-primary" @click="next">{{ lives > 0 ? t.nextRound : t.gameOver }}</button>
      </div>
    </div>

    <!-- Fim -->
    <div v-else class="panel over">
      <p class="eyebrow">{{ t.gameOver }}</p>
      <p class="big-score">{{ t.finalScore(score) }}</p>
      <p v-if="isNewBest" class="badge">{{ t.newBest }}</p>
      <p v-else-if="best" class="muted">{{ t.best }}: {{ best }}</p>
      <h3>{{ t.seen }}</h3>
      <ul class="seen">
        <li v-for="(s, i) in seen" :key="i" :data-correct="s.correct" :title="`${dexNumber(s.pokemon.id)} ${s.pokemon.name}`">
          <PokemonImage :src="spriteUrl(s.pokemon.id)" :size="72" lazy />
          <span>{{ s.pokemon.name }}</span>
        </li>
      </ul>
      <div class="actions">
        <button type="button" class="btn btn-primary" @click="start">{{ t.playAgain }}</button>
        <button type="button" class="btn" @click="phase = 'setup'">{{ t.changeSettings }}</button>
      </div>
    </div>
  </main>
</template>
