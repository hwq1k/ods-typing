export function calculateWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  return Math.round((correctChars / 5) / minutes)
}

export function calculateAccuracy(
  correctChars: number,
  typedChars: number,
): number {
  if (typedChars <= 0) return 100
  return Math.round((correctChars / typedChars) * 100)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatCountdown(seconds: number): string {
  return Math.ceil(Math.max(0, seconds)).toString()
}

export function getTimerSeconds(mode: string): number | null {
  if (mode === 'infinite') return null
  return Number(mode)
}
