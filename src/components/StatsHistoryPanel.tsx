import type { UserData } from '../types/user'
import { getHistoryStats } from '../storage/userStore'
import { formatTime } from '../utils/typingMetrics'

interface StatsHistoryPanelProps {
  data: UserData
}

export function StatsHistoryPanel({ data }: StatsHistoryPanelProps) {
  const stats = getHistoryStats(data)

  const modeLabel = (mode: string) =>
    mode === 'infinite' ? '∞' : `${mode}s`

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Sesiones', value: stats.totalSessions },
          { label: 'WPM medio', value: stats.averageWpm },
          { label: 'Precisión media', value: `${stats.averageAccuracy}%` },
          { label: 'Tiempo total', value: `${stats.totalTimeMinutes} min` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-bg p-3 text-center dark:bg-bg-dark"
          >
            <dt className="text-[10px] uppercase tracking-widest text-muted">
              {item.label}
            </dt>
            <dd className="mt-1 font-mono text-lg text-text dark:text-text-dark">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
          Récords por modo
        </h3>
        <ul className="grid grid-cols-4 gap-2 text-center text-sm">
          {(['15', '30', '60', 'infinite'] as const).map((mode) => (
            <li
              key={mode}
              className="rounded-lg bg-bg py-2 dark:bg-bg-dark"
            >
              <span className="block text-[10px] uppercase text-muted">
                {modeLabel(mode)}
              </span>
              <span className="font-mono font-medium text-accent dark:text-accent-dark">
                {data.progress.bestWpm[mode]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
          Historial reciente
        </h3>
        {stats.recentSessions.length === 0 ? (
          <p className="text-center text-sm text-muted">
            Completa tu primera sesión para ver el historial.
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-black/5 dark:border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-surface dark:bg-surface-dark">
                <tr className="border-b border-black/5 text-muted dark:border-white/10">
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">Modo</th>
                  <th className="px-3 py-2 font-medium">WPM</th>
                  <th className="px-3 py-2 font-medium">Acc</th>
                  <th className="px-3 py-2 font-medium">Err</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-black/5 transition-colors hover:bg-bg/80 dark:border-white/5 dark:hover:bg-bg-dark/80"
                  >
                    <td className="px-3 py-2 text-text dark:text-text-dark">
                      {new Date(session.timestamp).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2 font-mono">{modeLabel(session.timerMode)}</td>
                    <td className="px-3 py-2 font-mono text-accent dark:text-accent-dark">
                      {session.wpm}
                    </td>
                    <td className="px-3 py-2 font-mono">{session.accuracy}%</td>
                    <td className="px-3 py-2 font-mono text-error">{session.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {stats.recentSessions.length > 0 && (
        <p className="text-center text-[10px] text-muted">
          Tiempo medio por sesión:{' '}
          {formatTime(
            stats.recentSessions.reduce((s, e) => s + e.timeSeconds, 0) /
              stats.recentSessions.length,
          )}
        </p>
      )}
    </div>
  )
}
