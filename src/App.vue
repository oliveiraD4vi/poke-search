<script setup lang="ts">
import { watchEffect } from "vue";
import { lang, setLang, t, type Lang } from "./i18n";

const LANGS: Lang[] = ["pt", "en"];

watchEffect(() => {
  document.documentElement.lang = lang.value === "pt" ? "pt-BR" : "en";
  document.title = t.value.title;
});

// Links internos mantêm o ?lang= quando a página veio do portfólio com ele.
const withLang = (path: string) => {
  const param = new URLSearchParams(location.search).get("lang");
  return param ? { path, query: { lang: lang.value } } : { path };
};
</script>

<template>
  <header class="top wrap">
    <RouterLink :to="withLang('/')" class="brand">
      <span class="ball" aria-hidden="true" />
      {{ t.title }}
    </RouterLink>
    <nav class="nav" :aria-label="t.nav.dex">
      <RouterLink :to="withLang('/')" class="nav-link" exact-active-class="is-active">{{ t.nav.dex }}</RouterLink>
      <RouterLink :to="withLang('/jogo')" class="nav-link" active-class="is-active">{{ t.nav.game }}</RouterLink>
    </nav>
    <div class="lang" role="group" :aria-label="t.language">
      <button
        v-for="code in LANGS"
        :key="code"
        type="button"
        :aria-pressed="lang === code"
        :lang="code === 'pt' ? 'pt-BR' : 'en'"
        @click="setLang(code)"
      >
        {{ code.toUpperCase() }}
      </button>
    </div>
  </header>

  <RouterView />

  <footer class="footer">
    <div class="wrap">
      {{ t.madeBy }}
      <a :href="lang === 'pt' ? 'https://coaladev.com.br' : 'https://coaladev.com.br/en/'" target="_blank" rel="noopener">Davi Oliveira</a>
      · <a href="https://github.com/oliveiraD4vi/poke-search" target="_blank" rel="noopener">{{ t.code }}</a> ·
      <a href="https://pokeapi.co" target="_blank" rel="noopener">{{ t.data }}</a>
    </div>
  </footer>
</template>
