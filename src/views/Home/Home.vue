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
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';

const error = ref<boolean>(false);
const query = ref<string>('');
const items = ref<Pokemon[]>();

const onSubmit = async () => {
  await fetch.getPokemon(query.value.toLowerCase())
  .then((response) => {
    if (!response.error) {
      error.value = false;
      items.value = [
        response.data,
      ];
    } else {
      items.value = [];
      error.value = true;
    }
  });
}
</script>

<style src="./_Home.scss" lang="scss" scoped></style>
