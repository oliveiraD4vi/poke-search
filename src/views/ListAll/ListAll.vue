<template>
  <div class="list-all-container">
    <Render
      v-if="items"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetch } from '../../service/api';
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';

const error = ref<boolean>(false);
const items = ref<Pokemon[]>();

const getAll = async () => {
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
      items.value = [
        ...pokemonList,
      ];
    } else {
      error.value = true;
    }
  });
};

onMounted(() => getAll());
</script>

<style src="./_ListAll.scss" lang="scss" scoped></style>
