import { useEffect } from 'react'
import type { CharState, TestState } from '../types'
import type { OdsSnippet } from '../data/odsTexts'

interface TypingAreaProps {
  chars: CharState[]
  cursorIndex: number
  testState: TestState
  snippet: OdsSnippet | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onFocusRequest: () => void
}

function statusClassName(status: CharState['status']): string {
  switch (status) {
    case 'correct':
      return 'text-correct dark:text-correct-dark'
    case 'incorrect':
      return 'text-error underline decoration-error'
    default:
      return 'text-muted/50 dark:text-muted-dark/40'
  }
}

export function TypingArea({
  chars,
  cursorIndex,
  testState,
  snippet,
  inputRef,
  onKeyDown,
  onFocusRequest,
}: TypingAreaProps) {
  useEffect(() => {
    onFocusRequest()
  }, [onFocusRequest])

  const isFinished = testState === 'finished'

  return (
    <section className="relative w-full px-4 sm:px-8" aria-label="Área de mecanografía">
      {snippet && testState === 'idle' && (
        <p className="mb-4 text-center text-xs text-accent dark:text-accent-dark">
          ODS {snippet.goal}: {snippet.title}
        </p>
      )}

      <div
        className="relative min-h-[8rem] cursor-text rounded-lg sm:min-h-[10rem]"
        onClick={onFocusRequest}
        role="presentation"
      >
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="absolute h-px w-px overflow-hidden opacity-0"
          aria-label="Entrada de mecanografía"
          onKeyDown={onKeyDown}
          disabled={isFinished}
        />

        <p className="font-mono text-lg leading-relaxed sm:text-2xl md:text-3xl">
          {chars.map((item, index) => {
            const isCaret = index === cursorIndex && !isFinished
            const colorClass = statusClassName(item.status)

            return (
              <span
                key={index}
                className={`relative inline-block transition-colors duration-150 ${colorClass}`}
              >
                {item.char}
                {isCaret && (
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full animate-pulse bg-caret"
                    aria-hidden
                  />
                )}
              </span>
            )
          })}
        </p>
      </div>
    </section>
  )
}
