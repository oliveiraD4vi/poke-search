<template>
  <div class="list-container">
    <ul class="listing">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="item"
      >
        <Card
          :data="item"
          @close="modalVisible"
        />
      </li>
    </ul>

    <Modal
      v-if="showModal"
      @close="modalVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Pokemon } from '../../types/Pokemon';

import Modal from '../Modal/Modal.vue';
import Card from '../Card/Card.vue';

const showModal = ref<boolean>(false);

const modalVisible = (value: boolean) => {
  showModal.value = value;
};

defineProps({
  items: {
    type: Array as PropType<Pokemon[]>,
    required: true,
  },
});
</script>

<style src="./_Render.scss" lang="scss" scoped></style>
