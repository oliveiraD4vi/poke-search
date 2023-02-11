<template>
  <div class="home-container">
    <section>
      <form @submit.prevent="onSubmit">
        <h1>Hello, there!</h1>
        <h2>Search for the name:</h2>

        <div class="search-container">
          <input
            id="search-input"
            v-model="query"
            type="text"
            placeholder="pikachu..."
          >
          <button
            id="submit-button"
            :disabled="query === ''"
            type="submit"
          >
            <img
              id="search-icon"
              src="../../assets/svg/search-black.svg"
              alt="search"
            >
          </button>
        </div>
      </form>
    </section>

    <p
      v-if="error"
      class="error-message"
    >
      <span>Sorry! We didn't find anything...</span>
    </p>

    <Render
      v-if="items"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetch } from '../../service/api';
import { parseEvolutionChain } from '../../service/utils';
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';

const error = ref<boolean>(false);
const query = ref<string>('');
const items = ref<Pokemon[]>();

const getEvolutionChain = async (url: string) => {
  const response = await fetch.get(url);

  if (!response.error) {
    error.value = false;
    return response.data;
  } else {
    error.value = true;
    return false;
  }
}

const getSpecies = async (id: number) => {
  const response = await fetch.getSpecies(id);

  if (!response.error) {
    error.value = false;
    return response.data;
  } else {
    error.value = true;
    return false;
  }
}

const onSubmit = async () => {
  items.value = [];

  await fetch.getPokemon(query.value.toLowerCase())
  .then(async (response) => {
    if (!response.error) {
      const species = await getSpecies(response.data.id);
      if (species) {
        const evolution = await getEvolutionChain(species.evolution_chain.url);

        if (evolution) {
          const chain = await parseEvolutionChain(evolution.chain);

          if (chain.length) {
            error.value = false;
            items.value = chain;
          } else {
            items.value = [];
            error.value = true;
          }
        } else {
          items.value = [];
          error.value = true;
        }
      } else {
        items.value = [];
        error.value = true;
      }
    } else {
      items.value = [];
      error.value = true;
    }
  });
}
</script>

<style src="./_Home.scss" lang="scss" scoped></style>
