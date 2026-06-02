import { useState } from 'react'
import { Header } from './components/Header'
import { TimerSelector } from './components/TimerSelector'
import { StatsBar } from './components/StatsBar'
import { TypingArea } from './components/TypingArea'
import { ResultsPanel } from './components/ResultsPanel'
import { useTheme } from './hooks/useTheme'
import { useTypingTest } from './hooks/useTypingTest'
import type { TimerMode } from './types'

function TypingSession({
  timerMode,
  onTimerModeChange,
}: {
  timerMode: TimerMode
  onTimerModeChange: (mode: TimerMode) => void
}) {
  const {
    testState,
    chars,
    cursorIndex,
    countdown,
    snippet,
    liveStats,
    result,
    isNewRecord,
    bestWpm,
    inputRef,
    resetTest,
    finishTest,
    handleKeyDown,
    focusInput,
  } = useTypingTest(timerMode)

  const handleChangeTimer = () => {
    resetTest()
  }

  const handleSelectTimer = (mode: TimerMode) => {
    onTimerModeChange(mode)
  }

  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 pb-12">
        <TimerSelector
          selected={timerMode}
          onSelect={handleSelectTimer}
          testState={testState}
          countdown={countdown}
        />

        <StatsBar stats={liveStats} />

        <TypingArea
          chars={chars}
          cursorIndex={cursorIndex}
          testState={testState}
          snippet={snippet}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
          onFocusRequest={focusInput}
        />

        {timerMode === 'infinite' && testState === 'active' && (
          <button
            type="button"
            onClick={finishTest}
            className="text-xs text-muted underline-offset-2 hover:underline dark:text-muted"
          >
            Terminar test
          </button>
        )}
      </main>

      {testState === 'finished' && result && (
        <ResultsPanel
          result={result}
          timerMode={timerMode}
          isNewRecord={isNewRecord}
          bestWpm={bestWpm}
          onRetry={resetTest}
          onChangeTimer={handleChangeTimer}
        />
      )}
    </>
  )
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [timerMode, setTimerMode] = useState<TimerMode>('30')

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <TypingSession
        key={timerMode}
        timerMode={timerMode}
        onTimerModeChange={setTimerMode}
      />

      <footer className="pb-6 text-center text-[10px] text-muted dark:text-muted">
        Contenido educativo sobre los 17 ODS de la ONU ·{' '}
        {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
