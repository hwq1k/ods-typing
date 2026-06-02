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
│   │   ├── Header.tsx         # Cabecera + toggle tema
│   │   ├── ThemeToggle.tsx    # Botón claro/oscuro
│   │   ├── TimerSelector.tsx  # 15s | 30s | 60s | ∞
│   │   ├── StatsBar.tsx       # Métricas en vivo
│   │   ├── TypingArea.tsx     # Texto + input oculto
│   │   └── ResultsPanel.tsx   # Modal de resultados
│   ├── data/
│   │   └── odsTexts.ts        # Fragmentos por ODS (1-17)
│   ├── hooks/
│   │   ├── useTheme.ts        # Tema + localStorage
│   │   └── useTypingTest.ts   # Lógica del test
│   ├── types/
│   │   └── index.ts           # TimerMode, TestState, etc.
│   ├── utils/
│   │   ├── typingMetrics.ts   # Cálculo WPM, accuracy
│   │   ├── textGenerator.ts   # Texto aleatorio ODS
│   │   └── progressStorage.ts # Récords locales
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
