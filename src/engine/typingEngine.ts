import type { CharState } from '../types'

export interface TypingEngineState {
  chars: CharState[]
  cursorIndex: number
  errors: number
}

export interface TypeCharacterResult {
  state: TypingEngineState
  isCorrect: boolean
  typedIndex: number
}

export function countCorrectChars(chars: CharState[]): number {
  return chars.filter((c) => c.status === 'correct').length
}

/**
 * Applies one keystroke at `cursorIndex`.
 * Always advances the cursor by one after a successful application.
 */
export function applyCharacter(
  state: TypingEngineState,
  inputChar: string,
): TypeCharacterResult | null {
  const { chars, cursorIndex } = state
  const expected = chars[cursorIndex]?.char
  if (expected === undefined) return null

  const next = [...chars]
  const isCorrect = inputChar === expected

  if (isCorrect) {
    next[cursorIndex] = { ...next[cursorIndex]!, status: 'correct' }
  } else {
    next[cursorIndex] = { ...next[cursorIndex]!, status: 'incorrect' }
  }

  return {
    state: {
      chars: next,
      cursorIndex: cursorIndex + 1,
      errors: isCorrect ? state.errors : state.errors + 1,
    },
    isCorrect,
    typedIndex: cursorIndex,
  }
}

/**
 * Undoes the last keystroke. Only affects non-correct characters so
 * confirmed correct text cannot be reverted to pending.
 */
export function applyBackspace(state: TypingEngineState): TypingEngineState {
  const { chars, cursorIndex, errors } = state
  if (cursorIndex === 0) return state

  const idx = cursorIndex - 1
  const target = chars[idx]
  if (!target || target.status === 'correct') {
    return state
  }

  const next = [...chars]
  next[idx] = { ...target, status: 'pending' }

  return {
    chars: next,
    cursorIndex: idx,
    errors: target.status === 'incorrect' ? Math.max(0, errors - 1) : errors,
  }
}
