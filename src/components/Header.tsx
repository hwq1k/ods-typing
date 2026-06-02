import { ThemeToggle } from './ThemeToggle'
import type { Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-6 sm:px-8">
      <div className="text-left">
        <h1 className="text-xl font-semibold tracking-tight text-text dark:text-accent-dark sm:text-2xl">
          ODS <span className="text-accent dark:text-accent-dark">Typing</span>
        </h1>
        <p className="mt-0.5 text-xs text-muted sm:text-sm">
          Mecanografía y Objetivos de Desarrollo Sostenible
        </p>
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}
