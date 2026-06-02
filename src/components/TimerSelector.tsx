import type { TestState, TimerMode } from '../types'

const MODES: { value: TimerMode; label: string }[] = [
  { value: '15', label: '15' },
  { value: '30', label: '30' },
  { value: '60', label: '60' },
  { value: 'infinite', label: '∞' },
]

interface TimerSelectorProps {
  selected: TimerMode
  onSelect: (mode: TimerMode) => void
  testState: TestState
  countdown: number | null
}

export function TimerSelector({
  selected,
  onSelect,
  testState,
  countdown,
}: TimerSelectorProps) {
  const disabled = testState === 'active'

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-1 rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.06]"
        role="group"
        aria-label="Duración del test"
      >
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(value)}
            className={`min-w-[3rem] rounded-md px-3 py-1.5 font-mono text-sm transition-colors ${
              selected === value
                ? 'bg-accent text-white dark:bg-accent-dark dark:text-bg-dark'
                : 'text-muted hover:text-text disabled:opacity-50 dark:text-muted dark:hover:text-text-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {testState === 'active' && countdown !== null && (
        <span className="font-mono text-3xl font-medium text-accent dark:text-caret">
          {Math.ceil(Math.max(0, countdown))}
        </span>
      )}
      {testState === 'active' && countdown === null && (
        <span className="text-xs text-muted dark:text-muted-dark">
          Esc para terminar
        </span>
      )}
      {testState === 'idle' && (
        <span className="text-xs text-muted dark:text-muted-dark">
          Pulsa cualquier tecla para empezar
        </span>
      )}
    </div>
  )
}
