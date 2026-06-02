import type { SessionResult, TimerMode } from './index'

export interface UserProfile {
  displayName: string
  createdAt: string
  avatarHue: number
}

export interface UserSettings {
  soundsEnabled: boolean
}

export interface SessionHistoryEntry {
  id: string
  timestamp: number
  timerMode: TimerMode
  wpm: number
  accuracy: number
  errors: number
  timeSeconds: number
  correctChars: number
}

export interface UserProgress {
  bestWpm: Record<TimerMode, number>
  sessionsCompleted: number
  totalTypedChars: number
  totalErrors: number
}

export interface UserData {
  profile: UserProfile
  settings: UserSettings
  progress: UserProgress
  history: SessionHistoryEntry[]
  keyErrors: Record<string, number>
  unlockedBadges: string[]
}

export interface SessionSavePayload extends SessionResult {
  timerMode: TimerMode
  sessionKeyErrors: Record<string, number>
}

export interface HistoryStats {
  totalSessions: number
  averageWpm: number
  averageAccuracy: number
  bestWpmOverall: number
  totalTimeMinutes: number
  recentSessions: SessionHistoryEntry[]
}
