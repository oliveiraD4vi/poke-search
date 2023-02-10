<template>
  <div class="card-container">
    {{ data.name }}
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Pokemon } from '../../types/Pokemon';

defineProps({
  data: {
    type: Object as PropType<Pokemon>,
    required: true,
  },
});
</script>

<style src="./_Card.scss" lang="scss" scoped></style>
