<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { BY_ID, POKEMON, STATS, abilityName, artworkUrl, dexNumber } from "../data";
import { REGIONS, formatHeight, formatWeight, lang, statName, t } from "../i18n";
import PokemonImage from "./PokemonImage.vue";
import TypeBadge from "./TypeBadge.vue";

const props = defineProps<{ id: number }>();
const emit = defineEmits<{ close: []; open: [id: number] }>();

const dialog = ref<HTMLDialogElement | null>(null);
const content = ref<HTMLDivElement | null>(null);
const pokemon = computed(() => BY_ID.get(props.id));
const total = computed(() => (pokemon.value ? STATS.reduce((sum, s) => sum + pokemon.value!.stats[s], 0) : 0));
const prev = computed(() => (props.id > 1 ? props.id - 1 : null));
const next = computed(() => (props.id < POKEMON.length ? props.id + 1 : null));

onMounted(() => dialog.value?.showModal());
watch(
  () => props.id,
  () => {
    content.value?.scrollTo({ top: 0 });
  },
);

function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowLeft" && prev.value) emit("open", prev.value);
  if (e.key === "ArrowRight" && next.value) emit("open", next.value);
}
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    aria-labelledby="dialog-title"
    @cancel.prevent="emit('close')"
    @click="(e) => e.target === dialog && emit('close')"
    @keydown="onKey"
  >
    <div v-if="pokemon" ref="content" class="dialog-content" :data-type="pokemon.types[0]">
      <button type="button" class="dialog-close" :aria-label="t.close" @click="emit('close')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <header class="dialog-head">
        <div class="dialog-art">
          <PokemonImage :src="artworkUrl(pokemon.id)" :alt="pokemon.name" :size="300" />
        </div>
        <div class="dialog-info">
          <p class="eyebrow">
            {{ dexNumber(pokemon.id) }} · {{ t.generation(pokemon.gen) }} · {{ REGIONS[pokemon.gen - 1] }}
          </p>
          <h2 id="dialog-title">{{ pokemon.name }}</h2>
          <p v-if="lang === 'en' && pokemon.genus" class="muted">{{ pokemon.genus }}</p>
          <div class="types">
            <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" />
            <span v-if="pokemon.legendary" class="tag">{{ t.legendary }}</span>
            <span v-if="pokemon.mythical" class="tag">{{ t.mythical }}</span>
          </div>
          <dl class="facts">
            <div>
              <dt>{{ t.height }}</dt>
              <dd>{{ formatHeight(pokemon.height) }}</dd>
            </div>
            <div>
              <dt>{{ t.weight }}</dt>
              <dd>{{ formatWeight(pokemon.weight) }}</dd>
            </div>
            <div class="facts-wide">
              <dt>{{ t.abilities }}</dt>
              <dd>
                <span v-for="(a, i) in pokemon.abilities" :key="a.name">
                  {{ abilityName(a.name) }}<em v-if="a.hidden"> ({{ t.hidden }})</em><template v-if="i < pokemon.abilities.length - 1">, </template>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <section class="stats" aria-labelledby="stats-title">
        <h3 id="stats-title">{{ t.baseStats }}</h3>
        <dl>
          <div v-for="s in STATS" :key="s" class="stat">
            <dt>{{ statName(s) }}</dt>
            <dd>
              <span class="stat-value">{{ pokemon.stats[s] }}</span>
              <span class="stat-bar"><span :style="{ width: `${Math.min(100, (pokemon.stats[s] / 200) * 100)}%` }" /></span>
            </dd>
          </div>
          <div class="stat stat-total">
            <dt>{{ t.total }}</dt>
            <dd>
              <span class="stat-value">{{ total }}</span>
            </dd>
          </div>
        </dl>
      </section>

      <nav class="dialog-nav">
        <button v-if="prev" type="button" class="btn" @click="emit('open', prev)">← {{ BY_ID.get(prev)?.name }}</button>
        <span v-else />
        <button v-if="next" type="button" class="btn" @click="emit('open', next)">{{ BY_ID.get(next)?.name }} →</button>
      </nav>
    </div>
  </dialog>
</template>
