# Estructura de carpetas — ODS Typing

```
ods-typing/
├── docs/
│   ├── ESPECIFICACION.md      # Requisitos y diseño del MVP
│   ├── PLAN-IMPLEMENTACION.md # Plan por fases
│   └── ESTRUCTURA-CARPETAS.md # Este archivo
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Cabecera + navegación
│   │   ├── Modal.tsx          # Contenedor modal reutilizable
│   │   ├── ProfilePanel.tsx   # Perfil local editable
│   │   ├── StatsHistoryPanel.tsx # Historial y estadísticas
│   │   ├── KeyHeatmap.tsx     # Heatmap de teclas erróneas
│   │   ├── BadgesGrid.tsx     # Logros / badges
│   │   ├── SettingsMenu.tsx   # Sonidos y PWA
│   │   ├── ThemeToggle.tsx
│   │   ├── TimerSelector.tsx
│   │   ├── StatsBar.tsx
│   │   ├── TypingArea.tsx
│   │   └── ResultsPanel.tsx
│   ├── data/
│   │   ├── odsTexts.ts
│   │   ├── badges.ts          # Definición de logros
│   │   └── keyboardLayout.ts  # Layout QWERTY para heatmap
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useUserData.ts     # Perfil y settings
│   │   └── useTypingTest.ts
│   ├── storage/
│   │   └── userStore.ts       # Persistencia unificada
│   ├── types/
│   │   ├── index.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── typingMetrics.ts
│   │   ├── textGenerator.ts
│   │   ├── sounds.ts          # Web Audio API
│   │   └── progressStorage.ts # Compatibilidad legacy
│   ├── App.tsx                # Layout principal
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind + variables tema
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.app.json
```

## Responsabilidades por capa

| Capa | Responsabilidad |
|------|-----------------|
| `components/` | Solo UI y eventos; sin lógica de negocio compleja |
| `hooks/` | Estado del test, timers, efectos secundarios |
| `utils/` | Funciones puras, testeables |
| `data/` | Contenido estático ODS |
| `types/` | Contratos TypeScript compartidos |
