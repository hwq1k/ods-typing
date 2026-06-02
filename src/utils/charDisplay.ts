import type { CharState } from '../types'

/** Middle dot shown where a space is still pending. */
export const PENDING_SPACE_VISUAL = '\u00B7'

/** Non-breaking space used so typed spaces keep monospace width in the DOM. */
export const TYPED_SPACE_VISUAL = '\u00A0'

export function isSpaceChar(char: string): boolean {
  return char === ' '
}

/**
 * Maps a logical character from the engine to what we paint in the DOM.
 * Regular characters pass through; spaces use visible glyphs because HTML
 * collapses whitespace inside empty-looking inline boxes.
 */
export function getVisibleCharacter(
  char: string,
  status: CharState['status'],
): string {
  if (!isSpaceChar(char)) return char
  return status === 'pending' ? PENDING_SPACE_VISUAL : TYPED_SPACE_VISUAL
}

export function getCharAriaLabel(char: string): string | undefined {
  if (isSpaceChar(char)) return 'espacio'
  return undefined
}
