import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type {
  CharState,
  LiveStats,
  SessionResult,
  TestState,
  TimerMode,
} from '../types'
import type { OdsSnippet } from '../data/odsTexts'
import { charToKeyId } from '../data/keyboardLayout'
import {
  applyBackspace,
  applyCharacter,
  countCorrectChars,
  type TypingEngineState,
} from '../engine/typingEngine'
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
import { getBestWpm, saveSession } from '../storage/userStore'
import { playSound } from '../utils/sounds'

function createInitialState(timerMode: TimerMode) {
  const { text, snippet } = buildInitialText()
  return {
    engine: {
      chars: initCharStates(text),
      cursorIndex: 0,
      errors: 0,
    },
    snippet,
    lastGoal: snippet.goal,
    countdown: getTimerSeconds(timerMode),
    bestWpm: getBestWpm(timerMode),
  }
}

type EngineAction =
  | { type: 'SYNC'; state: TypingEngineState }
  | { type: 'RESET'; chars: CharState[] }

function engineReducer(
  state: TypingEngineState,
  action: EngineAction,
): TypingEngineState {
  switch (action.type) {
    case 'SYNC':
      return action.state
    case 'RESET':
      return { chars: action.chars, cursorIndex: 0, errors: 0 }
    default:
      return state
  }
}

interface UseTypingTestOptions {
  soundsEnabled: boolean
  onSessionSaved?: () => void
}

export function useTypingTest(
  timerMode: TimerMode,
  { soundsEnabled, onSessionSaved }: UseTypingTestOptions,
) {
  const initial = createInitialState(timerMode)

  const [engine, dispatchEngine] = useReducer(engineReducer, initial.engine)
  const { chars, cursorIndex, errors } = engine

  const [testState, setTestState] = useState<TestState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(initial.countdown)
  const [snippet, setSnippet] = useState<OdsSnippet | null>(initial.snippet)
  const [result, setResult] = useState<SessionResult | null>(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [bestWpm, setBestWpm] = useState(initial.bestWpm)
  const [newBadges, setNewBadges] = useState<string[]>([])
  const [sessionKeyErrors, setSessionKeyErrors] = useState<Record<string, number>>(
    {},
  )

  const startTimeRef = useRef<number | null>(null)
  const lastGoalRef = useRef(initial.lastGoal)
  const inputRef = useRef<HTMLInputElement>(null)
  const testStateRef = useRef(testState)
  const sessionKeyErrorsRef = useRef<Record<string, number>>({})
  const soundsEnabledRef = useRef(soundsEnabled)

  useEffect(() => {
    testStateRef.current = testState
    soundsEnabledRef.current = soundsEnabled
  }, [testState, soundsEnabled])

  const recordKeyError = useCallback((char: string, physicalKey: string) => {
    const keyId = charToKeyId(char, physicalKey)
    const current = sessionKeyErrorsRef.current
    current[keyId] = (current[keyId] ?? 0) + 1
    sessionKeyErrorsRef.current = current
    setSessionKeyErrors({ ...current })
  }, [])

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

  const resetTest = useCallback(() => {
    const { text, snippet: s } = buildInitialText()
    dispatchEngine({ type: 'RESET', chars: initCharStates(text) })
    setElapsedMs(0)
    setCountdown(getTimerSeconds(timerMode))
    setSnippet(s)
    setTestState('idle')
    setResult(null)
    setIsNewRecord(false)
    setNewBadges([])
    setSessionKeyErrors({})
    setBestWpm(getBestWpm(timerMode))
    startTimeRef.current = null
    lastGoalRef.current = s.goal
    testStateRef.current = 'idle'
    sessionKeyErrorsRef.current = {}
  }, [timerMode])

  const finishTest = useCallback(() => {
    const correctChars = countCorrectChars(chars)
    const typedChars = cursorIndex
    const elapsed = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0

    const wpm = calculateWpm(correctChars, elapsed || 1)
    const accuracy = calculateAccuracy(correctChars, typedChars)
    const timeSeconds = elapsed / 1000

    const session: SessionResult = {
      wpm,
      accuracy,
      timeSeconds,
      errors,
      correctChars,
      typedChars,
    }

    const { isNewRecord: newRec, newBadges: badges } = saveSession({
      ...session,
      timerMode,
      sessionKeyErrors: { ...sessionKeyErrorsRef.current },
    })

    setBestWpm(getBestWpm(timerMode))
    setIsNewRecord(newRec)
    setNewBadges(badges)
    setResult(session)
    setTestState('finished')
    testStateRef.current = 'finished'

    playSound('complete', soundsEnabledRef.current)
    if (badges.length > 0) {
      setTimeout(() => playSound('badge', soundsEnabledRef.current), 300)
    }

    onSessionSaved?.()
  }, [chars, cursorIndex, errors, timerMode, onSessionSaved])

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

  const startIfNeeded = useCallback(() => {
    if (testStateRef.current === 'idle') {
      setTestState('active')
      testStateRef.current = 'active'
      startTimeRef.current = Date.now()
    }
  }, [])

  const typeChar = useCallback(
    (inputChar: string, physicalKey: string) => {
      if (testStateRef.current === 'finished') return
      startIfNeeded()

      let workingChars = chars
      if (cursorIndex >= workingChars.length) {
        workingChars = extendTextIfNeeded(cursorIndex, workingChars)
      }

      const result = applyCharacter(
        { chars: workingChars, cursorIndex, errors },
        inputChar,
      )
      if (!result) return

      let nextChars = result.state.chars
      if (result.state.cursorIndex >= nextChars.length - 20) {
        nextChars = extendTextIfNeeded(result.state.cursorIndex, nextChars)
      }

      if (result.isCorrect) {
        playSound('key', soundsEnabledRef.current)
      } else {
        recordKeyError(inputChar, physicalKey)
        playSound('error', soundsEnabledRef.current)
      }

      dispatchEngine({
        type: 'SYNC',
        state: { ...result.state, chars: nextChars },
      })
    },
    [chars, cursorIndex, errors, extendTextIfNeeded, startIfNeeded, recordKeyError],
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
        if (cursorIndex === 0) return
        if (testStateRef.current === 'idle') return

        dispatchEngine({
          type: 'SYNC',
          state: applyBackspace({ chars, cursorIndex, errors }),
        })
        return
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        typeChar(e.key, e.code || e.key)
      }
    },
    [timerMode, finishTest, typeChar, chars, cursorIndex, errors],
  )

  const liveStats: LiveStats = {
    wpm: calculateWpm(countCorrectChars(chars), elapsedMs || 0),
    accuracy: calculateAccuracy(countCorrectChars(chars), cursorIndex),
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
    newBadges,
    sessionKeyErrors,
    inputRef,
    resetTest,
    finishTest,
    handleKeyDown,
    focusInput,
  }
}
