export type TimerMode = '15' | '30' | '60' | 'infinite'

export type TestState = 'idle' | 'active' | 'finished'

export type CharStatus = 'pending' | 'correct' | 'incorrect'

export interface CharState {
  char: string
  status: CharStatus
}

export interface LiveStats {
  wpm: number
  accuracy: number
  timeSeconds: number
  errors: number
}

export interface SessionResult extends LiveStats {
  correctChars: number
  typedChars: number
}

export interface ProgressRecord {
  bestWpm: Record<TimerMode, number>
  sessionsCompleted: number
}

export type Theme = 'light' | 'dark'
