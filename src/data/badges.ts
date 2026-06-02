import type { SessionSavePayload, UserData } from '../types/user'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_step',
    name: 'Primer paso',
    description: 'Completa tu primera sesión',
    icon: '🌱',
  },
  {
    id: 'dedicated_10',
    name: 'Constante',
    description: 'Completa 10 sesiones',
    icon: '📚',
  },
  {
    id: 'dedicated_50',
    name: 'Veterano ODS',
    description: 'Completa 50 sesiones',
    icon: '🏆',
  },
  {
    id: 'speed_40',
    name: 'Veloz',
    description: 'Alcanza 40 WPM en una sesión',
    icon: '⚡',
  },
  {
    id: 'speed_60',
    name: 'Rápido como el viento',
    description: 'Alcanza 60 WPM en una sesión',
    icon: '💨',
  },
  {
    id: 'speed_80',
    name: 'Máquina de escribir',
    description: 'Alcanza 80 WPM en una sesión',
    icon: '🚀',
  },
  {
    id: 'accuracy_95',
    name: 'Precisión ODS',
    description: 'Termina con 95% de precisión o más',
    icon: '🎯',
  },
  {
    id: 'accuracy_100',
    name: 'Perfección',
    description: 'Termina con 100% de precisión',
    icon: '💎',
  },
  {
    id: 'flawless',
    name: 'Sin errores',
    description: 'Completa una sesión sin errores',
    icon: '✨',
  },
  {
    id: 'marathon',
    name: 'Maratón',
    description: 'Escribe más de 500 caracteres en una sesión',
    icon: '🏃',
  },
  {
    id: 'night_owl',
    name: 'Búho nocturno',
    description: 'Practica después de las 22:00',
    icon: '🦉',
  },
  {
    id: 'record_breaker',
    name: 'Récord personal',
    description: 'Supera tu mejor WPM en cualquier modo',
    icon: '🔥',
  },
]

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.id === id)
}

export function evaluateNewBadges(
  data: UserData,
  session: SessionSavePayload,
  isNewRecord: boolean,
): string[] {
  const unlocked = new Set(data.unlockedBadges)
  const newBadges: string[] = []

  const tryUnlock = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      newBadges.push(id)
      unlocked.add(id)
    }
  }

  const sessions = data.progress.sessionsCompleted + 1
  const hour = new Date().getHours()

  tryUnlock('first_step', sessions >= 1)
  tryUnlock('dedicated_10', sessions >= 10)
  tryUnlock('dedicated_50', sessions >= 50)
  tryUnlock('speed_40', session.wpm >= 40)
  tryUnlock('speed_60', session.wpm >= 60)
  tryUnlock('speed_80', session.wpm >= 80)
  tryUnlock('accuracy_95', session.accuracy >= 95 && session.typedChars >= 20)
  tryUnlock('accuracy_100', session.accuracy === 100 && session.typedChars >= 20)
  tryUnlock('flawless', session.errors === 0 && session.typedChars >= 30)
  tryUnlock('marathon', session.correctChars >= 500)
  tryUnlock('night_owl', hour >= 22 || hour < 5)
  tryUnlock('record_breaker', isNewRecord && session.wpm > 0)

  return newBadges
}
