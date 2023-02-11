<template>
  <section>
    <div class="c-loader" />
  </section>
</template>

<style lang="scss" scoped>
section {
  display: flex;
  justify-content: center;
  width: 100%;

  .c-loader {
    animation: is-rotating 1s infinite;
    border: 6px solid $white-900;
    border-radius: 50%;
    border-top-color: #ff4800;
    height: 30px;
    width: 30px;
  }
}

@keyframes is-rotating {
  to {
    transform: rotate(1turn);
  }
}
</style>
