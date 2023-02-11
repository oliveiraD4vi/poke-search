<template>
  <nav>
    <ul class="pagination">
      <li class="page-item">
        <button
          class="update-btn"
          :disabled="!hasPreviousPage"
          @click.prevent="previousPage"
        >
          <img
            src="../../assets/svg/arrow-left.svg"
            alt="arrow left icon"
          >
        </button>
      </li>
      <li
        v-for="pageNumber in pageNumbers"
        :key="pageNumber"
        class="page-item"
      >
        <button
          class="page-btn"
          :disabled="pageNumber === currentPage"
          @click.prevent="goToPage(pageNumber)"
        >
          {{ pageNumber }}
        </button>
      </li>
      <li class="page-item">
        <button
          class="update-btn"
          :disabled="!hasNextPage"
          @click.prevent="nextPage"
        >
          <img
            src="../../assets/svg/arrow-right.svg"
            alt="arrow right icon"
          >
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits<{
  (e: 'updateCurrentPage', page: number): void
}>();

const pageNumbers = computed(() => {
  const pages = [];
  if (props.currentPage === 1) {
    pages.push(props.currentPage);
    pages.push(props.currentPage + 1);
    pages.push(props.currentPage + 2);
  } else if (props.currentPage === props.totalPages) {
    pages.push(props.currentPage - 2);
    pages.push(props.currentPage - 1);
    pages.push(props.currentPage);
  } else {
    pages.push(props.currentPage -1);
    pages.push(props.currentPage);
    pages.push(props.currentPage + 1);
  }
  return pages;
});

const hasPreviousPage = computed(() => props.currentPage > 1);
const hasNextPage = computed(() => props.currentPage < props.totalPages);

const previousPage = () => {
  if (hasPreviousPage.value) {
    emit('updateCurrentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (hasNextPage.value) {
    emit('updateCurrentPage', props.currentPage + 1);
  }
};

const goToPage = (page: number) => {
  emit('updateCurrentPage', page);
};
</script>

<style src="./_Pagination.scss" lang="scss" scoped></style>
