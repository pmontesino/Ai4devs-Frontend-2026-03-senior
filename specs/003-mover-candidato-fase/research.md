# Research: Mover Candidato Entre Fases

**Feature**: 003-mover-candidato-fase | **Fecha**: 2026-05-24

## Decisión 1 — Contrato real del endpoint PUT (CRÍTICO)

**Hallazgo**: Verificado en `backend/src/presentation/controllers/candidateController.ts` y `backend/src/application/services/positionService.ts`.

**Endpoint**: `PUT /candidates/:id`
- `:id` = `candidate.id` (ID numérico del candidato)
- Body: `{ applicationId: number, currentInterviewStep: number }` — donde `currentInterviewStep` es el **ID numérico del InterviewStep**, NO su nombre

**Fuente de los IDs**:
- `candidate.id` y `candidate.applicationId` → devueltos por `GET /position/:id/candidates` (ya en el backend)
- `InterviewStep.id` → devuelto por `GET /position/:id/interviewflow` (ya en el frontend)

**Impacto**: El tipo `PositionCandidate` (spec 002) debe extenderse con `id: number` y `applicationId: number`.

---

## Decisión 2 — Campos faltantes en PositionCandidate

**Problema**: El backend devuelve `{ fullName, currentInterviewStep, averageScore, id, applicationId }` pero el tipo `PositionCandidate` en `kanban.ts` solo tipifica los tres primeros campos.

**Decisión**: Añadir `id: number` y `applicationId: number` a `PositionCandidate`. Estos campos ya están disponibles en la respuesta de la API sin cambios en el backend.

**Alternativas descartadas**: Crear un tipo separado `MoveableCandidate` — descartado por YAGNI; un único tipo cohesionado es más mantenible.

---

## Decisión 3 — Tecnología de Drag and Drop

**Opciones evaluadas**:

| Opción | Pros | Contras |
|---|---|---|
| **HTML5 DnD API (nativa)** | Sin nuevas dependencias; soportada universalmente; implementación directa en React | Sin soporte de teclado (gap de accesibilidad); comportamiento inconsistente en móvil |
| `@dnd-kit/core` | Accesibilidad completa (teclado + touch); más control sobre el comportamiento | Nueva dependencia (~20kb gzip); superficie de API mayor |
| `react-beautiful-dnd` | Accesible, bien conocido | Deprecado en favor de @dnd-kit |

**Decisión**: **HTML5 Drag and Drop API nativa**

**Razonamiento**: La spec exige arrastrar (RF-001) sin definir alternativa de teclado. Añadir una dependencia para un feature de prototipo sería sobre-ingeniería. El gap de accesibilidad de teclado se documenta como deuda técnica (ver Constitución gate V).

**Deuda técnica registrada**: DnD sin teclado — recomendado migrar a `@dnd-kit/core` si el producto requiere cumplimiento estricto de WCAG 2.2 AA para esta interacción.

---

## Decisión 4 — Patrón de actualización optimista

**Decisión**: Actualización optimista con rollback en `PositionDetail`.

**Flujo**:
1. Usuario suelta tarjeta en columna destino
2. `setState` inmediato: mover candidato a nueva columna (actualización optimista)
3. `setPendingCandidateId(candidate.id)` — indicador visual en la tarjeta
4. Llamar `PUT /candidates/:id`
5. **Éxito**: `setPendingCandidateId(null)` — estado ya correcto
6. **Error**: revertir `setState` al array `prevCandidates` capturado antes del paso 2 + mostrar `moveError`

**Almacenamiento de `prevCandidates`**: captura local en la función handler en el momento del drop, no en closure.

**Alternativas descartadas**: `useReducer` — excesivo para este caso de uso; `React Query` — nueva dependencia.

---

## Decisión 5 — Gestión del estado de drag

**Decisión**: `draggingCandidate: PositionCandidate | null` gestionado en `KanbanBoard`.

**Razonamiento**: El estado de drag es efímero y solo necesario durante el evento. `KanbanBoard` coordina los eventos entre columnas; `PositionDetail` no necesita saber qué candidato se está arrastrando.

**Flujo de eventos**:
- `CandidateCard.onDragStart` → llama `onDragStart(candidate)` → `KanbanBoard` setea `draggingCandidate`
- `KanbanColumn.onDragEnd` / `document.onDragEnd` → `KanbanBoard` setea `draggingCandidate = null`
- `KanbanColumn.onDrop` → llama `onMoveCandidate(draggingCandidate, step)` si el candidato existe y la columna es distinta

---

## Decisión 6 — Feedback visual de "arrastrando sobre columna" (RF-007)

**Decisión**: `isDragOver: boolean` gestionado con `useState` localmente en cada `KanbanColumn`.

**Razonamiento**: Estado puramente local de UI; no necesita subir al árbol de componentes.

**Implementación**: `onDragOver` → `e.preventDefault()` + `setIsDragOver(true)`; `onDragLeave` → `setIsDragOver(false)`; `onDrop` → `setIsDragOver(false)` + llamar handler.

**CSS**: Clase `.kanban-column--drag-over` en `KanbanBoard.css` con `background-color` y `border` destacados.

---

## Decisión 7 — Indicador de estado pendiente (RF-003)

**Decisión**: `pendingCandidateId: number | null` en `PositionDetail`, propagado hasta `CandidateCard` como `isPending: boolean`.

**Implementación en CandidateCard**: cuando `isPending`, reducir opacidad (`opacity: 0.6`) y añadir un spinner Bootstrap pequeño junto al nombre. Añadir `aria-busy="true"` al elemento raíz.
