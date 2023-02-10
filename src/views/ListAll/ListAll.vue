<template>
  <div class="list-container">
    <ul class="listing">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="item"
      >
        <Card :data="item" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetch } from '../../service/api';
import { Pokemon } from '../../types/Pokemon';

import Card from '../../components/Card/Card.vue';

const error = ref<boolean>(false);
const items = ref<Pokemon[]>();

const getAll = async () => {
  await fetch.getAllPokemon()
  .then((response) => {
    if (!response.error) {
      error.value = false;
      items.value = [
        ...response.data.results,
      ];
    } else {
      error.value = true;
    }
  });
};

onMounted(() => getAll());
</script>

<style src="./_ListAll.scss" lang="scss" scoped></style>
