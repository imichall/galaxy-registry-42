<template>
  <div class="container">
    <!-- Environment badge -->
    <div class="environment-badge" :class="envClass">
      {{ env.appName }} ({{ env.environment.toUpperCase() }})
    </div>

    <h1>Galaxy Registry 42</h1>

    <div v-if="loading" class="loading">Načítání dat...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <DataTable
        :characters="characters"
        @delete-character="handleDeleteByCharacter"
        @delete-nemesis="handleDeleteByNemesis"
        @delete-secret="handleDeleteBySecret"
      />
    </div>

    <DeleteModal
      v-if="deleteConfirmation.show"
      :type="deleteConfirmation.type"
      :name="deleteConfirmation.name"
      @confirm="confirmDelete"
      @cancel="hideDeleteConfirmation"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCharacterData } from "./composables/useCharacterData";
import { useEnvironment } from "./composables/useEnvironment";
import type { Character } from "./types";

const env = useEnvironment();

const envClass = computed(() => ({
  "env-local": env.isLocal,
  "env-production": env.isProduction,
}));

onMounted(() => {
  env.log(`Application started in ${env.environment} environment`);
  env.log(`API URL: ${env.apiUrl}`);
});

const {
  characters,
  loading,
  error,
  deleteConfirmation,
  loadCharacters,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  confirmDelete,
  deleteByCharacter,
  deleteByNemesis,
  deleteBySecret,
} = useCharacterData();

onMounted(() => {
  loadCharacters();
});

const handleDeleteByCharacter = (character: Character) => {
  showDeleteConfirmation(
    "character",
    character.data.ID,
    character.data.Name,
    () => deleteByCharacter(character)
  );
};

const handleDeleteByNemesis = (
  characterId: string,
  nemesisId: string,
  nemesisName: string
) => {
  showDeleteConfirmation("nemesis", nemesisId, nemesisName, () =>
    deleteByNemesis(characterId, nemesisId)
  );
};

const handleDeleteBySecret = (
  characterId: string,
  nemesisId: string,
  secretId: string,
  secretCode: string
) => {
  showDeleteConfirmation("secret", secretId, secretCode, () =>
    deleteBySecret(characterId, nemesisId, secretId)
  );
};
</script>

<style>
.environment-badge {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.environment-badge.env-local {
  background-color: #10b981;
  color: white;
}

.environment-badge.env-production {
  background-color: #ef4444;
  color: white;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
}
</style>