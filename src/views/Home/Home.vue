<template>
  <div class="home-container">
    <section>
      <form @submit.prevent="onSubmit">
        <h1>Search for a Pokémon</h1>

        <div class="search-container">
          <input
            id="search-input"
            v-model="query"
            type="text"
            :disabled="disabled"
            placeholder="pikachu..."
          >
          <button
            id="submit-button"
            :disabled="query === '' || disabled"
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

    <Loading v-if="loading" />

    <p
      v-else-if="error"
      class="error-message"
    >
      <span>Sorry! We didn't find anything...</span>
    </p>

    <Render
      v-else-if="items"
      :items="items"
    />

    <Modal
      v-if="showModal"
      @close="modalVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetch } from '../../service/api';
import { parseEvolutionChain } from '../../service/utils';
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';
import Loading from '../../components/Loading/Loading.vue';
import Modal from '../../components/Modal/Modal.vue';

const error = ref<boolean>(false);
const query = ref<string>('');
const items = ref<Pokemon[]>();
const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);
const showModal = ref<boolean>(false);

const modalVisible = (value: boolean) => {
  showModal.value = value;
};

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
  loading.value = true;
  disabled.value = true;

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
            loading.value = false;
            disabled.value = false;
          } else {
            items.value = [];
            error.value = true;
            loading.value = false;
            disabled.value = false;
          }
        } else {
          items.value = [];
          error.value = true;
          loading.value = false;
          disabled.value = false;
        }
      } else {
        items.value = [];
        error.value = true;
        loading.value = false;
        disabled.value = false;
      }
    } else {
      items.value = [];
      error.value = true;
      loading.value = false;
      disabled.value = false;
    }
  });
}
</script>

<style src="./_Home.scss" lang="scss" scoped></style>
