<template>
  <div class="container">
    <span class="title">
      {{ title }}
    </span>
    <span class="value">
      {{ progress }}
    </span>
    <div class="progress-bar">
      <div
        class="progress"
        :style="{ width: progress > 100 ? 100 + '%' : progress + '%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 10px;

  .title {
    width: 35%;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  .value {
    width: 15%;
  }

  .progress-bar {
    width: 50%;
    height: 8px;
    background-color: #e9e9e9;
    border-radius: 10px;
    position: relative;

    .progress {
      height: 100%;
      background-color: #4caf50;
      border-radius: 10px;
      transition: width 0.2s ease;
    }
  }
}
</style>
