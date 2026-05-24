# Buenas Prácticas de Frontend — 2026

## Estructura y Mantenibilidad
- Organizar por feature o capa: `components/`, `lib/`, `hooks/`, `types/`, `services/`
- Componentes de responsabilidad única; dividir si >150 líneas o >1 concepto
- TypeScript obligatorio (v6+); sin `any`; tipos estrictos en todas las APIs públicas
- Patrones: custom hooks para lógica reutilizable, compound components, provider pattern; YAGNI

## Calidad de Código
- Linter: **Biome v2** (único `biome.json`, preferido) o ESLint 9 flat config + Prettier
- Documentar el *por qué*, no el *qué*; JSDoc/TSDoc en funciones públicas
- Los docstrings son contexto para el copiloto IA — merece la pena invertir en ellos

## Rendimiento
- Objetivos Core Web Vitals: **LCP <2,5s, INP <200ms, CLS <0,1**
- Carga diferida de componentes pesados (`React.lazy`, `next/dynamic`); `fetchpriority="high"` + preload para la imagen LCP
- Imágenes: WebP/AVIF + `srcset` responsivo; sin sprites (HTTP/2+ multiplexa)
- Bundler: Vite (por defecto) o Turbopack (Next.js v16); sin minificación manual
- Ciclo de medición: PageSpeed Insights → Lighthouse → WebPageTest → RUM (Vercel/Sentry)

## Seguridad
- Sanitizar HTML: **DOMPurify**; validar entradas: **Zod/Valibot** (esquemas compartidos front+back)
- Nunca exponer secretos en el bundle del cliente; Next.js: solo variables `NEXT_PUBLIC_` son públicas
- Cabeceras obligatorias: CSP, SRI, HSTS, X-Frame-Options, Referrer-Policy
- Validar en cliente (UX) Y en servidor (seguridad) — siempre ambos
- OWASP: `dangerouslySetInnerHTML` solo con entrada sanitizada; prevenir CSRF, clickjacking
- Ejecutar `npm audit`/Snyk en todas las dependencias; la ofuscación no es seguridad

## Accesibilidad (a11y)
- **WCAG 2.2 AA** como mínimo (ley europea desde junio de 2025)
- HTML semántico antes que ARIA; ARIA solo cuando no exista elemento nativo equivalente
- Contraste de texto ≥ 4,5:1; navegación completa por teclado; estados de foco visibles
- Obligatorio: `<label>` en inputs, `alt` en imágenes, landmarks (`<nav>`, `<main>`, `<aside>`)
- Pruebas: axe-core, eslint-plugin-jsx-a11y, Lighthouse; ~30% se detecta automáticamente — también probar con VoiceOver/NVDA

## UX
- Diseño mobile-first; usar **container queries** para adaptación a nivel de componente (baseline 2023+)
- Proporcionar loading skeletons, UI optimista, toasts no intrusivos (Sonner)
- Respetar `prefers-reduced-motion`

## Stack por Defecto (2026)
| Área | Elección |
|---|---|
| Meta-framework | Next.js v16 (RSC + Turbopack) / Astro 6 (sitios de contenido) |
| Componentes | shadcn/ui (Radix + Tailwind, copiado en el repo) |
| Estilos | Tailwind CSS v4.1 (config CSS-first, container queries integradas) |
| Validación | Zod (compartido front+back) |
| i18n | next-intl (Next.js) / react-i18next |

## Reglas para el Copiloto IA
- **Solicitar siempre un plan antes de aplicar refactors**: "muestra el plan primero, mantén el comportamiento idéntico"
- **Nunca desplegar código generado por IA sin revisión de seguridad** (~40–45% del output sin revisar tiene vulnerabilidades)
- Pedir a la IA que explique las decisiones de seguridad: qué entra por params/body/headers, qué valida el servidor
- Ciclo de rendimiento: medir datos reales (PageSpeed) → priorizar con IA → aplicar → volver a medir
- Leer los esquemas de validación línea a línea — un `.optional()` de más puede abrir un bypass
- Para generadores de UI (v0, Lovable, Bolt): cuestionar la complejidad visual; la simplicidad gana en conversión y mantenimiento
