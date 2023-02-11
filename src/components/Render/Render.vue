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
import { PropType } from 'vue';
import { Pokemon } from '../../types/Pokemon';

import Card from '../../components/Card/Card.vue';

defineProps({
  items: {
    type: Array as PropType<Pokemon[]>,
    required: true,
  },
});
</script>

<style src="./_Render.scss" lang="scss" scoped></style>
