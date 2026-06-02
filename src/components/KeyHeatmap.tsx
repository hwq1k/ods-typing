import { KEYBOARD_ROWS, getHeatmapIntensity } from '../data/keyboardLayout'

interface KeyHeatmapProps {
  keyErrors: Record<string, number>
  title?: string
  compact?: boolean
}

export function KeyHeatmap({ keyErrors, title, compact }: KeyHeatmapProps) {
  const counts = Object.values(keyErrors)
  const max = counts.length > 0 ? Math.max(...counts) : 0
  const totalErrors = counts.reduce((a, b) => a + b, 0)

  if (totalErrors === 0) {
    return (
      <div className={compact ? '' : 'mt-4'}>
        {title && (
          <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
            {title}
          </h4>
        )}
        <p className="text-center text-xs text-muted dark:text-muted">
          Sin errores registrados en esta vista
        </p>
      </div>
    )
  }

  return (
    <div className={compact ? '' : 'mt-4'}>
      {title && (
        <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
          {title}
        </h4>
      )}
      <div className="flex flex-col items-center gap-1.5">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1"
            style={{ paddingLeft: rowIndex * (compact ? 6 : 10) }}
          >
            {row.map((key) => {
              const count = keyErrors[key.id] ?? 0
              const intensity = getHeatmapIntensity(count, max)
              const bg =
                intensity === 0
                  ? 'var(--heatmap-idle)'
                  : `color-mix(in srgb, var(--color-error) ${Math.round(intensity * 85 + 10)}%, var(--heatmap-idle))`

              return (
                <div
                  key={key.id}
                  title={
                    count > 0 ? `${key.label}: ${count} error(es)` : key.label
                  }
                  className={`flex items-center justify-center rounded font-mono uppercase transition-colors duration-300 ${
                    compact ? 'h-7 min-w-7 text-[10px]' : 'h-9 min-w-9 text-xs'
                  }`}
                  style={{
                    backgroundColor: bg,
                    width: key.width ? `${key.width * (compact ? 1.75 : 2.25)}rem` : undefined,
                  }}
                >
                  <span
                    className={
                      intensity > 0.4
                        ? 'text-white'
                        : 'text-muted dark:text-text-dark'
                    }
                  >
                    {key.label.length > 3 ? '␣' : key.label}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">
        {totalErrors} error(es) · más intenso = más fallos
      </p>
    </div>
  )
}
