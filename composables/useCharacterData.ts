import { ref, readonly } from 'vue'
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

  const deleteByCharacter = (characterId: string) => {
    const index = characters.value.findIndex(char => char.data.ID === characterId)
    if (index > -1) {
      characters.value.splice(index, 1)
      delete expandedState.value[characterId]
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
      return new Date(dateString).toLocaleDateString('cs-CZ')
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