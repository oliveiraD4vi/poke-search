<template>
  <div>
    <header>
      <ul>
        <li>
          <router-link :to="{ name: 'home' }">
            Home
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }">
            About
          </router-link>
        </li>
      </ul>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>
