interface SettingsMenuProps {
  soundsEnabled: boolean
  onToggleSounds: () => void
}

export function SettingsMenu({
  soundsEnabled,
  onToggleSounds,
}: SettingsMenuProps) {
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-bg p-4 dark:bg-bg-dark">
        <div>
          <span className="text-sm font-medium text-text dark:text-text-dark">
            Sonidos
          </span>
          <p className="mt-0.5 text-xs text-muted">
            Teclas, errores y logros desbloqueados
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={soundsEnabled}
          onClick={onToggleSounds}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
            soundsEnabled ? 'bg-accent dark:bg-accent-dark' : 'bg-black/15 dark:bg-white/15'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ${
              soundsEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      <p className="text-center text-[10px] text-muted">
        Instala la app desde el menú del navegador para usarla sin conexión.
      </p>
    </div>
  )
}
