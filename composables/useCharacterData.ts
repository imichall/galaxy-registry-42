import { ref, readonly } from 'vue'
import { $fetch } from 'ofetch'
import type { Character, ExpandedState, DeleteConfirmation } from '../types'

export const useCharacterData = () => {
  const characters = ref<Character[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const expandedState = ref<ExpandedState>({})
  const deleteConfirmation = ref<DeleteConfirmation>({
    show: false,
    type: 'character',
    id: '',
    name: '',
    onConfirm: undefined
  })

  const loadCharacters = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/DATA/example-data.json')
      characters.value = response as Character[]
    } catch (err) {
      error.value = 'Chyba při načítání dat'
      console.error('Chyba při načítání dat:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleCharacterExpanded = (characterId: string) => {
    if (!expandedState.value[characterId]) {
      expandedState.value[characterId] = { expanded: false }
    }
    expandedState.value[characterId].expanded = !expandedState.value[characterId].expanded
  }

  const toggleNemesisExpanded = (characterId: string, nemesisId: string) => {
    if (!expandedState.value[characterId]) {
      expandedState.value[characterId] = { expanded: false, nemesis: {} }
    }
    if (!expandedState.value[characterId].nemesis) {
      expandedState.value[characterId].nemesis = {}
    }

    const nemesisState = expandedState.value[characterId].nemesis!
    if (!nemesisState[nemesisId]) {
      nemesisState[nemesisId] = { expanded: false }
    }

    nemesisState[nemesisId].expanded = !nemesisState[nemesisId].expanded
  }

  const isCharacterExpanded = (characterId: string): boolean => {
    return expandedState.value[characterId]?.expanded || false
  }

  const isNemesisExpanded = (characterId: string, nemesisId: string): boolean => {
    return expandedState.value[characterId]?.nemesis?.[nemesisId]?.expanded || false
  }

  const showDeleteConfirmation = (
    type: 'character' | 'nemesis' | 'secret',
    id: string,
    name: string,
    onConfirm: () => void
  ) => {
    deleteConfirmation.value = {
      show: true,
      type,
      id,
      name,
      onConfirm
    }
  }

  const hideDeleteConfirmation = () => {
    deleteConfirmation.value.show = false
  }

  const confirmDelete = () => {
    if (deleteConfirmation.value.onConfirm) {
      deleteConfirmation.value.onConfirm()
    }
    hideDeleteConfirmation()
  }

    const deleteByCharacter = (characterToDelete: Character) => {
    const targetJson = JSON.stringify(characterToDelete.data)
    const index = characters.value.findIndex(char =>
      JSON.stringify(char.data) === targetJson
    )
    if (index > -1) {
      characters.value.splice(index, 1)
      const hasOtherWithSameId = characters.value.some(char =>
        char.data.ID === characterToDelete.data.ID
      )
      if (!hasOtherWithSameId) {
        delete expandedState.value[characterToDelete.data.ID]
      }
    }
  }

  const deleteByNemesis = (characterId: string, nemesisId: string) => {
    const character = characters.value.find(char => char.data.ID === characterId)
    if (character?.children.has_nemesis?.records) {
      const index = character.children.has_nemesis.records.findIndex(
        nemesis => nemesis.data.ID === nemesisId
      )
      if (index > -1) {
        character.children.has_nemesis.records.splice(index, 1)

        if (expandedState.value[characterId]?.nemesis?.[nemesisId]) {
          delete expandedState.value[characterId].nemesis![nemesisId]
        }
      }
    }
  }

  const deleteBySecret = (characterId: string, nemesisId: string, secretId: string) => {
    const character = characters.value.find(char => char.data.ID === characterId)

    const nemesis = character?.children.has_nemesis?.records.find(
      nemesis => nemesis.data.ID === nemesisId
    )

    if (nemesis?.children.has_secrete?.records) {
      const index = nemesis.children.has_secrete.records.findIndex(
        secret => secret.data.ID === secretId
      )
      if (index > -1) {
        nemesis.children.has_secrete.records.splice(index, 1)
      }
    }

  }

    const formatDate = (dateString: string): string => {
    try {
      // Handle the specific format: "Mon Dec 14 00:00:00 CET 1994"
      // Remove timezone part which can cause parsing issues
      const cleanDateString = dateString.replace(/ [A-Z]{3,4} /, ' ')
      const date = new Date(cleanDateString)

      if (isNaN(date.getTime())) {
        const parts = dateString.match(/(\w{3})\s+(\w{3})\s+(\d+).*(\d{4})/)
        if (parts) {
          const [, , month, day, year] = parts
          const monthIndex = new Date(`${month} 1, 2000`).getMonth()
          if (!isNaN(monthIndex)) {
            const lastDayOfMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate()
            const correctedDay = Math.min(parseInt(day), lastDayOfMonth)
            const correctedDate = new Date(parseInt(year), monthIndex, correctedDay)

            if (!isNaN(correctedDate.getTime())) {
              return `${correctedDate.toLocaleDateString('cs-CZ')} *`
            }
          }
        }
        return `Invalid: ${dateString}`
      }

      return date.toLocaleDateString('cs-CZ')
    } catch {
      return dateString
    }
  }

  const formatBoolean = (value: string): string => {
    return value === 'true' ? 'True' : 'False'
  }

  return {
    characters: readonly(characters),
    deleteConfirmation: readonly(deleteConfirmation),
    error: readonly(error),
    expandedState: readonly(expandedState),
    loading: readonly(loading),

    confirmDelete,
    deleteByCharacter,
    deleteByNemesis,
    deleteBySecret,
    formatBoolean,
    formatDate,
    hideDeleteConfirmation,
    isCharacterExpanded,
    isNemesisExpanded,
    loadCharacters,
    toggleCharacterExpanded,
    toggleNemesisExpanded,
    showDeleteConfirmation
  }
}