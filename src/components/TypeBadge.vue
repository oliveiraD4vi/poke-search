<script setup lang="ts">
import { typeName } from "../i18n";

defineProps<{ type: string }>();
</script>

<template>
  <span class="type" :data-type="type">{{ typeName(type) }}</span>
</template>
