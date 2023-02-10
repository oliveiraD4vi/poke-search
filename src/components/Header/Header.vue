<template>
  <nav class="menu">
    <div class="menu-logo">
      <router-link :to="{ name: 'home' }">
        <img
          src="@/assets/png/logo-pokemon.png"
          alt="pokemon logo"
        >
      </router-link>
    </div>
    <ul class="menu-items">
      <li
        v-for="item in items"
        :key="item.text"
        class="menu-item"
      >
        <router-link :to="{ name: item.route }">
          {{ item.text }}
        </router-link>
      </li>
    </ul>
    <div
      class="menu-hamburger"
      @click="handleToggle(true)"
    >
      <img
        src="@/assets/svg/hamburger-menu-white.svg"
        alt="menu icon"
      >
    </div>

    <div v-if="showModal">
      <div
        class="menu-modal-wrapper"
        @click="handleToggle(false)"
      />
      <div class="menu-modal">
        <button class="close-btn">
          <img
            src="@/assets/svg/close-x-black.svg"
            alt="close menu modal button"
            @click="handleToggle(false)"
          >
        </button>
        <ul class="menu-items">
          <li
            v-for="item in items"
            :key="item.text"
            class="menu-item"
          >
            <router-link
              :to="{ name: item.route }"
              @click="handleToggle(false)"
            >
              {{ item.text }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = [
  { text: 'Home', route: 'home' },
  { text: 'About', route: 'about' },
];

const showModal = ref(false);

const handleToggle = (value: boolean): void => {
  showModal.value = value;
};
</script>

<style src="./_Header.scss" lang="scss" scoped></style>
