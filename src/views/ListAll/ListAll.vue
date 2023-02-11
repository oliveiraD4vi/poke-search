<template>
  <div class="list-all-container">
    <Loading v-if="loading" />

    <p
      v-else-if="error"
      class="error-message"
    >
      <span>Sorry! We are having some trouble</span>
    </p>

    <div v-else-if="items && items.length">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update-current-page="updatePage"
      />

      <Render
        :items="items"
      />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update-current-page="updatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetch } from '../../service/api';
import { Pokemon } from '../../types/Pokemon';

import Render from '../../components/Render/Render.vue';
import Loading from '../../components/Loading/Loading.vue';
import Pagination from '../../components/Pagination/Pagination.vue';

const totalPages = computed(() => Math.ceil(count.value / 12));

const error = ref<boolean>(false);
const items = ref<Pokemon[]>();
const loading = ref<boolean>(false);
const disabled = ref<boolean>(false);
const currentPage = ref<number>(1);
const count = ref<number>(1);
const offset = ref<number>(0);

const limit = 12;

const updatePage = (page: number): void => {
  currentPage.value = page;
  offset.value = (currentPage.value - 1) * 12;
  getAll();
};

const getAll = async () => {
  items.value = [];
  loading.value = true;
  disabled.value = true;

  await fetch.getAllPokemon(offset.value, limit)
  .then(async (response) => {
    if (!response.error) {
      const pokemonList = await Promise.all(
        response.data.results.map(
          async (pokemon: { name: string }) => (
            await fetch.getPokemon(pokemon.name)
          ).data
        )
      );

      count.value = response.data.count;
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
