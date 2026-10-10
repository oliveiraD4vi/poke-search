<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PokemonCard from "../components/PokemonCard.vue";
import PokemonDialog from "../components/PokemonDialog.vue";
import { GENERATIONS, POKEMON, TYPES, normalize } from "../data";
import { REGIONS, t, typeName } from "../i18n";

const PAGE = 48;
const route = useRoute();
const router = useRouter();

// Busca, filtros e Pokémon aberto ficam na URL (dá para compartilhar o link).
const q = (key: string) => (typeof route.query[key] === "string" ? (route.query[key] as string) : "");
const search = ref(q("busca"));
const type = computed(() => q("tipo"));
const gen = computed(() => Number(q("geracao")) || 0);
const selected = computed(() => Number(q("pokemon")) || null);

function setQuery(patch: Record<string, string | number | null>, push = false) {
  const query = { ...route.query };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "" || value === 0) delete query[key];
    else query[key] = String(value);
  }
  (push ? router.push : router.replace)({ query });
}

let timer: ReturnType<typeof setTimeout> | undefined;
watch(search, (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => setQuery({ busca: value.trim() }), 200);
});

const results = computed(() => {
  const term = normalize(q("busca"));
  const number = Number(term);
  return POKEMON.filter(
    (p) =>
      (!term || normalize(p.name).includes(term) || (Number.isInteger(number) && number > 0 && p.id === number)) &&
      (!type.value || p.types.includes(type.value)) &&
      (!gen.value || p.gen === gen.value),
  );
});

const visible = ref(PAGE);
watch(results, () => (visible.value = PAGE));
const shown = computed(() => results.value.slice(0, visible.value));
const hasMore = computed(() => visible.value < results.value.length);

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | undefined;
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value) visible.value += PAGE;
  }, { rootMargin: "800px" });
  if (sentinel.value) observer.observe(sentinel.value);
});
onBeforeUnmount(() => observer?.disconnect());

const active = computed(() => Boolean(q("busca") || type.value || gen.value));
function clear() {
  search.value = "";
  setQuery({ busca: null, tipo: null, geracao: null });
}

// Abrir cria uma entrada no histórico (o "voltar" fecha); navegar entre Pokémon no detalhe, não.
const open = (id: number) => setQuery({ pokemon: id }, !selected.value);
function close() {
  if (history.state?.back && window.history.length > 1 && route.query.pokemon) router.back();
  else setQuery({ pokemon: null });
}
</script>

<template>
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">{{ t.dexEyebrow }}</p>
      <h1>{{ t.dexTitle }}</h1>
      <p class="lead">{{ t.dexLead }}</p>
    </div>
  </section>

  <div class="sticky">
    <div class="wrap toolbar" role="search">
      <label class="search">
        <span class="sr-only">{{ t.search }}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input v-model="search" type="search" :placeholder="t.search" autocomplete="off" enterkeyhint="search" />
      </label>
      <label class="select">
        <span class="sr-only">{{ t.allTypes }}</span>
        <select :value="type" :data-active="type !== ''" @change="setQuery({ tipo: ($event.target as HTMLSelectElement).value })">
          <option value="">{{ t.allTypes }}</option>
          <option v-for="ty in TYPES" :key="ty" :value="ty">{{ typeName(ty) }}</option>
        </select>
      </label>
      <label class="select">
        <span class="sr-only">{{ t.allGens }}</span>
        <select :value="gen || ''" :data-active="gen !== 0" @change="setQuery({ geracao: Number(($event.target as HTMLSelectElement).value) })">
          <option value="">{{ t.allGens }}</option>
          <option v-for="g in GENERATIONS" :key="g" :value="g">{{ t.generation(g) }} · {{ REGIONS[g - 1] }}</option>
        </select>
      </label>
      <button v-if="active" type="button" class="clear" @click="clear">{{ t.clear }}</button>
    </div>
  </div>

  <main class="wrap">
    <p class="count" aria-live="polite">{{ results.length ? t.count(results.length) : "" }}</p>
    <div v-if="!results.length" class="empty">
      <h2>{{ t.empty }}</h2>
      <p>{{ t.emptyHint }}</p>
    </div>
    <ul class="grid">
      <PokemonCard v-for="p in shown" :key="p.id" :pokemon="p" @open="open" />
    </ul>
    <div ref="sentinel" />
    <div v-if="hasMore" class="more">
      <button type="button" class="btn btn-primary" @click="visible += PAGE">{{ t.loadMore }}</button>
    </div>
  </main>

  <PokemonDialog v-if="selected" :id="selected" @close="close" @open="(id) => setQuery({ pokemon: id })" />
</template>
