import type { TimerMode } from '../types'
import type {
  HistoryStats,
  SessionHistoryEntry,
  SessionSavePayload,
  UserData,
  UserProfile,
  UserSettings,
} from '../types/user'
import { evaluateNewBadges } from '../data/badges'

const STORAGE_KEY = 'ods-typing-user'
const LEGACY_KEY = 'ods-typing-progress'
const MAX_HISTORY = 100

const DEFAULT_DATA: UserData = {
  profile: {
    displayName: 'Estudiante ODS',
    createdAt: new Date().toISOString(),
    avatarHue: 155,
  },
  settings: {
    soundsEnabled: true,
  },
  progress: {
    bestWpm: { '15': 0, '30': 0, '60': 0, infinite: 0 },
    sessionsCompleted: 0,
    totalTypedChars: 0,
    totalErrors: 0,
  },
  history: [],
  keyErrors: {},
  unlockedBadges: [],
}

function migrateLegacy(): Partial<UserData> | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      bestWpm?: UserData['progress']['bestWpm']
      sessionsCompleted?: number
    }
    localStorage.removeItem(LEGACY_KEY)
    return {
      progress: {
        ...DEFAULT_DATA.progress,
        bestWpm: { ...DEFAULT_DATA.progress.bestWpm, ...parsed.bestWpm },
        sessionsCompleted: parsed.sessionsCompleted ?? 0,
      },
    }
  } catch {
    return null
  }
}

export function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const migrated = migrateLegacy()
      const data = { ...DEFAULT_DATA, ...migrated }
      if (migrated) saveUserData(data)
      return data
    }
    const parsed = JSON.parse(raw) as UserData
    return {
      ...DEFAULT_DATA,
      ...parsed,
      profile: { ...DEFAULT_DATA.profile, ...parsed.profile },
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
      progress: {
        ...DEFAULT_DATA.progress,
        ...parsed.progress,
        bestWpm: {
          ...DEFAULT_DATA.progress.bestWpm,
          ...parsed.progress?.bestWpm,
        },
      },
      history: parsed.history ?? [],
      keyErrors: parsed.keyErrors ?? {},
      unlockedBadges: parsed.unlockedBadges ?? [],
    }
  } catch {
    return { ...DEFAULT_DATA }
  }
}

export function saveUserData(data: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function updateProfile(profile: Partial<UserProfile>): UserData {
  const data = loadUserData()
  data.profile = { ...data.profile, ...profile }
  saveUserData(data)
  return data
}

export function updateSettings(settings: Partial<UserSettings>): UserData {
  const data = loadUserData()
  data.settings = { ...data.settings, ...settings }
  saveUserData(data)
  return data
}

function mergeKeyErrors(
  global: Record<string, number>,
  session: Record<string, number>,
): Record<string, number> {
  const merged = { ...global }
  for (const [key, count] of Object.entries(session)) {
    merged[key] = (merged[key] ?? 0) + count
  }
  return merged
}

export function saveSession(
  session: SessionSavePayload,
): {
  data: UserData
  isNewRecord: boolean
  newBadges: string[]
} {
  const data = loadUserData()
  const previousBest = data.progress.bestWpm[session.timerMode]
  const isNewRecord = session.wpm > previousBest

  if (isNewRecord) {
    data.progress.bestWpm[session.timerMode] = session.wpm
  }

  data.progress.sessionsCompleted += 1
  data.progress.totalTypedChars += session.typedChars
  data.progress.totalErrors += session.errors
  data.keyErrors = mergeKeyErrors(data.keyErrors, session.sessionKeyErrors)

  const entry: SessionHistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    timerMode: session.timerMode,
    wpm: session.wpm,
    accuracy: session.accuracy,
    errors: session.errors,
    timeSeconds: session.timeSeconds,
    correctChars: session.correctChars,
  }

  data.history = [entry, ...data.history].slice(0, MAX_HISTORY)

  const newBadges = evaluateNewBadges(data, session, isNewRecord)
  data.unlockedBadges = [...new Set([...data.unlockedBadges, ...newBadges])]

  saveUserData(data)
  return { data, isNewRecord, newBadges }
}

export function getHistoryStats(data?: UserData): HistoryStats {
  const userData = data ?? loadUserData()
  const { history, progress } = userData

  if (history.length === 0) {
    return {
      totalSessions: progress.sessionsCompleted,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpmOverall: Math.max(...Object.values(progress.bestWpm)),
      totalTimeMinutes: 0,
      recentSessions: [],
    }
  }

  const totalWpm = history.reduce((sum, s) => sum + s.wpm, 0)
  const totalAcc = history.reduce((sum, s) => sum + s.accuracy, 0)
  const totalTime = history.reduce((sum, s) => sum + s.timeSeconds, 0)
  const bestFromHistory = Math.max(...history.map((s) => s.wpm))
  const bestWpmOverall = Math.max(
    bestFromHistory,
    ...Object.values(progress.bestWpm),
  )

  return {
    totalSessions: progress.sessionsCompleted,
    averageWpm: Math.round(totalWpm / history.length),
    averageAccuracy: Math.round(totalAcc / history.length),
    bestWpmOverall,
    totalTimeMinutes: Math.round(totalTime / 60),
    recentSessions: history.slice(0, 20),
  }
}

export function getBestWpm(mode: TimerMode): number {
  return loadUserData().progress.bestWpm[mode]
}
