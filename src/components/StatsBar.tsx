import type { LiveStats } from '../types'
import { formatTime } from '../utils/typingMetrics'

interface StatsBarProps {
  stats: LiveStats
}

const ITEMS = [
  { key: 'wpm', label: 'wpm' },
  { key: 'accuracy', label: 'acc', suffix: '%' },
  { key: 'timeSeconds', label: 'tiempo', format: formatTime },
  { key: 'errors', label: 'errores' },
] as const

export function StatsBar({ stats }: StatsBarProps) {
  const values: Record<string, string | number> = {
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    timeSeconds: formatTime(stats.timeSeconds),
    errors: stats.errors,
  }

  return (
    <div className="grid w-full max-w-lg grid-cols-4 gap-2 px-4 sm:gap-4">
      {ITEMS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center gap-1">
          <span className="font-mono text-lg font-medium text-text dark:text-text-dark sm:text-2xl">
            {values[key]}
            {key === 'accuracy' && '%'}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
