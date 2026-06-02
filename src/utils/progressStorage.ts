import type { ProgressRecord, TimerMode } from '../types'

const STORAGE_KEY = 'ods-typing-progress'

const DEFAULT_PROGRESS: ProgressRecord = {
  bestWpm: { '15': 0, '30': 0, '60': 0, infinite: 0 },
  sessionsCompleted: 0,
}

export function loadProgress(): ProgressRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    const parsed = JSON.parse(raw) as ProgressRecord
    return {
      bestWpm: { ...DEFAULT_PROGRESS.bestWpm, ...parsed.bestWpm },
      sessionsCompleted: parsed.sessionsCompleted ?? 0,
    }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(record: ProgressRecord): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export function updateProgressAfterSession(
  mode: TimerMode,
  wpm: number,
): { record: ProgressRecord; isNewRecord: boolean } {
  const record = loadProgress()
  const previousBest = record.bestWpm[mode]
  const isNewRecord = wpm > previousBest
  if (isNewRecord) {
    record.bestWpm[mode] = wpm
  }
  record.sessionsCompleted += 1
  saveProgress(record)
  return { record, isNewRecord }
}
