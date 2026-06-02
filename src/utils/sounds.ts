type SoundType = 'key' | 'error' | 'complete' | 'badge'

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
) {
  const ctx = getContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.value = volume
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

export function playSound(type: SoundType, enabled: boolean) {
  if (!enabled) return

  switch (type) {
    case 'key':
      playTone(420, 0.04, 'sine', 0.04)
      break
    case 'error':
      playTone(180, 0.1, 'square', 0.06)
      break
    case 'complete':
      playTone(523, 0.12, 'sine', 0.07)
      setTimeout(() => playTone(659, 0.15, 'sine', 0.07), 80)
      setTimeout(() => playTone(784, 0.2, 'sine', 0.06), 160)
      break
    case 'badge':
      playTone(880, 0.1, 'triangle', 0.08)
      setTimeout(() => playTone(1047, 0.15, 'triangle', 0.07), 100)
      break
  }
}

export function resumeAudioContext() {
  const ctx = getContext()
  if (ctx?.state === 'suspended') {
    void ctx.resume()
  }
}
