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
            src="../../assets/png/logo-pokemon.png"
            alt=""
            @load="onLoad"
          >
          <button
            class="close-btn"
            @click="$emit('close', false)"
          >
            <img
              src="../../assets/svg/close-x.svg"
              alt="close icon"
            >
          </button>
        </header>
        <div className="content">
          content
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

defineEmits<{
  (e: 'close', value: false): void
}>();

const skeleton = ref<boolean>(true);

const onLoad = (): void => {
  skeleton.value = false;
};
</script>

<style src="./_Modal.scss" lang="scss" scoped></style>
