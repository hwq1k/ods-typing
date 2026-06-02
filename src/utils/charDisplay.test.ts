import { describe, expect, it } from 'vitest'
import {
  getVisibleCharacter,
  isSpaceChar,
  PENDING_SPACE_VISUAL,
  TYPED_SPACE_VISUAL,
} from './charDisplay'
import { initCharStates } from './textGenerator'
import { applyCharacter, type TypingEngineState } from '../engine/typingEngine'

describe('initCharStates', () => {
  it('includes every space from multi-word text in the chars array', () => {
    const text = 'hello world'
    const chars = initCharStates(text)
    expect(chars.map((c) => c.char).join('')).toBe(text)
    expect(chars[5]?.char).toBe(' ')
    expect(chars.filter((c) => c.char === ' ')).toHaveLength(1)
  })

  it('preserves consecutive spaces', () => {
    const text = 'a  b'
    const chars = initCharStates(text)
    expect(chars.map((c) => c.char)).toEqual(['a', ' ', ' ', 'b'])
  })
})

describe('getVisibleCharacter', () => {
  it('renders pending spaces as a visible middle dot', () => {
    expect(getVisibleCharacter(' ', 'pending')).toBe(PENDING_SPACE_VISUAL)
    expect(isSpaceChar(' ')).toBe(true)
    expect(isSpaceChar('a')).toBe(false)
  })

  it('renders typed spaces as non-breaking space for stable width', () => {
    expect(getVisibleCharacter(' ', 'correct')).toBe(TYPED_SPACE_VISUAL)
    expect(getVisibleCharacter(' ', 'incorrect')).toBe(TYPED_SPACE_VISUAL)
  })

  it('passes through non-space characters unchanged', () => {
    expect(getVisibleCharacter('x', 'pending')).toBe('x')
  })
})

describe('typing engine with spaces', () => {
  function engineState(text: string): TypingEngineState {
    return { chars: initCharStates(text), cursorIndex: 0, errors: 0 }
  }

  it('accepts space keystrokes between words', () => {
    let state = engineState('ab cd')
    state = applyCharacter(state, 'a')!.state
    state = applyCharacter(state, 'b')!.state
    const space = applyCharacter(state, ' ')!
    expect(space.isCorrect).toBe(true)
    expect(space.state.chars[2]?.char).toBe(' ')
    expect(space.state.chars[2]?.status).toBe('correct')
    expect(space.state.cursorIndex).toBe(3)
  })

  it('marks wrong character at a space position as incorrect', () => {
    const state = engineState('a b')
    const afterA = applyCharacter(state, 'a')!.state
    const wrong = applyCharacter(afterA, 'x')!
    expect(wrong.isCorrect).toBe(false)
    expect(wrong.state.chars[1]?.char).toBe(' ')
    expect(wrong.state.chars[1]?.status).toBe('incorrect')
  })

  it('types multi-word phrases including each space', () => {
    const text = 'uno dos'
    let state = engineState(text)
    for (const ch of text) {
      const result = applyCharacter(state, ch)
      expect(result?.isCorrect).toBe(true)
      state = result!.state
    }
    expect(state.cursorIndex).toBe(text.length)
    expect(state.chars.every((c) => c.status === 'correct')).toBe(true)
  })
})
