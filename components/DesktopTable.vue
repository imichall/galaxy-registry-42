<template>
  <div class="desktop-table">
    <div class="table-wrapper">
      <table>
        <thead class="table-header characters">
          <tr>
            <th
              class="sortable"
              @click="$emit('sort', 'id')"
              title="Click to sort"
            >
              ID {{ getSortIcon("id") }}
            </th>
            <th
              class="sortable"
              @click="$emit('sort', 'name')"
              title="Click to sort"
            >
              Name {{ getSortIcon("name") }}
            </th>
            <th>Gender</th>
            <th>Ability</th>
            <th>Minimal distance</th>
            <th>Weight</th>
            <th
              class="sortable"
              @click="$emit('sort', 'born')"
              title="Click to sort"
            >
              Born {{ getSortIcon("born") }}
            </th>
            <th>In space since</th>
            <th>Beer consumption (l/y)</th>
            <th>Knows the answer?</th>
            <th>
              <button
                class="clear-filters-btn"
                @click="$emit('clear-filters')"
                title="Clear all filters"
              >
                Clear
              </button>
            </th>
          </tr>
          <tr class="filter-row">
            <th>
              <input
                :value="filters.id"
                @input="$emit('update:filters', { ...filters, id: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter ID..."
                class="filter-input"
              />
            </th>
            <th>
              <input
                :value="filters.name"
                @input="$emit('update:filters', { ...filters, name: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter name..."
                class="filter-input"
              />
            </th>
            <th>
              <select
                :value="filters.gender"
                @change="$emit('update:filters', { ...filters, gender: ($event.target as HTMLSelectElement).value })"
                class="filter-input"
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </th>
            <th>
              <select
                :value="filters.ability"
                @change="$emit('update:filters', { ...filters, ability: ($event.target as HTMLSelectElement).value })"
                class="filter-input"
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
            </th>
            <th>
              <input
                :value="filters.minimalDistance"
                @input="$emit('update:filters', { ...filters, minimalDistance: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter distance..."
                class="filter-input"
              />
            </th>
            <th>
              <input
                :value="filters.weight"
                @input="$emit('update:filters', { ...filters, weight: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter weight..."
                class="filter-input"
              />
            </th>
            <th>
              <input
                :value="filters.born"
                @input="$emit('update:filters', { ...filters, born: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter born..."
                class="filter-input"
              />
            </th>
            <th>
              <input
                :value="filters.inSpaceSince"
                @input="$emit('update:filters', { ...filters, inSpaceSince: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter space..."
                class="filter-input"
              />
            </th>
            <th>
              <input
                :value="filters.beerConsumption"
                @input="$emit('update:filters', { ...filters, beerConsumption: ($event.target as HTMLInputElement).value })"
                type="text"
                placeholder="Filter beer..."
                class="filter-input"
              />
            </th>
            <th>
              <select
                :value="filters.knowsAnswer"
                @change="$emit('update:filters', { ...filters, knowsAnswer: ($event.target as HTMLSelectElement).value })"
                class="filter-input"
              >
                <option value="">All</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="(character, index) in characters"
            :key="`${character.data.ID}-${character.data['Beer consumption (l/y)']}-${index}`"
          >
            <tr
              :class="{
                'highlight-row': shouldHighlight(character),
                'has-duplicates': duplicatedIds.has(character.data.ID),
              }"
              @mouseenter="$emit('row-hover', character)"
              @mouseleave="$emit('row-leave')"
            >
              <td
                :class="{
                  'highlight-different': isDifferentProperty(character, 'ID'),
                  'id-cell': true,
                }"
              >
                <div class="id-content">
                  <button
                    v-if="hasNemesis(character)"
                    class="expand-button"
                    :class="{
                      expanded: isCharacterExpanded(character.data.ID),
                    }"
                    @click="$emit('toggle-character', character.data.ID)"
                    title="Rozbalit/sbalit nemesis"
                  >
                    ▶
                  </button>
                  <span class="id-number">{{ character.data.ID }}</span>
                </div>
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(character, 'Name'),
                }"
              >
                {{ character.data.Name }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Gender'
                  ),
                }"
              >
                {{ character.data.Gender }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Ability'
                  ),
                }"
              >
                {{ character.data.Ability }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Minimal distance'
                  ),
                }"
              >
                {{ character.data["Minimal distance"] }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Weight'
                  ),
                }"
              >
                {{ character.data.Weight }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(character, 'Born'),
                }"
              >
                {{ formatDate(character.data.Born) }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'In space since'
                  ),
                }"
              >
                {{ formatDate(character.data["In space since"]) }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Beer consumption (l/y)'
                  ),
                }"
              >
                {{ character.data["Beer consumption (l/y)"] }}
              </td>
              <td
                :class="{
                  'highlight-different': isDifferentProperty(
                    character,
                    'Knows the answer?'
                  ),
                }"
              >
                {{ formatBoolean(character.data["Knows the answer?"]) }}
              </td>
              <td>
                <button
                  class="delete-button"
                  @click="$emit('delete-character', character, index)"
                  title="Remove postavu"
                >
                  ✕
                </button>
              </td>
            </tr>

            <tr
              v-if="
                isCharacterExpanded(character.data.ID) && hasNemesis(character)
              "
            >
              <td colspan="11" style="padding: 0">
                <div class="nested-table">
                  <table>
                    <thead class="table-header nemesis">
                      <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Character ID</th>
                        <th>Is alive?</th>
                        <th>Years</th>
                        <th>delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      <template
                        v-for="nemesis in character.children.has_nemesis
                          ?.records"
                        :key="nemesis.data.ID"
                      >
                        <tr>
                          <td>
                            <button
                              v-if="hasSecrets(nemesis)"
                              class="expand-button"
                              :class="{
                                expanded: isNemesisExpanded(
                                  character.data.ID,
                                  nemesis.data.ID
                                ),
                              }"
                              @click="
                                $emit(
                                  'toggle-nemesis',
                                  character.data.ID,
                                  nemesis.data.ID
                                )
                              "
                              title="Rozbalit/sbalit secrets"
                            >
                              ▶
                            </button>
                          </td>
                          <td>{{ nemesis.data.ID }}</td>
                          <td>{{ nemesis.data["Character ID"] }}</td>
                          <td>
                            {{ formatBoolean(nemesis.data["Is alive?"]) }}
                          </td>
                          <td>{{ nemesis.data.Years }}</td>
                          <td>
                            <button
                              class="delete-button"
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
                          </td>
                        </tr>

                        <tr
                          v-if="
                            isNemesisExpanded(
                              character.data.ID,
                              nemesis.data.ID
                            ) && hasSecrets(nemesis)
                          "
                        >
                          <td colspan="6" style="padding: 0">
                            <div class="nested-table">
                              <table>
                                <thead class="table-header secrets">
                                  <tr>
                                    <th>ID</th>
                                    <th>Nemesis ID</th>
                                    <th>Secrete Code</th>
                                    <th>delete</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr
                                    v-for="secret in nemesis.children
                                      .has_secrete?.records"
                                    :key="secret.data.ID"
                                  >
                                    <td>{{ secret.data.ID }}</td>
                                    <td>{{ secret.data["Nemesis ID"] }}</td>
                                    <td>{{ secret.data["Secrete Code"] }}</td>
                                    <td>
                                      <button
                                        class="delete-button"
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
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
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
  sortBy: string;
  sortOrder: "asc" | "desc";
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

const props = defineProps<Props>();

defineEmits<{
  sort: [column: string];
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

const getSortIcon = (column: string) => {
  if (props.sortBy !== column) return "↕️";
  return props.sortOrder === "asc" ? "↑" : "↓";
};
</script>

<style scoped>
.nested-table {
  background: #fafafa;
}

.nested-table .nested-table {
  background: #f0f0f0;
}

.nested-table td {
  font-size: 12px;
}

.nested-table .table-header th {
  color: #000;
  font-size: 12px;
  padding: 8px 12px;
}

.filter-row {
  background: rgba(255, 255, 255, 0.1) !important;
}

.filter-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  color: #333;
}

.filter-input:focus {
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

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.sortable:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.id-cell {
  padding: 8px 12px !important;
}

.id-content {
  display: flex;
  align-items: center;
  min-height: 20px;
}

.expand-button {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
  color: #666;
  transition: transform 0.2s;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.expand-button:hover {
  color: #333;
  transform: scale(1.1);
}

.expand-button.expanded {
  transform: rotate(90deg);
}

.id-number {
  margin-left: 4px;
}

.has-duplicates {
  position: relative;
  border-left: 3px solid rgba(255, 152, 0, 0.5);
}

.highlight-row {
  background-color: rgba(255, 152, 0, 0.1) !important;
}

.highlight-row {
  border-left-color: rgba(255, 152, 0, 1) !important;
}

.highlight-different {
  background-color: rgba(244, 67, 54, 0.2) !important;
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

.has-duplicates:hover::after {
  content: "⚠️ Same ID - hover for comparison";
  position: absolute;
  top: -30px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}
</style>