import { BADGES, getBadgeById } from '../data/badges'

interface BadgesGridProps {
  unlockedIds: string[]
  highlightIds?: string[]
  compact?: boolean
}

export function BadgesGrid({
  unlockedIds,
  highlightIds = [],
  compact,
}: BadgesGridProps) {
  const unlocked = new Set(unlockedIds)
  const highlight = new Set(highlightIds)

  return (
    <div
      className={`grid gap-2 ${compact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}
    >
      {BADGES.map((badge) => {
        const isUnlocked = unlocked.has(badge.id)
        const isNew = highlight.has(badge.id)

        return (
          <div
            key={badge.id}
            title={`${badge.name}: ${badge.description}`}
            className={`animate-fade-in rounded-lg border p-3 transition-all duration-300 ${
              isUnlocked
                ? 'border-accent/30 bg-accent/5 dark:border-accent-dark/30 dark:bg-accent-dark/10'
                : 'border-black/5 bg-black/[0.02] opacity-50 grayscale dark:border-white/5 dark:bg-white/[0.02]'
            } ${isNew ? 'ring-2 ring-caret animate-badge-pop' : ''}`}
          >
            <span className="text-2xl" role="img" aria-hidden>
              {badge.icon}
            </span>
            <p className="mt-1 text-xs font-medium text-text dark:text-text-dark">
              {badge.name}
            </p>
            {!compact && (
              <p className="mt-0.5 text-[10px] leading-tight text-muted">
                {badge.description}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function NewBadgesToast({ badgeIds }: { badgeIds: string[] }) {
  if (badgeIds.length === 0) return null

  return (
    <div className="animate-slide-up mb-4 rounded-lg border border-caret/40 bg-caret/10 p-3 dark:bg-caret/5">
      <p className="text-xs font-medium uppercase tracking-widest text-caret">
        ¡Logro desbloqueado!
      </p>
      <ul className="mt-2 space-y-1">
        {badgeIds.map((id) => {
          const badge = getBadgeById(id)
          if (!badge) return null
          return (
            <li key={id} className="flex items-center gap-2 text-sm text-text dark:text-text-dark">
              <span>{badge.icon}</span>
              <span>{badge.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
