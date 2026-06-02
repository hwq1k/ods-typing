import { useState } from 'react'
import type { UserData } from '../types/user'
import { getHistoryStats } from '../storage/userStore'
import { BadgesGrid } from './BadgesGrid'
import { KeyHeatmap } from './KeyHeatmap'

interface ProfilePanelProps {
  data: UserData
  onSaveName: (name: string) => void
}

export function ProfilePanel({ data, onSaveName }: ProfilePanelProps) {
  const [name, setName] = useState(data.profile.displayName)
  const stats = getHistoryStats(data)
  const joined = new Date(data.profile.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim() || 'Estudiante ODS'
    onSaveName(trimmed)
    setName(trimmed)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
          style={{
            backgroundColor: `hsl(${data.profile.avatarHue}, 45%, 42%)`,
          }}
        >
          {data.profile.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              className="flex-1 rounded-lg border border-black/10 bg-bg px-3 py-1.5 text-sm text-text outline-none focus:border-accent dark:border-white/10 dark:bg-bg-dark dark:text-text-dark"
              aria-label="Nombre de perfil"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white dark:bg-accent-dark dark:text-bg-dark"
            >
              Guardar
            </button>
          </form>
          <p className="mt-1 text-xs text-muted">Miembro desde {joined}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 rounded-lg bg-bg p-4 dark:bg-bg-dark">
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-muted">Sesiones</dt>
          <dd className="font-mono text-xl text-text dark:text-text-dark">
            {stats.totalSessions}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-muted">WPM medio</dt>
          <dd className="font-mono text-xl text-text dark:text-text-dark">
            {stats.averageWpm}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-muted">Mejor WPM</dt>
          <dd className="font-mono text-xl text-caret">{stats.bestWpmOverall}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-muted">Logros</dt>
          <dd className="font-mono text-xl text-text dark:text-text-dark">
            {data.unlockedBadges.length}/{12}
          </dd>
        </div>
      </dl>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
          Logros
        </h3>
        <BadgesGrid unlockedIds={data.unlockedBadges} compact />
      </div>

      <KeyHeatmap
        keyErrors={data.keyErrors}
        title="Heatmap global de teclas erróneas"
      />
    </div>
  )
}
