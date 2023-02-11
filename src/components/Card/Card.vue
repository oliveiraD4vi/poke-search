<template>
  <div class="card-container">
    <section class="content">
      <img
        class="raw-image"
        :class="{ skeleton: skeleton }"
        :src="URL"
        :alt="data.name"
        @load="onLoad"
      >

      <div class="info">
        <h2>{{ formatPokemonId(data.id) }}</h2>
        <h1>{{ data.name }}</h1>

        <dl class="types">
          <dt
            v-for="(item, index) in data.types"
            :key="index"
          >
            {{ item.type.name }}
          </dt>
        </dl>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Pokemon } from '../../types/Pokemon';

const skeleton = ref<boolean>(true);

const props = defineProps({
  data: {
    type: Object as PropType<Pokemon>,
    required: true,
  },
});

const URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${props.data.id}.png`;

const formatPokemonId = (id: number) => {
  if (id < 10) {
    return `#00${id}`;
  } else if (id >= 10 && id < 99) {
    return `#0${id}`;
  } else {
    return `#${id}`;
  }
};

const onLoad = (): void => {
  skeleton.value = false;
};
</script>

<style src="./_Card.scss" lang="scss" scoped></style>
