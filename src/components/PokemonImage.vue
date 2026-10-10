<script setup lang="ts">
import { ref, watch } from "vue";

// Imagem com nova tentativa e um marcador se não carregar (o cache da frente pode estar frio).
const props = defineProps<{ src: string; alt?: string; size: number; lazy?: boolean; silhouette?: boolean }>();
const attempt = ref(0);
const loaded = ref(false);
const failed = ref(false);

watch(
  () => props.src,
  () => {
    attempt.value = 0;
    loaded.value = false;
    failed.value = false;
  },
);

function onError() {
  if (attempt.value < 2) setTimeout(() => attempt.value++, 1200 * (attempt.value + 1));
  else failed.value = true;
}
</script>

<template>
  <span v-if="failed" class="img-fallback" aria-hidden="true">?</span>
  <img
    v-else
    :key="attempt"
    :src="attempt ? `${src}?t=${attempt}` : src"
    :alt="alt ?? ''"
    :width="size"
    :height="size"
    :loading="lazy ? 'lazy' : 'eager'"
    decoding="async"
    :data-loaded="loaded"
    :class="{ silhouette }"
    @load="loaded = true"
    @error="onError"
  />
</template>
