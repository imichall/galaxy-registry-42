<template>
  <div class="data-table">
    <TableControls
      :start-index="startIndex"
      :end-index="endIndex"
      :total-items="processedCharacters.length"
      :total-unique-items="uniqueCharacters.length"
      :is-filtered="processedCharacters.length !== uniqueCharacters.length"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      @update:itemsPerPage="changeItemsPerPage"
    />

    <DesktopTable
      :characters="paginatedCharacters"
      :filters="filters"
      :unique-abilities="uniqueAbilities"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :is-character-expanded="isCharacterExpanded"
      :is-nemesis-expanded="isNemesisExpanded"
      :has-nemesis="hasNemesis"
      :has-secrets="hasSecrets"
      :format-date="formatDate"
      :format-boolean="formatBoolean"
      :should-highlight="shouldHighlight"
      :is-different-property="isDifferentProperty"
      :duplicated-ids="duplicatedIds"
      @sort="handleSort"
      @clear-filters="clearFilters"
      @update:filters="updateFilters"
      @toggle-character="toggleCharacterExpanded"
      @toggle-nemesis="toggleNemesisExpanded"
      @delete-character="handleDeleteCharacter"
      @delete-nemesis="handleDeleteNemesis"
      @delete-secret="handleDeleteSecret"
      @row-hover="handleRowHover"
      @row-leave="handleRowLeave"
    />

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @go-to-page="goToPage"
    />

    <MobileView
      :characters="paginatedCharacters"
      :filters="filters"
      :unique-abilities="uniqueAbilities"
      :is-character-expanded="isCharacterExpanded"
      :is-nemesis-expanded="isNemesisExpanded"
      :has-nemesis="hasNemesis"
      :has-secrets="hasSecrets"
      :format-date="formatDate"
      :format-boolean="formatBoolean"
      :should-highlight="shouldHighlight"
      :is-different-property="isDifferentProperty"
      :duplicated-ids="duplicatedIds"
      @clear-filters="clearFilters"
      @update:filters="updateFilters"
      @toggle-character="toggleCharacterExpanded"
      @toggle-nemesis="toggleNemesisExpanded"
      @delete-character="handleDeleteCharacter"
      @delete-nemesis="handleDeleteNemesis"
      @delete-secret="handleDeleteSecret"
      @row-hover="handleRowHover"
      @row-leave="handleRowLeave"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { useCharacterData } from "../composables/useCharacterData";
import { defineProps, defineEmits, ref, computed } from "vue";
import type { Character, NemesisRecord } from "../types";
import TableControls from "./TableControls.vue";
import DesktopTable from "./DesktopTable.vue";
import MobileView from "./MobileView.vue";
import Pagination from "./Pagination.vue";

interface Props {
  characters: Character[];
}

const props = defineProps<Props>();

const filters = ref({
  id: "",
  name: "",
  gender: "",
  ability: "",
  minimalDistance: "",
  weight: "",
  born: "",
  inSpaceSince: "",
  beerConsumption: "",
  knowsAnswer: "",
});

const uniqueAbilities = computed(() => {
  if (!props.characters) return [];

  const abilities = new Set();
  props.characters.forEach((character) => {
    if (character.data.Ability) {
      abilities.add(character.data.Ability);
    }
  });

  return Array.from(abilities).sort();
});

const sortBy = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 20, 50, 100];

// Hover state for highlighting similar IDs
const hoveredCharacterId = ref<string | null>(null);

// Get duplicated IDs and their differences
const duplicatedIds = computed(() => {
  if (!props.characters) return new Map();

  const idGroups = new Map();
  props.characters.forEach((char) => {
    const id = char.data.ID;
    if (!idGroups.has(id)) {
      idGroups.set(id, []);
    }
    idGroups.get(id).push(char);
  });

  // Only keep groups with more than 1 character
  const duplicates = new Map();
  idGroups.forEach((chars, id) => {
    if (chars.length > 1) {
      duplicates.set(id, chars);
    }
  });

  return duplicates;
});

const shouldHighlight = (character: any) => {
  if (!hoveredCharacterId.value) return false;
  return character.data.ID === hoveredCharacterId.value;
};

const isDifferentProperty = (character: any, property: string) => {
  if (
    !hoveredCharacterId.value ||
    character.data.ID !== hoveredCharacterId.value
  ) {
    return false;
  }

  const duplicates = duplicatedIds.value.get(hoveredCharacterId.value);
  if (!duplicates || duplicates.length < 2) return false;

  const values = duplicates.map((char) => char.data[property]);
  return new Set(values).size > 1;
};

const handleRowHover = (character: any) => {
  if (duplicatedIds.value.has(character.data.ID)) {
    hoveredCharacterId.value = character.data.ID;
  }
};

const handleRowLeave = () => {
  hoveredCharacterId.value = null;
};

const uniqueCharacters = computed(() => {
  if (!props.characters || props.characters.length === 0) {
    return [];
  }

  const clonedData = JSON.parse(JSON.stringify(props.characters));

  const uniqueData = clonedData.filter(
    (character: any, index: number, arr: any[]) => {
      return (
        arr.findIndex((c: any) => {
          return JSON.stringify(c.data) === JSON.stringify(character.data);
        }) === index
      );
    }
  );
  return uniqueData;
});

const processedCharacters = computed(() => {
  const uniqueData = uniqueCharacters.value;

  const filteredData = uniqueData.filter((character: any) => {
    const data = character.data;

    return (
      data.ID.toLowerCase().includes(filters.value.id.toLowerCase()) &&
      data.Name.toLowerCase().includes(filters.value.name.toLowerCase()) &&
      data.Gender.toLowerCase().includes(filters.value.gender.toLowerCase()) &&
      data.Ability.toLowerCase().includes(
        filters.value.ability.toLowerCase()
      ) &&
      data["Minimal distance"]
        .toString()
        .includes(filters.value.minimalDistance) &&
      data.Weight.toString().includes(filters.value.weight) &&
      data.Born.toLowerCase().includes(filters.value.born.toLowerCase()) &&
      data["In space since"]
        .toLowerCase()
        .includes(filters.value.inSpaceSince.toLowerCase()) &&
      data["Beer consumption (l/y)"]
        .toString()
        .includes(filters.value.beerConsumption) &&
      data["Knows the answer?"]
        .toLowerCase()
        .includes(filters.value.knowsAnswer.toLowerCase())
    );
  });

  if (sortBy.value) {
    filteredData.sort((a: any, b: any) => {
      let aValue: any, bValue: any;

      switch (sortBy.value) {
        case "id":
          aValue = parseInt(a.data.ID);
          bValue = parseInt(b.data.ID);
          break;
        case "name":
          aValue = a.data.Name.toLowerCase();
          bValue = b.data.Name.toLowerCase();
          break;
        case "born":
          aValue = new Date(a.data.Born.replace(/ [A-Z]{3,4} /, " ")).getTime();
          bValue = new Date(b.data.Born.replace(/ [A-Z]{3,4} /, " ")).getTime();
          if (isNaN(aValue)) aValue = 0;
          if (isNaN(bValue)) bValue = 0;
          break;
        default:
          return 0;
      }

      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder.value === "asc" ? result : -result;
    });
  }

  return filteredData;
});

const paginatedCharacters = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return processedCharacters.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(processedCharacters.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return processedCharacters.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endIndex = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage.value,
    processedCharacters.value.length
  );
});

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortOrder.value = "asc";
  }
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const changeItemsPerPage = (newSize: number) => {
  itemsPerPage.value = newSize;
  currentPage.value = 1;
};

const clearFilters = () => {
  Object.keys(filters.value).forEach((key) => {
    filters.value[key] = "";
  });
  currentPage.value = 1;
};

const updateFilters = (newFilters: any) => {
  filters.value = { ...newFilters };
  currentPage.value = 1;
};

const emit = defineEmits<{
  "delete-character": [character: Character];
  "delete-nemesis": [characterId: string, nemesisId: string, name: string];
  "delete-secret": [
    characterId: string,
    nemesisId: string,
    secretId: string,
    code: string
  ];
}>();

const handleDeleteCharacter = (character: Character, index: number) => {
  emit("delete-character", character);
};

const handleDeleteNemesis = (
  characterId: string,
  nemesisId: string,
  name: string
) => {
  emit("delete-nemesis", characterId, nemesisId, name);
};

const handleDeleteSecret = (
  characterId: string,
  nemesisId: string,
  secretId: string,
  code: string
) => {
  emit("delete-secret", characterId, nemesisId, secretId, code);
};

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
@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-cards {
    display: none;
  }
}
</style>