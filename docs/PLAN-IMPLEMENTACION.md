# ODS Typing — Plan de implementación

> **Objetivo:** Entregar el MVP funcional con test de mecanografía, métricas ODS, temas y progreso local.

**Arquitectura:** Componentes React presentacionales + hook `useTypingTest` con toda la lógica de estado. Utilidades puras para métricas. Datos estáticos de textos ODS. Tema vía clase `dark` en `<html>`.

**Tech stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4.

---

## Fase 1: Fundamentos (≈15 min)

- [x] **1.1** Configurar `@tailwindcss/vite` en `vite.config.ts`
- [x] **1.2** Reemplazar `index.css` con `@import "tailwindcss"` y variables de tema
- [x] **1.3** Añadir fuentes Google (Outfit, JetBrains Mono) en `index.html`
- [x] **1.4** Definir tipos en `src/types/index.ts`

## Fase 2: Datos y utilidades (≈20 min)

- [x] **2.1** Crear `src/data/odsTexts.ts` — 17 fragmentos ODS en español
- [x] **2.2** Crear `src/utils/typingMetrics.ts` — WPM, accuracy, formateo tiempo
- [x] **2.3** Crear `src/utils/textGenerator.ts` — selección y concatenación de textos
- [x] **2.4** Crear `src/utils/progressStorage.ts` — lectura/escritura localStorage

## Fase 3: Hooks (≈25 min)

- [x] **3.1** `useTheme` — toggle, persistencia, clase dark
- [x] **3.2** `useTypingTest` — máquina de estados idle/active/finished, input, timer, métricas

## Fase 4: Componentes UI (≈40 min)

- [x] **4.1** `Header` — logo, ThemeToggle
- [x] **4.2** `TimerSelector` — botones 15/30/60/∞
- [x] **4.3** `StatsBar` — WPM, accuracy, tiempo, errores
- [x] **4.4** `TypingArea` — renderizado de caracteres + input oculto
- [x] **4.5** `ResultsPanel` — modal resultados, récord, repetir
- [x] **4.6** `ThemeToggle` — icono sol/luna

## Fase 5: Integración (≈15 min)

- [x] **5.1** `App.tsx` — composición de layout
- [x] **5.2** Eliminar plantilla Vite (`App.css`, assets no usados)
- [x] **5.3** Actualizar `index.html` (título, meta, lang)

## Fase 6: Verificación

- [x] **6.1** `npm run build` sin errores TypeScript
- [x] **6.2** Prueba manual: test 15s, tema, responsive, repetir

---

## Orden de dependencias

```
types → data/utils → hooks → components → App
```

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # vista previa build
```
