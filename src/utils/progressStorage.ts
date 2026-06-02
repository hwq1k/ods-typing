import type { ProgressRecord, TimerMode } from '../types'
import { getBestWpm, loadUserData, saveSession } from '../storage/userStore'
import type { SessionSavePayload } from '../types/user'

/** @deprecated Usa userStore directamente */
export function loadProgress(): ProgressRecord {
  const { progress } = loadUserData()
  return {
    bestWpm: progress.bestWpm,
    sessionsCompleted: progress.sessionsCompleted,
  }
}

export function updateProgressAfterSession(
  mode: TimerMode,
  wpm: number,
): { record: ProgressRecord; isNewRecord: boolean } {
  const { data, isNewRecord } = saveSession({
    timerMode: mode,
    wpm,
    accuracy: 0,
    timeSeconds: 0,
    errors: 0,
    correctChars: 0,
    typedChars: 0,
    sessionKeyErrors: {},
  })
  return {
    record: {
      bestWpm: data.progress.bestWpm,
      sessionsCompleted: data.progress.sessionsCompleted,
    },
    isNewRecord,
  }
}

export { saveSession, getBestWpm }
export type { SessionSavePayload }
