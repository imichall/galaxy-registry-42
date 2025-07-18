export interface CharacterData {
  ID: string
  Name: string
  Gender: string
  Ability: string
  "Minimal distance": string
  Weight: string
  Born: string
  "In space since": string
  "Beer consumption (l/y)": string
  "Knows the answer?": string
}

export interface NemesisData {
  ID: string
  "Character ID": string
  "Is alive?": string
  Years: string
}

export interface SecretData {
  ID: string
  "Nemesis ID": string
  "Secrete Code": string
}

export interface SecretRecord {
  data: SecretData
  children: Record<string, never>
}

export interface NemesisRecord {
  data: NemesisData
  children: {
    has_secrete?: {
      records: SecretRecord[]
    }
  }
}

export interface Character {
  data: CharacterData
  children: {
    has_nemesis?: {
      records: NemesisRecord[]
    }
  }
}

export interface ExpandedState {
  [characterId: string]: {
    expanded: boolean
    nemesis?: {
      [nemesisId: string]: {
        expanded: boolean
      }
    }
  }
}

export interface DeleteConfirmation {
  show: boolean
  type: 'character' | 'nemesis' | 'secret'
  id: string
  name?: string
  onConfirm?: () => void
}