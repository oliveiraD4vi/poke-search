<script setup lang="ts">
import { dexNumber, spriteUrl, type Pokemon } from "../data";
import { t } from "../i18n";
import PokemonImage from "./PokemonImage.vue";
import TypeBadge from "./TypeBadge.vue";

defineProps<{ pokemon: Pokemon }>();
defineEmits<{ open: [id: number] }>();
</script>

<template>
  <li class="card" :data-type="pokemon.types[0]">
    <button type="button" class="card-button" :aria-label="t.details(pokemon.name)" @click="$emit('open', pokemon.id)">
      <span class="card-number">{{ dexNumber(pokemon.id) }}</span>
      <span class="card-image">
        <PokemonImage :src="spriteUrl(pokemon.id)" :size="96" lazy />
      </span>
      <span class="card-name">{{ pokemon.name }}</span>
      <span class="types">
        <TypeBadge v-for="type in pokemon.types" :key="type" :type="type" />
      </span>
    </button>
  </li>
</template>
