<template>
  <div class="list-all-container">
    <Loading v-if="loading" />

    <p
      v-else-if="error"
      class="error-message"
    >
      <span>Sorry! We are having some trouble</span>
    </p>

    <Render
      v-else-if="items"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetch } from '../../service/api';
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';
import Loading from '../../components/Loading/Loading.vue';

const error = ref<boolean>(false);
const items = ref<Pokemon[]>();
const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);

const getAll = async () => {
  loading.value = true;
  disabled.value = true;

  await fetch.getAllPokemon()
  .then(async (response) => {
    if (!response.error) {
      const pokemonList = await Promise.all(
        response.data.results.map(
          async (pokemon: { name: string }) => (
            await fetch.getPokemon(pokemon.name)
          ).data
        )
      );

      error.value = false;
      items.value = pokemonList;
      loading.value = false;
      disabled.value = false;
    } else {
      error.value = true;
      loading.value = false;
      disabled.value = false;
    }
  });
};

onMounted(() => getAll());
</script>

<style src="./_ListAll.scss" lang="scss" scoped></style>
