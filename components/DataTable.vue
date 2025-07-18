<template>
  <div class="data-table">
    <div class="desktop-table">
      <div class="table-wrapper">
        <table>
          <thead class="table-header characters">
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Ability</th>
              <th>Minimal distance</th>
              <th>Weight</th>
              <th>Born</th>
              <th>In space since</th>
              <th>Beer consumption (l/y)</th>
              <th>Knows the answer?</th>
              <th>delete</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="character in characters" :key="character.data.ID">
              <tr>
                <td>
                  <button
                    v-if="hasNemesis(character)"
                    class="expand-button"
                    :class="{
                      expanded: isCharacterExpanded(character.data.ID),
                    }"
                    @click="toggleCharacterExpanded(character.data.ID)"
                    title="Rozbalit/sbalit nemesis"
                  >
                    ▶
                  </button>
                </td>
                <td>{{ character.data.ID }}</td>
                <td>{{ character.data.Name }}</td>
                <td>{{ character.data.Gender }}</td>
                <td>{{ character.data.Ability }}</td>
                <td>{{ character.data["Minimal distance"] }}</td>
                <td>{{ character.data.Weight }}</td>
                <td>{{ formatDate(character.data.Born) }}</td>
                <td>{{ formatDate(character.data["In space since"]) }}</td>
                <td>{{ character.data["Beer consumption (l/y)"] }}</td>
                <td>
                  {{ formatBoolean(character.data["Knows the answer?"]) }}
                </td>
                <td>
                  <button
                    class="delete-button"
                    @click="
                      $emit(
                        'delete-character',
                        character.data.ID,
                        character.data.Name
                      )
                    "
                    title="Remove postavu"
                  >
                    ✕
                  </button>
                </td>
              </tr>

              <tr
                v-if="
                  isCharacterExpanded(character.data.ID) &&
                  hasNemesis(character)
                "
              >
                <td colspan="12" style="padding: 0">
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
                                  toggleNemesisExpanded(
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

    <div class="mobile-cards">
      <div
        v-for="character in characters"
        :key="`mobile-${character.data.ID}`"
        class="character-card"
      >
        <div class="character-header">
          <div class="character-info">
            <div class="character-name">{{ character.data.Name }}</div>
            <div class="character-details">
              ID: {{ character.data.ID }} • {{ character.data.Gender }} •
              {{ character.data.Ability }}
            </div>
          </div>
          <div class="character-actions">
            <button
              v-if="hasNemesis(character)"
              class="mobile-expand-btn"
              :class="{ expanded: isCharacterExpanded(character.data.ID) }"
              @click="toggleCharacterExpanded(character.data.ID)"
              title="Rozbalit/sbalit nemesis"
            >
              ➤
            </button>
            <button
              class="mobile-delete-btn"
              @click="
                $emit(
                  'delete-character',
                  character.data.ID,
                  character.data.Name
                )
              "
              title="Remove postavu"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="character-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Vzdálenost</div>
              <div class="info-value">
                {{ character.data["Minimal distance"] }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Váha</div>
              <div class="info-value">{{ character.data.Weight }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Narozen</div>
              <div class="info-value">
                {{ formatDate(character.data.Born) }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Ve vesmíru od</div>
              <div class="info-value">
                {{ formatDate(character.data["In space since"]) }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Pivo (l/rok)</div>
              <div class="info-value">
                {{ character.data["Beer consumption (l/y)"] }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Zná odpověď?</div>
              <div class="info-value">
                {{ formatBoolean(character.data["Knows the answer?"]) }}
              </div>
            </div>
          </div>

          <div
            v-if="
              isCharacterExpanded(character.data.ID) && hasNemesis(character)
            "
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
                  <div class="nemesis-id">
                    Nemesis ID: {{ nemesis.data.ID }}
                  </div>
                  <div class="nemesis-meta">
                    Naživu: {{ formatBoolean(nemesis.data["Is alive?"]) }} •
                    Roků: {{ nemesis.data.Years }}
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
                      toggleNemesisExpanded(character.data.ID, nemesis.data.ID)
                    "
                    title="Rozbalit/sbalit secrets"
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
                <div class="secrets-header">Tajné kódy</div>
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
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { useCharacterData } from "../composables/useCharacterData";
import { defineProps, defineEmits } from "vue";
import type { Character, NemesisRecord } from "../types";

interface Props {
  characters: Character[];
}

defineProps<Props>();

defineEmits<{
  "delete-character": [id: string, name: string];
  "delete-nemesis": [characterId: string, nemesisId: string, name: string];
  "delete-secret": [
    characterId: string,
    nemesisId: string,
    secretId: string,
    code: string
  ];
}>();

const {
  toggleCharacterExpanded,
  toggleNemesisExpanded,
  isCharacterExpanded,
  isNemesisExpanded,
  formatDate,
  formatBoolean,
} = useCharacterData();

const hasNemesis = (character: Character): boolean => {
  return (
    character.children.has_nemesis?.records &&
    character.children.has_nemesis.records.length > 0
  );
};

const hasSecrets = (nemesis: NemesisRecord): boolean => {
  return (
    nemesis.children.has_secrete?.records &&
    nemesis.children.has_secrete.records.length > 0
  );
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
</style>