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

      <button
        class="modal-button"
        @click="onClick"
      >
        <img
          src="../../assets/svg/details-icon.svg"
          alt="details icon"
        >
        more details
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Pokemon } from '../../types/Pokemon';
import { PokemonStore } from '../../store/PokemonStore';
import { formatPokemonId } from '../../service/utils';

const store = PokemonStore();
const skeleton = ref<boolean>(true);

const props = defineProps({
  data: {
    type: Object as PropType<Pokemon>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close', value: boolean): void
}>();

const URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${props.data.id}.png`;

const onLoad = (): void => {
  skeleton.value = false;
};

const onClick = (): void => {
  store.setUrl(URL);
  store.setData(props.data);
  emit('close', true);
};
</script>

<style src="./_Card.scss" lang="scss" scoped></style>
