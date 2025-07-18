<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <h3>Confirm delete</h3>
      <p>
        Are you sure you want to delete
        <strong>{{ getItemTypeName() }}</strong>
        <span v-if="name">"{{ name }}"</span>?
      </p>
      <p class="warning">This action is irreversible.</p>

      <div class="modal-buttons">
        <button class="btn btn-secondary" @click="$emit('cancel')">
          Cancel
        </button>
        <button class="btn btn-danger" @click="$emit('confirm')">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: "character" | "nemesis" | "secret";
  name?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const getItemTypeName = () => {
  switch (props.type) {
    case "character":
      return "character";
    case "nemesis":
      return "nemesis";
    case "secret":
      return "secret";
    default:
      return "item";
  }
};

const handleOverlayClick = () => {
  emit("cancel");
};
</script>

<style scoped>
.warning {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  font-style: italic;
}

.modal p {
  margin-bottom: 8px;
}
</style>