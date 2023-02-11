<template>
  <div id="main-wrapper">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';

</script>
