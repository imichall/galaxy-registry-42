<template>
  <div
    v-if="totalPages > 1"
    class="pagination"
    :class="{ 'mobile-pagination': isMobile }"
  >
    <button
      @click="$emit('go-to-page', currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      {{ isMobile ? "← Prev" : "← Previous" }}
    </button>

    <div class="pagination-info">
      {{
        isMobile
          ? `${currentPage} / ${totalPages}`
          : `Page ${currentPage} of ${totalPages}`
      }}
    </div>

    <button
      @click="$emit('go-to-page', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      Next →
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  isMobile?: boolean;
}

defineProps<Props>();

defineEmits<{
  "go-to-page": [page: number];
}>();
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #00bcd4;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.mobile-pagination {
  margin-top: 16px;
}

.mobile-pagination .pagination-btn {
  padding: 10px 16px;
  font-size: 16px;
}
</style>