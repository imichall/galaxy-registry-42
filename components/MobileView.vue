<template>
  <div class="mobile-cards">
    <div class="mobile-filters">
      <div class="mobile-filter-header">
        <h3>Filters</h3>
        <button class="clear-filters-btn" @click="$emit('clear-filters')">
          Clear All
        </button>
      </div>
      <div class="mobile-filter-grid">
        <input
          :value="filters.name"
          @input="$emit('update:filters', { ...filters, name: ($event.target as HTMLInputElement).value })"
          placeholder="Name..."
          class="mobile-filter-input"
        />
        <select
          :value="filters.gender"
          @change="$emit('update:filters', { ...filters, gender: ($event.target as HTMLSelectElement).value })"
          class="mobile-filter-input"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          :value="filters.ability"
          @change="$emit('update:filters', { ...filters, ability: ($event.target as HTMLSelectElement).value })"
          class="mobile-filter-input"
        >
          <option value="">All Abilities</option>
          <option
            v-for="ability in uniqueAbilities"
            :key="ability"
            :value="ability"
          >
            {{ ability }}
          </option>
        </select>
        <select
          :value="filters.knowsAnswer"
          @change="$emit('update:filters', { ...filters, knowsAnswer: ($event.target as HTMLSelectElement).value })"
          class="mobile-filter-input"
        >
          <option value="">Knows Answer?</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    </div>

    <div
      v-for="(character, index) in characters"
      :key="`mobile-${character.data.ID}-${character.data['Beer consumption (l/y)']}-${index}`"
      class="character-card"
      :class="{
        'highlight-card': shouldHighlight(character),
        'has-duplicates': duplicatedIds.has(character.data.ID),
      }"
      @mouseenter="$emit('row-hover', character)"
      @mouseleave="$emit('row-leave')"
    >
      <div class="character-header">
        <div class="character-info">
          <div
            class="character-name"
            :class="{
              'highlight-different': isDifferentProperty(character, 'Name'),
            }"
          >
            {{ character.data.Name }}
          </div>
          <div class="character-details">
            <span
              :class="{
                'highlight-different': isDifferentProperty(character, 'ID'),
              }"
              >ID: {{ character.data.ID }}</span
            >
            •
            <span
              :class="{
                'highlight-different': isDifferentProperty(character, 'Gender'),
              }"
              >{{ character.data.Gender }}</span
            >
            •
            <span
              :class="{
                'highlight-different': isDifferentProperty(
                  character,
                  'Ability'
                ),
              }"
              >{{ character.data.Ability }}</span
            >
          </div>
        </div>
        <div class="character-actions">
          <button
            v-if="hasNemesis(character)"
            class="mobile-expand-btn"
            :class="{ expanded: isCharacterExpanded(character.data.ID) }"
            @click="$emit('toggle-character', character.data.ID)"
            title="Expand/collapse nemesis"
          >
            ➤
          </button>
          <button
            class="mobile-delete-btn"
            @click="$emit('delete-character', character, index)"
            title="Remove character"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="character-body">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Minimal distance</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(
                  character,
                  'Minimal distance'
                ),
              }"
            >
              {{ character.data["Minimal distance"] }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Weight</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(character, 'Weight'),
              }"
            >
              {{ character.data.Weight }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Born</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(character, 'Born'),
              }"
            >
              {{ formatDate(character.data.Born) }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">In space since</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(
                  character,
                  'In space since'
                ),
              }"
            >
              {{ formatDate(character.data["In space since"]) }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Beer consumption (l/y)</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(
                  character,
                  'Beer consumption (l/y)'
                ),
              }"
            >
              {{ character.data["Beer consumption (l/y)"] }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Knows the answer?</div>
            <div
              class="info-value"
              :class="{
                'highlight-different': isDifferentProperty(
                  character,
                  'Knows the answer?'
                ),
              }"
            >
              {{ formatBoolean(character.data["Knows the answer?"]) }}
            </div>
          </div>
        </div>

        <div
          v-if="isCharacterExpanded(character.data.ID) && hasNemesis(character)"
          class="nemesis-section"
        >
          <div class="nemesis-header">Nemesis</div>

          <div
            v-for="nemesis in character.children.has_nemesis?.records"
            :key="`mobile-nemesis-${nemesis.data.ID}`"
            class="nemesis-card"
          >
            <div class="nemesis-info">
              <div class="nemesis-details">
                <div class="nemesis-id">Nemesis ID: {{ nemesis.data.ID }}</div>
                <div class="nemesis-meta">
                  Alive: {{ formatBoolean(nemesis.data["Is alive?"]) }} • Years:
                  {{ nemesis.data.Years }}
                </div>
              </div>
              <div class="character-actions">
                <button
                  v-if="hasSecrets(nemesis)"
                  class="mobile-expand-btn small"
                  :class="{
                    expanded: isNemesisExpanded(
                      character.data.ID,
                      nemesis.data.ID
                    ),
                  }"
                  @click="
                    $emit('toggle-nemesis', character.data.ID, nemesis.data.ID)
                  "
                  title="Expand/collapse secrets"
                >
                  ➤
                </button>
                <button
                  class="small-delete-btn"
                  @click="
                    $emit(
                      'delete-nemesis',
                      character.data.ID,
                      nemesis.data.ID,
                      `Nemesis ${nemesis.data.ID}`
                    )
                  "
                  title="Remove nemesis"
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              v-if="
                isNemesisExpanded(character.data.ID, nemesis.data.ID) &&
                hasSecrets(nemesis)
              "
              class="secrets-section"
            >
              <div class="secrets-header">Secrets</div>
              <div
                v-for="secret in nemesis.children.has_secrete?.records"
                :key="`mobile-secret-${secret.data.ID}`"
                class="secret-item"
              >
                <div>
                  <div class="secret-code">
                    {{ secret.data["Secrete Code"] }}
                  </div>
                  <div class="secret-id">ID: {{ secret.data.ID }}</div>
                </div>
                <button
                  class="small-delete-btn"
                  @click="
                    $emit(
                      'delete-secret',
                      character.data.ID,
                      nemesis.data.ID,
                      secret.data.ID,
                      secret.data['Secrete Code']
                    )
                  "
                  title="Remove secret"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character, NemesisRecord } from "../types";

interface Props {
  characters: Character[];
  filters: {
    id: string;
    name: string;
    gender: string;
    ability: string;
    minimalDistance: string;
    weight: string;
    born: string;
    inSpaceSince: string;
    beerConsumption: string;
    knowsAnswer: string;
  };
  uniqueAbilities: string[];
  isCharacterExpanded: (id: string) => boolean;
  isNemesisExpanded: (characterId: string, nemesisId: string) => boolean;
  hasNemesis: (character: Character) => boolean;
  hasSecrets: (nemesis: NemesisRecord) => boolean;
  formatDate: (date: string) => string;
  formatBoolean: (value: string) => string;
  shouldHighlight: (character: any) => boolean;
  isDifferentProperty: (character: any, property: string) => boolean;
  duplicatedIds: Map<string, any[]>;
}

defineProps<Props>();

defineEmits<{
  "clear-filters": [];
  "update:filters": [filters: any];
  "toggle-character": [id: string];
  "toggle-nemesis": [characterId: string, nemesisId: string];
  "delete-character": [character: Character, index: number];
  "delete-nemesis": [characterId: string, nemesisId: string, name: string];
  "delete-secret": [
    characterId: string,
    nemesisId: string,
    secretId: string,
    code: string
  ];
  "row-hover": [character: any];
  "row-leave": [];
}>();
</script>

<style scoped>
.mobile-filters {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mobile-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mobile-filter-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.mobile-filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mobile-filter-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #333;
}

.mobile-filter-input:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0, 188, 212, 0.2);
}

.clear-filters-btn {
  background: #ff5722;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background: #d84315;
}

@media (max-width: 768px) {
  .mobile-filter-grid {
    grid-template-columns: 1fr;
  }
}

.has-duplicates {
  position: relative;
  border-left: 4px solid #ff9800;
}

.has-duplicates::before {
  content: "⚠️";
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  z-index: 10;
}

.highlight-card {
  background-color: rgba(255, 152, 0, 0.1) !important;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3) !important;
}

.highlight-different {
  background-color: rgba(244, 67, 54, 0.2) !important;
  border-radius: 4px;
  padding: 2px 4px;
  border-left: 3px solid #f44336 !important;
  font-weight: bold;
  animation: pulse-highlight 1s ease-in-out;
}

@keyframes pulse-highlight {
  0% {
    background-color: rgba(244, 67, 54, 0.4);
  }
  50% {
    background-color: rgba(244, 67, 54, 0.2);
  }
  100% {
    background-color: rgba(244, 67, 54, 0.2);
  }
}
</style>