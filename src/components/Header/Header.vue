<template>
  <nav class="menu">
    <div class="menu-logo">
      <a href="#">Logo</a>
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
      @click="toggleMenu"
    >
      <img
        src="@/assets/svg/hamburger-menu.svg"
        alt="menu icon"
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
const items = [
  { text: 'Home', route: 'home' },
  { text: 'About', route: 'about' },
]

const toggleMenu = () => {
  const menu = document.querySelector('.menu-items')
  if (menu) menu.classList.toggle('show')
}
</script>

<style src="./_Header.scss" lang="scss" scoped></style>
