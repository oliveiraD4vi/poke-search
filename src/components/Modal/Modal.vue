<template>
  <div>
    <div
      class="wrapper"
      @click="$emit('close', false)"
    />
    <div class="modal">
      <div className="body">
        <header>
          <img
            class="raw-image"
            :class="{ skeleton: skeleton }"
            :src="store.url"
            alt=""
            @load="onLoad"
          >
          <button
            class="close-btn"
            @click="$emit('close', false)"
          >
            <img
              src="../../assets/svg/close-x-black.svg"
              alt="close icon"
            >
          </button>
        </header>
        <div className="content">
          <section id="left">
            <h2>{{ formatPokemonId(store.data.id) }}</h2>
            <h1>{{ store.data.name }}</h1>

            <ul class="calc-container">
              <li class="calc-item">
                <img
                  src="../../assets/svg/ruler-icon.svg"
                  alt="height icon"
                >
                {{ decimetersToMeters(store.data.height) + ' m' }}
              </li>
              <li class="calc-item">
                <img
                  src="../../assets/svg/barbell-icon.svg"
                  alt="weight icon"
                >
                {{ hectogramsToKilograms(store.data.weight) + ' kg' }}
              </li>
            </ul>

            <dl class="types">
              <dt
                v-for="(item, index) in store.data.types"
                :key="index"
              >
                {{ item.type.name }}
              </dt>
            </dl>
          </section>
          <section id="right">
            <ul class="stats-container">
              <li
                v-for="(stat, index) in store.data.stats"
                :key="index"
              >
                <ProgressBar
                  :title="stat.stat.name"
                  :progress="stat.base_stat"
                />
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PokemonStore } from '../../store/PokemonStore';
import { formatPokemonId, decimetersToMeters, hectogramsToKilograms } from '../../service/utils';

import ProgressBar from '../ProgressBar/ProgressBar.vue';

const store = PokemonStore();

defineEmits<{
  (e: 'close', value: false): void
}>();

const skeleton = ref<boolean>(true);

const onLoad = (): void => {
  skeleton.value = false;
};
</script>

<style src="./_Modal.scss" lang="scss" scoped></style>
