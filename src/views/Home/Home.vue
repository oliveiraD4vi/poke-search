<template>
  <section>
    <form @submit.prevent="onSubmit">
      <div class="search-container">
        <input
          id="search-input"
          v-model="query"
          type="text"
          placeholder="Pikachu..."
        >
        <button
          id="submit-button"
          :disabled="query === ''"
          type="submit"
        >
          <img
            id="search-icon"
            src="@/assets/svg/search-white.svg"
            alt="search"
          >
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');

const onSubmit = (): void => {
  console.log(query.value);
}
</script>

<style src="./_Home.scss" lang="scss" scoped></style>
