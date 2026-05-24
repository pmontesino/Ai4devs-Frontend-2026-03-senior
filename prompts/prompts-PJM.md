# Registro de Prompts — PJM

## Buenas Prácticas de Desarrollo Frontend (2026)

### Estructura y Mantenibilidad
- Organizar por feature o capa: `components/`, `lib/`, `hooks/`, `types/`, `services/`
- Componentes de responsabilidad única; dividir si >150 líneas o >1 concepto
- TypeScript obligatorio (v6+); sin `any`; tipos estrictos en todas las APIs públicas
- Patrones: custom hooks para lógica reutilizable, compound components, provider pattern; YAGNI

### Calidad de Código
- Linter: **Biome v2** (único `biome.json`, preferido) o ESLint 9 flat config + Prettier
- Documentar el *por qué*, no el *qué*; JSDoc/TSDoc en funciones públicas
- Los docstrings son contexto para el copiloto IA — merece la pena invertir en ellos

### Rendimiento
- Objetivos Core Web Vitals: **LCP <2,5s, INP <200ms, CLS <0,1**
- Carga diferida de componentes pesados (`React.lazy`, `next/dynamic`); `fetchpriority="high"` + preload para la imagen LCP
- Imágenes: WebP/AVIF + `srcset` responsivo; sin sprites (HTTP/2+ multiplexa)
- Bundler: Vite (por defecto) o Turbopack (Next.js v16); sin minificación manual
- Ciclo de medición: PageSpeed Insights → Lighthouse → WebPageTest → RUM (Vercel/Sentry)

### Seguridad
- Sanitizar HTML: **DOMPurify**; validar entradas: **Zod/Valibot** (esquemas compartidos front+back)
- Nunca exponer secretos en el bundle del cliente; Next.js: solo variables `NEXT_PUBLIC_` son públicas
- Cabeceras obligatorias: CSP, SRI, HSTS, X-Frame-Options, Referrer-Policy
- Validar en cliente (UX) Y en servidor (seguridad) — siempre ambos
- OWASP: `dangerouslySetInnerHTML` solo con entrada sanitizada; prevenir CSRF, clickjacking
- Ejecutar `npm audit`/Snyk en todas las dependencias; la ofuscación no es seguridad

### Accesibilidad (a11y)
- **WCAG 2.2 AA** como mínimo (ley europea desde junio de 2025)
- HTML semántico antes que ARIA; ARIA solo cuando no exista elemento nativo equivalente
- Contraste de texto ≥ 4,5:1; navegación completa por teclado; estados de foco visibles
- Obligatorio: `<label>` en inputs, `alt` en imágenes, landmarks (`<nav>`, `<main>`, `<aside>`)
- Pruebas: axe-core, eslint-plugin-jsx-a11y, Lighthouse; ~30% automático — también probar con VoiceOver/NVDA

### UX
- Diseño mobile-first; usar **container queries** para adaptación a nivel de componente (baseline 2023+)
- Proporcionar loading skeletons, UI optimista, toasts no intrusivos (Sonner)
- Respetar `prefers-reduced-motion`

### Stack por Defecto (2026)
| Área | Elección |
|---|---|
| Meta-framework | Next.js v16 (RSC + Turbopack) / Astro 6 (sitios de contenido) |
| Componentes | shadcn/ui (Radix + Tailwind, copiado en el repo) |
| Estilos | Tailwind CSS v4.1 (config CSS-first, container queries integradas) |
| Validación | Zod (compartido front+back) |
| i18n | next-intl (Next.js) / react-i18next |

### Reglas para el Copiloto IA
- Solicitar siempre un plan antes de aplicar refactors: "muestra el plan primero, mantén el comportamiento idéntico"
- Nunca desplegar código generado por IA sin revisión de seguridad (~40–45% del output sin revisar tiene vulnerabilidades)
- Pedir a la IA que explique las decisiones de seguridad: qué entra por params/body/headers, qué valida el servidor
- Ciclo de rendimiento: medir datos reales (PageSpeed) → priorizar con IA → aplicar → volver a medir
- Leer los esquemas de validación línea a línea — un `.optional()` de más puede abrir un bypass
- Para generadores de UI (v0, Lovable, Bolt): cuestionar la complejidad visual; la simplicidad gana en conversión y mantenimiento

---

## 2026-05-24

1. Agrega docs a gitignore.
2. A partir de este documento, genera un markdown con instrucciones/directivas para un modelo Claude con las buenas prácticas de desarrollo de frontend. Hazlo de forma concisa y que reduzca al máximo lo que ocupa en la ventana de contexto pero que sea legible para la IA.
3. Agrega el contenido de las buenas prácticas al fichero constitution.md.
4. Vale, pero te saltaste una regla primordial del copilot-instructions de que la documentación tiene que ser en español.
5. Pasa todos los cambios actuales a una nueva rama sobre la que vamos a trabajar con el nombre frontend-PJM.
6. Según las reglas de copilot-instructions.md agrega cada prompt a partir del siguiente, en ese fichero.
7. Basado en las especificaciones definidas en el fichero, crea tantas especificaciones como casos de uso haya.
8. Antes de continuar documenta las buenas prácticas de frontend en el prompts-PJM.md y añade los prompts faltantes.
9. No veo las buenas prácticas agregadas al fichero de prompts.
10. Ahora sí vamos con el plan para la spec 001.
11. Divide el plan en tareas.
12. Ejecuta un análisis de consistencia del proyecto.
13. Implementa las tareas de la spec 001.
14. Crea el plan para la spec 002.
15. Divide el plan en tareas.
16. Ejecuta un análisis de consistencia del proyecto. Sí, aplica los cambios de remediación e incluye en el prompt los defectos encontrados y las soluciones aplicadas.

   **Defectos encontrados y soluciones aplicadas (spec 002):**

   | ID | Defecto | Severidad | Fichero | Solución aplicada |
   |---|---|---|---|---|
   | U1+U2 | Los casos límite "¿qué ocurre si falla la llamada a fases/candidatos?" permanecían como preguntas abiertas en `spec.md` | MEDIUM | `spec.md` → Suposiciones | Añadida suposición: `Promise.all` rechaza si cualquier llamada falla → se muestra error genérico (RF-010), sin recuperación parcial ni distinción de qué llamada falló |
   | U3 | El caso límite "¿qué ocurre si un candidato tiene una fase que no existe en el listado?" no estaba cerrado en la spec | MEDIUM | `spec.md` → Suposiciones | Añadida suposición: el candidato se excluye silenciosamente de todas las columnas; los datos del backend se asumen consistentes |
   | I1 | El `plan.md` prometía trazar la corrección del bug de URL como tarea, pero `tasks.md` no incluía ninguna entrada para ello | MEDIUM | `tasks.md` | Añadida `T000 [x]` (ya completada) en nueva Phase 0, con referencia al bug `/positions/` → `/position/` y al montaje del router en `index.ts` |

   **Hallazgos LOW no aplicados automáticamente** (requieren decisión de diseño del desarrollador): D1 (duplicación de ordenación por `orderIndex` en T004 y T006), A2 (`spec.md` dice "pantallas pequeñas" sin umbral numérico), A3 (nivel de encabezado `h2` o `h3` en T005), C1 (ausencia de skeleton específico del tablero Kanban durante la carga).

   Aplica las remediaciones y continúa.

   **Remediaciones LOW aplicadas:**

   | ID | Fichero | Cambio aplicado |
   |---|---|---|
   | D1 | `tasks.md` T004 | Eliminada la ordenación por `orderIndex` de `KanbanBoard`; se añade nota "ya ordenadas, ordenación aplicada en T006" — única fuente de ordenación |
   | D1 | `tasks.md` T006 | Añadida aclaración "única fuente de ordenación" al `setState` de éxito |
   | A2 | `spec.md` RF-008 | Sustituido "pantallas pequeñas" por "pantallas menores de 576px (breakpoint `sm` de Bootstrap), garantizando legibilidad desde 375px" |
   | A3 | `tasks.md` T005 | Sustituido "elemento `h2` o `h3`" por "elemento `h2`" con justificación explícita |
   | C1 | `tasks.md` T006 | Añadida instrucción: en estado `loading`, renderizar 3 columnas placeholder con Bootstrap `placeholder-glow` en lugar del spinner genérico heredado de spec 001 |

17. Implementa las tareas de spec 002.
18. Ahora crea el plan para la especificación 003.
19. Divide el plan en tareas.
20. Ejecuta un análisis de consistencia del proyecto. Sí, aplica los cambios de remediación e incluye en el prompt los defectos encontrados y las soluciones aplicadas. y soluciones aplicadas (spec 003):**

   | ID | Defecto | Severidad | Fichero | Solución aplicada |
   |---|---|---|---|---|
   | I1 | `KanbanColumnProps` no incluía `onDragStart: (candidate: PositionCandidate) => void`. Sin este prop el handler no podía fluir de `KanbanBoard` → `KanbanColumn` → `CandidateCard`, causando un error de compilación TypeScript | HIGH | `data-model.md` → KanbanColumnProps · `tasks.md` → T005 | Añadido `onDragStart: (candidate: PositionCandidate) => void` a `KanbanColumnProps` en `data-model.md`. Actualizada la descripción de T005 en `tasks.md` para incluir la prop y su paso a `CandidateCard`. |
   | U1 | El caso límite "¿qué ocurre si se intenta mover una tarjeta mientras hay otra actualización en curso?" permanecía abierto. US2 Aceptación 3 decía "la interacción no bloquea el tablero" sin definir la semántica de movimientos concurrentes | MEDIUM | `spec.md` → Suposiciones | Añadida suposición: múltiples arrastres simultáneos son permitidos; `pendingCandidateId` rastrea solo el último movimiento activo; el tablero no bloquea nuevos arrastres; si dos actualizaciones se solapan el estado final refleja la última llamada completada. |
   | A1 | RF-006 "mensaje de error comprensible para el usuario" sin texto concreto ni indicación de si es dismissible | LOW | `spec.md` → Suposiciones | Añadida suposición con texto exacto: "Error al actualizar la fase. Inténtalo de nuevo." (404 → "Candidato no encontrado"); Alert Bootstrap dismissible; sin detalles técnicos expuestos. |
   | U2 | T006 mencionaba "limpiar `draggingCandidate` al terminar el drag" sin especificar el mecanismo. Sin un handler `onDragEnd` explícito, el estado permanece no-null si el usuario cancela el arrastre fuera de cualquier columna | LOW | `tasks.md` → T006 | Actualizada la descripción de T006 para especificar que la limpieza se realiza mediante un handler `onDragEnd` en cada `CandidateCard` que llama `setDraggingCandidate(null)`. |
   | C1 | CE-001 (<5s) y CE-004 (<3s) son criterios de rendimiento medibles sin ninguna tarea de medición asociada | LOW | `spec.md` → Suposiciones | Añadida suposición: la actualización optimista garantiza CE-001 y CE-004 implícitamente; sin tarea de medición de performance en esta iteración; registrado como deuda técnica para CI de performance. |

21. Ahora implementa las tareas de la spec 003.
22. ¿Están cubiertas todas las especificaciones?

   **Resultado:** Sí. Las tres especificaciones están cubiertas al 100 %:

   | Spec | Tareas | Estado |
   |---|---|---|
   | 001 — Navegación detalle posición | T001–T009 | ✅ Todas completadas |
   | 002 — Tablero Kanban candidatos | T000–T010 | ✅ Todas completadas |
   | 003 — Mover candidato de fase | T001–T009 | ✅ Todas completadas |
