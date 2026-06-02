export interface KeyDef {
  id: string
  label: string
  width?: number
}

export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { id: 'KeyQ', label: 'q' },
    { id: 'KeyW', label: 'w' },
    { id: 'KeyE', label: 'e' },
    { id: 'KeyR', label: 'r' },
    { id: 'KeyT', label: 't' },
    { id: 'KeyY', label: 'y' },
    { id: 'KeyU', label: 'u' },
    { id: 'KeyI', label: 'i' },
    { id: 'KeyO', label: 'o' },
    { id: 'KeyP', label: 'p' },
  ],
  [
    { id: 'KeyA', label: 'a' },
    { id: 'KeyS', label: 's' },
    { id: 'KeyD', label: 'd' },
    { id: 'KeyF', label: 'f' },
    { id: 'KeyG', label: 'g' },
    { id: 'KeyH', label: 'h' },
    { id: 'KeyJ', label: 'j' },
    { id: 'KeyK', label: 'k' },
    { id: 'KeyL', label: 'l' },
    { id: 'Keyñ', label: 'ñ' },
  ],
  [
    { id: 'KeyZ', label: 'z' },
    { id: 'KeyX', label: 'x' },
    { id: 'KeyC', label: 'c' },
    { id: 'KeyV', label: 'v' },
    { id: 'KeyB', label: 'b' },
    { id: 'KeyN', label: 'n' },
    { id: 'KeyM', label: 'm' },
  ],
  [
    { id: 'Space', label: 'espacio', width: 6 },
  ],
]

const CHAR_TO_KEY: Record<string, string> = {
  ' ': 'Space',
  '.': 'Period',
  ',': 'Comma',
  ';': 'Semicolon',
  ':': 'Semicolon',
  '-': 'Minus',
  "'": 'Quote',
  '"': 'Quote',
  '!': 'Digit1',
  '?': 'Slash',
  'á': 'KeyA',
  'é': 'KeyE',
  'í': 'KeyI',
  'ó': 'KeyO',
  'ú': 'KeyU',
  'ñ': 'Keyñ',
}

export function charToKeyId(char: string, physicalKey?: string): string {
  if (physicalKey && physicalKey !== 'Dead') {
    if (physicalKey === ' ') return 'Space'
    if (physicalKey.length === 1) {
      const lower = physicalKey.toLowerCase()
      if (lower >= 'a' && lower <= 'z') return `Key${physicalKey.toUpperCase()}`
      if (lower === 'ñ') return 'Keyñ'
    }
    if (physicalKey.startsWith('Key') || physicalKey === 'Space') return physicalKey
  }

  const lower = char.toLowerCase()
  if (CHAR_TO_KEY[lower]) return CHAR_TO_KEY[lower]!
  if (lower >= 'a' && lower <= 'z') return `Key${lower.toUpperCase()}`
  if (lower === 'ñ') return 'Keyñ'
  return `Char:${lower}`
}

export function getHeatmapIntensity(count: number, max: number): number {
  if (max <= 0 || count <= 0) return 0
  return Math.min(1, count / max)
}
