<template>
  <section>
    <form @submit.prevent="onSubmit">
      <h1>Hello, there!</h1>
      <h2>Here you can search for any pokémon you want</h2>

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
            src="@/assets/svg/search-black.svg"
            alt="search"
          >
        </button>
      </div>

      <p>Just remenber that your input should be exatly the name of the pokémon</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetch } from "../../service/api";

const query = ref('');

const onSubmit = async () => {
  const data = await fetch.getPokemon(query.value);
  console.log(data);
}
</script>

<style src="./_Home.scss" lang="scss" scoped></style>
