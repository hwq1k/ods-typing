import type { SessionResult, TimerMode } from '../types'
import { formatTime } from '../utils/typingMetrics'
import { loadProgress } from '../utils/progressStorage'

interface ResultsPanelProps {
  result: SessionResult
  timerMode: TimerMode
  isNewRecord: boolean
  bestWpm: number
  onRetry: () => void
  onChangeTimer: () => void
}

export function ResultsPanel({
  result,
  timerMode,
  isNewRecord,
  bestWpm,
  onRetry,
  onChangeTimer,
}: ResultsPanelProps) {
  const progress = loadProgress()
  const modeLabel =
    timerMode === 'infinite' ? 'infinito' : `${timerMode} segundos`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm dark:bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl dark:bg-surface-dark sm:p-8">
        <h2
          id="results-title"
          className="text-center text-lg font-semibold text-text dark:text-text-dark"
        >
          Resultados
        </h2>
        {isNewRecord && (
          <p className="mt-2 text-center text-sm font-medium text-accent dark:text-accent-dark">
            ¡Nuevo récord en modo {modeLabel}!
          </p>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <dt className="text-xs uppercase tracking-widest text-muted">WPM</dt>
            <dd className="font-mono text-3xl font-medium text-text dark:text-caret">
              {result.wpm}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-xs uppercase tracking-widest text-muted">Precisión</dt>
            <dd className="font-mono text-3xl font-medium text-text dark:text-text-dark">
              {result.accuracy}%
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-xs uppercase tracking-widest text-muted">Tiempo</dt>
            <dd className="font-mono text-3xl font-medium text-text dark:text-text-dark">
              {formatTime(result.timeSeconds)}
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-xs uppercase tracking-widest text-muted">Errores</dt>
            <dd className="font-mono text-3xl font-medium text-error">{result.errors}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-lg bg-bg p-4 dark:bg-bg-dark">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
            Tu progreso
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-text dark:text-text-dark">
            <li className="flex justify-between">
              <span>Mejor WPM ({modeLabel})</span>
              <span className="font-mono font-medium">{bestWpm}</span>
            </li>
            <li className="flex justify-between">
              <span>Sesiones completadas</span>
              <span className="font-mono font-medium">
                {progress.sessionsCompleted}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-accent-dark dark:text-bg-dark"
          >
            Repetir
          </button>
          <button
            type="button"
            onClick={onChangeTimer}
            className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-black/5 dark:border-white/10 dark:text-text-dark dark:hover:bg-white/5"
          >
            Cambiar tiempo
          </button>
        </div>
      </div>
    </div>
  )
}
