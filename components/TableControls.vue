<template>
  <div class="controls-header">
    <div class="results-counter">
      Showing {{ startIndex }} - {{ endIndex }} of {{ totalItems }} characters
      <span v-if="isFiltered" class="filtered-indicator">
        (filtered from {{ totalUniqueItems }})
      </span>
    </div>

    <div class="pagination-controls">
      <label class="items-per-page">
        Items per page:
        <select
          :value="itemsPerPage"
          @change="$emit('update:itemsPerPage', parseInt(($event.target as HTMLSelectElement).value))"
          class="items-select"
        >
          <option v-for="size in itemsPerPageOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  totalUniqueItems: number;
  isFiltered: boolean;
  itemsPerPage: number;
  itemsPerPageOptions: number[];
}

defineProps<Props>();

defineEmits<{
  "update:itemsPerPage": [value: number];
}>();
</script>

<style scoped>
.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.items-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.results-counter {
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  border-left: 4px solid #00bcd4;
}

.filtered-indicator {
  color: #00bcd4;
  font-weight: 600;
}

@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>