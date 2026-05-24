# Constitución Frontend LTI ATS

## Principios Fundamentales

### I. Estructura y Mantenibilidad
Organizar por feature o capa: `components/`, `lib/`, `hooks/`, `types/`, `services/`; componentes de responsabilidad única — dividir si >150 líneas o >1 concepto; TypeScript obligatorio (v6+), sin `any`, tipos estrictos en todas las APIs públicas; custom hooks para lógica reutilizable, compound components, provider pattern; YAGNI — sin sobre-ingeniería.

### II. Calidad de Código
Biome v2 como linter/formateador por defecto (único `biome.json`), alternativa ESLint 9 flat config + Prettier; documentar el *por qué*, no el *qué*; JSDoc/TSDoc en funciones públicas; los docstrings son contexto para el copiloto IA — merece la pena invertir en ellos.

### III. Rendimiento
Objetivos Core Web Vitals: **LCP <2,5s, INP <200ms, CLS <0,1**; carga diferida de componentes pesados (`React.lazy`, `next/dynamic`); `fetchpriority="high"` + preload para la imagen LCP; imágenes en WebP/AVIF con `srcset` responsivo (sin sprites); Vite o Turbopack — sin minificación manual; ciclo de medición: PageSpeed Insights → Lighthouse → WebPageTest → RUM.

### IV. Seguridad (NO NEGOCIABLE)
Sanitizar HTML con DOMPurify; validar entradas con Zod/Valibot compartido entre front y back; nunca exponer secretos en el bundle del cliente (Next.js: solo variables `NEXT_PUBLIC_` son públicas); cabeceras obligatorias: CSP, SRI, HSTS, X-Frame-Options, Referrer-Policy; validar en cliente (UX) Y en servidor (seguridad) — siempre ambos; `dangerouslySetInnerHTML` solo con entrada sanitizada; ejecutar `npm audit`/Snyk en todas las dependencias; la ofuscación no es seguridad; nunca desplegar código generado por IA sin revisión explícita de seguridad.

### V. Accesibilidad y UX
WCAG 2.2 AA como mínimo (ley europea desde junio de 2025); HTML semántico antes que ARIA; contraste de texto ≥ 4,5:1; navegación completa por teclado; estados de foco visibles; `<label>` en inputs, `alt` en imágenes, landmarks (`<nav>`, `<main>`, `<aside>`); diseño mobile-first con container queries para adaptación a nivel de componente; loading skeletons, UI optimista, respetar `prefers-reduced-motion`; pruebas con axe-core + eslint-plugin-jsx-a11y + lector de pantalla manual (VoiceOver/NVDA).

## Stack por Defecto

| Área | Elección |
|---|---|
| Meta-framework | Next.js v16 (RSC + Turbopack) / Astro 6 (sitios de contenido) |
| Componentes | shadcn/ui (Radix + Tailwind, copiado en el repo) |
| Estilos | Tailwind CSS v4.1 (config CSS-first, container queries integradas) |
| Validación | Zod (compartido front+back) |
| i18n | next-intl (Next.js) / react-i18next |

Cada dependencia es deuda futura — elegir con criterio.

## Reglas para el Copiloto IA

- Solicitar siempre un plan antes de aplicar refactors: "muestra el plan primero, mantén el comportamiento idéntico"
- ~40–45% del código generado por IA sin revisar contiene vulnerabilidades; la revisión de seguridad es obligatoria antes de cualquier despliegue
- Pedir a la IA que explique las decisiones de seguridad: qué entra por params/body/headers, qué valida el servidor
- Ciclo de rendimiento: medir datos reales (PageSpeed) → priorizar con IA → aplicar → volver a medir
- Leer los esquemas de validación línea a línea — un `.optional()` de más puede abrir un bypass
- Para generadores de UI (v0, Lovable, Bolt): cuestionar la complejidad visual; la simplicidad gana en conversión y mantenimiento

## Gobernanza

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Toda implementación debe cumplir los Principios I–V antes del merge. El principio de seguridad (IV) es no negociable y no puede omitirse. Cualquier enmienda requiere justificación y actualización de este fichero. Consultar `docs/frontend-best-practices.md` como referencia extendida.

**Versión**: 1.0.0 | **Ratificada**: 2026-05-24 | **Última modificación**: 2026-05-24
