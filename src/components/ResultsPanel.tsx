import type { SessionResult, TimerMode } from '../types'
import { formatTime } from '../utils/typingMetrics'
import { getHistoryStats, loadUserData } from '../storage/userStore'
import { KeyHeatmap } from './KeyHeatmap'
import { NewBadgesToast } from './BadgesGrid'

interface ResultsPanelProps {
  result: SessionResult
  timerMode: TimerMode
  isNewRecord: boolean
  bestWpm: number
  newBadges: string[]
  sessionKeyErrors: Record<string, number>
  onRetry: () => void
  onChangeTimer: () => void
}

export function ResultsPanel({
  result,
  timerMode,
  isNewRecord,
  bestWpm,
  newBadges,
  sessionKeyErrors,
  onRetry,
  onChangeTimer,
}: ResultsPanelProps) {
  const userData = loadUserData()
  const stats = getHistoryStats(userData)
  const modeLabel =
    timerMode === 'infinite' ? 'infinito' : `${timerMode} segundos`

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
    >
      <div className="animate-slide-up max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl dark:bg-surface-dark sm:p-8">
        <h2
          id="results-title"
          className="text-center text-lg font-semibold text-text dark:text-text-dark"
        >
          Resultados
        </h2>
        {isNewRecord && (
          <p className="animate-fade-in mt-2 text-center text-sm font-medium text-accent dark:text-accent-dark">
            ¡Nuevo récord en modo {modeLabel}!
          </p>
        )}

        <NewBadgesToast badgeIds={newBadges} />

        <dl className="mt-6 grid grid-cols-2 gap-4">
          {[
            { label: 'WPM', value: result.wpm, highlight: true },
            { label: 'Precisión', value: `${result.accuracy}%` },
            { label: 'Tiempo', value: formatTime(result.timeSeconds) },
            { label: 'Errores', value: result.errors, error: true },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <dt className="text-xs uppercase tracking-widest text-muted">
                {item.label}
              </dt>
              <dd
                className={`font-mono text-3xl font-medium transition-all duration-500 ${
                  item.error
                    ? 'text-error'
                    : item.highlight
                      ? 'text-text dark:text-caret'
                      : 'text-text dark:text-text-dark'
                }`}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <KeyHeatmap
          keyErrors={sessionKeyErrors}
          title="Heatmap de esta sesión"
          compact
        />

        <div className="mt-6 rounded-lg bg-bg p-4 dark:bg-bg-dark">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
            Progreso
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-text dark:text-text-dark">
            <li className="flex justify-between">
              <span>Mejor WPM ({modeLabel})</span>
              <span className="font-mono font-medium">{bestWpm}</span>
            </li>
            <li className="flex justify-between">
              <span>WPM medio (historial)</span>
              <span className="font-mono font-medium">{stats.averageWpm}</span>
            </li>
            <li className="flex justify-between">
              <span>Sesiones totales</span>
              <span className="font-mono font-medium">{stats.totalSessions}</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] dark:bg-accent-dark dark:text-bg-dark"
          >
            Repetir
          </button>
          <button
            type="button"
            onClick={onChangeTimer}
            className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:bg-black/5 active:scale-[0.98] dark:border-white/10 dark:text-text-dark dark:hover:bg-white/5"
          >
            Cambiar tiempo
          </button>
        </div>
      </div>
    </div>
  )
}
