import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  CharState,
  LiveStats,
  SessionResult,
  TestState,
  TimerMode,
} from '../types'
import type { OdsSnippet } from '../data/odsTexts'
import {
  appendRandomText,
  buildInitialText,
  initCharStates,
} from '../utils/textGenerator'
import {
  calculateAccuracy,
  calculateWpm,
  getTimerSeconds,
} from '../utils/typingMetrics'
import { loadProgress, updateProgressAfterSession } from '../utils/progressStorage'

function countCorrect(chars: CharState[]): number {
  return chars.filter((c) => c.status === 'correct').length
}

function createInitialState(timerMode: TimerMode) {
  const { text, snippet } = buildInitialText()
  return {
    chars: initCharStates(text),
    snippet,
    lastGoal: snippet.goal,
    countdown: getTimerSeconds(timerMode),
    bestWpm: loadProgress().bestWpm[timerMode],
  }
}

export function useTypingTest(timerMode: TimerMode) {
  const initial = createInitialState(timerMode)

  const [testState, setTestState] = useState<TestState>('idle')
  const [chars, setChars] = useState<CharState[]>(initial.chars)
  const [cursorIndex, setCursorIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(initial.countdown)
  const [snippet, setSnippet] = useState<OdsSnippet | null>(initial.snippet)
  const [result, setResult] = useState<SessionResult | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [bestWpm, setBestWpm] = useState(initial.bestWpm)

  const startTimeRef = useRef<number | null>(null)
  const lastGoalRef = useRef(initial.lastGoal)
  const inputRef = useRef<HTMLInputElement>(null)
  const charsRef = useRef(chars)
  const cursorRef = useRef(cursorIndex)
  const testStateRef = useRef(testState)
  const errorsRef = useRef(errors)

  useEffect(() => {
    charsRef.current = chars
    cursorRef.current = cursorIndex
    testStateRef.current = testState
    errorsRef.current = errors
  }, [chars, cursorIndex, testState, errors])

  const resetTest = useCallback(() => {
    const { text, snippet: s } = buildInitialText()
    setChars(initCharStates(text))
    setCursorIndex(0)
    setErrors(0)
    setElapsedMs(0)
    setCountdown(getTimerSeconds(timerMode))
    setSnippet(s)
    setTestState('idle')
    setResult(null)
    setIsNewRecord(false)
    setBestWpm(loadProgress().bestWpm[timerMode])
    startTimeRef.current = null
    lastGoalRef.current = s.goal
    charsRef.current = initCharStates(text)
    cursorRef.current = 0
    testStateRef.current = 'idle'
    errorsRef.current = 0
  }, [timerMode])

  const finishTest = useCallback(() => {
    const currentChars = charsRef.current
    const index = cursorRef.current
    const correctChars = countCorrect(currentChars)
    const typedChars = index
    const elapsed = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0

    const wpm = calculateWpm(correctChars, elapsed || 1)
    const accuracy = calculateAccuracy(correctChars, typedChars)
    const timeSeconds = elapsed / 1000
    const errorCount = errorsRef.current

    const session: SessionResult = {
      wpm,
      accuracy,
      timeSeconds,
      errors: errorCount,
      correctChars,
      typedChars,
    }

    const { record, isNewRecord: newRec } = updateProgressAfterSession(
      timerMode,
      wpm,
    )
    setBestWpm(record.bestWpm[timerMode])
    setIsNewRecord(newRec)
    setResult(session)
    setTestState('finished')
    testStateRef.current = 'finished'
  }, [timerMode])

  useEffect(() => {
    if (testState !== 'active') return

    const interval = window.setInterval(() => {
      if (!startTimeRef.current) return
      const elapsed = Date.now() - startTimeRef.current
      setElapsedMs(elapsed)

      const limit = getTimerSeconds(timerMode)
      if (limit !== null) {
        const remaining = limit - elapsed / 1000
        setCountdown(remaining)
        if (remaining <= 0) {
          finishTest()
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [testState, timerMode, finishTest])

  const extendTextIfNeeded = useCallback(
    (index: number, currentChars: CharState[]) => {
      if (index < currentChars.length - 30) return currentChars
      const { text, snippet: s } = appendRandomText(
        currentChars.map((c) => c.char).join(''),
        lastGoalRef.current,
      )
      lastGoalRef.current = s.goal
      setSnippet(s)
      const extra = text.slice(currentChars.length)
      return [
        ...currentChars,
        ...extra.split('').map((char) => ({ char, status: 'pending' as const })),
      ]
    },
    [],
  )

  const startIfNeeded = useCallback(() => {
    if (testStateRef.current === 'idle') {
      setTestState('active')
      testStateRef.current = 'active'
      startTimeRef.current = Date.now()
    }
  }, [])

  const typeChar = useCallback(
    (inputChar: string) => {
      if (testStateRef.current === 'finished') return
      startIfNeeded()

      const index = cursorRef.current
      setChars((prev) => {
        let current = prev
        if (index >= current.length) {
          current = extendTextIfNeeded(index, current)
        }

        const expected = current[index]?.char
        if (expected === undefined) return current

        const next = [...current]
        if (inputChar === expected) {
          next[index] = { ...next[index]!, status: 'correct' }
        } else {
          next[index] = { ...next[index]!, status: 'incorrect' }
          setErrors((e) => {
            const updated = e + 1
            errorsRef.current = updated
            return updated
          })
        }

        const newIndex = index + 1
        setCursorIndex(newIndex)
        cursorRef.current = newIndex
        charsRef.current = next

        if (newIndex >= next.length - 20) {
          const extended = extendTextIfNeeded(newIndex, next)
          charsRef.current = extended
          return extended
        }
        return next
      })
    },
    [extendTextIfNeeded, startIfNeeded],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (testStateRef.current === 'finished') return

      if (
        e.key === 'Escape' &&
        timerMode === 'infinite' &&
        testStateRef.current === 'active'
      ) {
        e.preventDefault()
        finishTest()
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        if (cursorRef.current === 0) return
        if (testStateRef.current === 'idle') return

        setChars((prev) => {
          const next = [...prev]
          const idx = cursorRef.current - 1
          const prevStatus = next[idx]?.status
          next[idx] = { ...next[idx]!, status: 'pending' }
          if (prevStatus === 'incorrect') {
            setErrors((err) => {
              const updated = Math.max(0, err - 1)
              errorsRef.current = updated
              return updated
            })
          }
          charsRef.current = next
          return next
        })
        const newIndex = cursorRef.current - 1
        setCursorIndex(newIndex)
        cursorRef.current = newIndex
        return
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        typeChar(e.key)
      }
    },
    [timerMode, finishTest, typeChar],
  )

  const liveStats: LiveStats = {
    wpm: calculateWpm(countCorrect(chars), elapsedMs || 0),
    accuracy: calculateAccuracy(countCorrect(chars), cursorIndex),
    timeSeconds: elapsedMs / 1000,
    errors,
  }

  const focusInput = useCallback(() => {
    if (testStateRef.current !== 'finished') {
      inputRef.current?.focus()
    }
  }, [])

  return {
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
  }
}
