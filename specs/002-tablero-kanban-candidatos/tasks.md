# Tasks: Tablero Kanban de Candidatos

**Input**: Documentos de diseño en `specs/002-tablero-kanban-candidatos/`
**Rama**: `frontend-PJM` | **Fecha**: 2026-05-24
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Paralelizable (ficheros distintos, sin dependencias incompletas)
- **[Story]**: Historia de usuario a la que pertenece la tarea (US1, US2, US3)
- Rutas de fichero explícitas en todas las descripciones

---

## Phase 0: Corrección de deuda técnica (ya completada)

**Propósito**: Corrección del bug de URL detectado durante la fase de plan de esta spec y documentado en `plan.md`.

- [x] T000 [P] Corregir URL en `frontend/src/services/positionService.ts`: cambiar `/positions/${id}/interviewFlow` por `/position/${id}/interviewflow` (singular, todo en minúsculas) para coincidir con la ruta del backend (`app.use('/position', positionRoutes)`). *Corrección aplicada durante la fase de planificación de esta spec.*

---

## Phase 1: Configuración (Infraestructura compartida)

**Propósito**: No se requiere nueva configuración — React Bootstrap y React Router ya están instalados y configurados desde spec 001.

*(Sin tareas — checkpoint inmediato)*

---

## Phase 2: Fundamentos (Prerequisitos bloqueantes)

**Propósito**: Tipos e infraestructura de servicio que DEBEN existir antes de cualquier historia de usuario.

**⚠️ CRÍTICO**: No se puede empezar ninguna historia hasta completar esta fase.

- [x] T001 Crear `frontend/src/types/kanban.ts` con los tipos `PositionCandidate` y `KanbanBoardState` (importa `InterviewStep` de `../types/position`)
- [x] T002 [P] Actualizar `PositionDetailState` en `frontend/src/types/position.ts`: añadir `interviewSteps: InterviewStep[]` y `candidates: PositionCandidate[]` a la variante `success` (importar `PositionCandidate` desde `../types/kanban`)
- [x] T003 [P] Añadir la función `getPositionCandidates(id: number): Promise<PositionCandidate[]>` a `frontend/src/services/positionService.ts` con JSDoc, llamada a `GET /position/:id/candidates` y gestión de errores 404/500

**Checkpoint**: Tipos e infraestructura de servicio listos. Las historias de usuario 1 y 2 pueden implementarse en paralelo.

---

## Phase 3: Historia de Usuario 1 — Columnas del tablero (Prioridad: P1) 🎯 MVP

**Objetivo**: El reclutador ve el tablero Kanban con una columna por fase, ordenadas según el proceso de contratación.

**Prueba independiente**: Acceder a `/positions/:id` y verificar que el número de columnas coincide con el número de fases del proceso; las columnas muestran los nombres de las fases en el orden correcto.

### Implementación — Historia de Usuario 1

- [x] T004 [P] [US1] Crear `frontend/src/components/KanbanBoard.tsx`: recibe `interviewSteps: InterviewStep[]` (ya ordenadas por `orderIndex`, ordenación aplicada en T006) y `candidates: PositionCandidate[]` como props; renderiza un `KanbanColumn` por paso; contenedor con `d-flex overflow-auto pb-3` para scroll horizontal
- [x] T005 [P] [US1] Crear `frontend/src/components/KanbanColumn.tsx`: recibe `step: InterviewStep` y `candidates: PositionCandidate[]` como props; renderiza la cabecera con `step.name` (elemento `h2`, ya que `PositionDetail` usa `h1` para el título de la posición), `role="list"` en el contenedor de tarjetas y `aria-label={step.name}` en la sección; columna con `min-width: 250px; width: 280px`
- [x] T006 [US1] Actualizar `frontend/src/components/PositionDetail.tsx`: reemplazar el `useEffect` simple por `Promise.all([getPositionInterviewFlow(id), getPositionCandidates(id)])`; actualizar el `setState` de éxito para incluir `interviewSteps` (ordenadas por `orderIndex` — única fuente de ordenación) y `candidates`; renderizar `<KanbanBoard>` bajo el título `<h1>` cuando el estado es `success`; en estado `loading`, renderizar 3 columnas placeholder con clases Bootstrap `placeholder-glow` en lugar del spinner genérico heredado de spec 001

**Checkpoint**: La Historia de Usuario 1 es completamente funcional — el tablero muestra columnas con los nombres de las fases en el orden correcto.

---

## Phase 4: Historia de Usuario 2 — Tarjetas de candidatos (Prioridad: P1)

**Objetivo**: Cada candidato aparece como tarjeta en la columna correcta, mostrando nombre completo y puntuación media.

**Prueba independiente**: Con candidatos en distintas fases, cada tarjeta aparece en la columna cuyo nombre coincide con `currentInterviewStep` del candidato; la tarjeta muestra `fullName` y `averageScore` (incluyendo cuando `averageScore` es 0).

### Implementación — Historia de Usuario 2

- [x] T007 [P] [US2] Crear `frontend/src/components/CandidateCard.tsx`: recibe `candidate: PositionCandidate` como prop; muestra `fullName` y `averageScore` (mostrar `0` si es 0, nunca omitir); `role="listitem"` en el elemento raíz; estilos Bootstrap `card shadow-sm mb-2`
- [x] T008 [US2] Actualizar `frontend/src/components/KanbanColumn.tsx`: filtrar los candidatos recibidos por `candidate.currentInterviewStep === step.name`; renderizar `<CandidateCard>` por cada candidato filtrado; si no hay candidatos, mostrar un placeholder visual con texto "Sin candidatos"

**Checkpoint**: Las Historias de Usuario 1 y 2 funcionan de forma independiente — tablero con columnas y tarjetas correctamente distribuidas.

---

## Phase 5: Historia de Usuario 3 — Responsive mobile (Prioridad: P2)

**Objetivo**: En pantallas ≤576px las columnas se apilan verticalmente a ancho completo, con texto legible sin zoom.

**Prueba independiente**: Abrir el tablero en Chrome DevTools a 375px de ancho y verificar que las columnas se apilan verticalmente y son legibles.

### Implementación — Historia de Usuario 3

- [x] T009 [US3] Crear `frontend/src/components/KanbanBoard.css` e importarlo en `KanbanBoard.tsx`: añadir media query `@media (max-width: 576px)` que cambia el contenedor a `flex-direction: column; overflow-x: hidden` y las columnas a `width: 100%; min-width: unset`

**Checkpoint**: El tablero es completamente utilizable en pantallas de 375px o superior (CE-003).

---

## Phase 6: Acabado y calidad transversal

**Propósito**: Verificación de calidad que afecta a todos los ficheros modificados.

- [x] T010 [P] Verificar que no hay errores de TypeScript en todos los ficheros modificados/creados: `frontend/src/types/kanban.ts`, `frontend/src/types/position.ts`, `frontend/src/services/positionService.ts`, `frontend/src/components/PositionDetail.tsx`, `frontend/src/components/KanbanBoard.tsx`, `frontend/src/components/KanbanColumn.tsx`, `frontend/src/components/CandidateCard.tsx`

---

## Dependencias entre historias

```text
T001 (kanban.ts — tipos base)
├── T002 [P] (position.ts — PositionDetailState extendido)
│     └── T006 (PositionDetail — fetch paralelo + KanbanBoard)
├── T003 [P] (positionService — getPositionCandidates)
│     └── T006
├── T004 [P] [US1] (KanbanBoard.tsx — layout columnas)
│     ├── T006
│     └── T009 [US3] (KanbanBoard.css — responsive)
├── T005 [P] [US1] (KanbanColumn.tsx — header + contenedor)
│     ├── T006
│     └── T008 [US2] (KanbanColumn — renderizar CandidateCard)
└── T007 [P] [US2] (CandidateCard.tsx)
      └── T008

T010 (TypeScript check — al final de todas las rutas)
```

## Ejecución en paralelo — tras T001

Una vez completado T001 (kanban.ts), las siguientes tareas pueden ejecutarse todas en paralelo:

```text
Paralelo A: T002 — actualizar position.ts
Paralelo B: T003 — añadir getPositionCandidates a positionService.ts
Paralelo C: T004 — crear KanbanBoard.tsx
Paralelo D: T005 — crear KanbanColumn.tsx
Paralelo E: T007 — crear CandidateCard.tsx
```

Todas convergen en T006 (PositionDetail) y T008 (KanbanColumn con tarjetas).

## Estrategia de implementación

**MVP (entrega mínima verificable — US1 + US2, ambas P1)**:
T001 → T002‖T003‖T004‖T005‖T007 → T006 + T008

Cubre las 8 primeras historias de aceptación y todos los RF excepto RF-008 (responsive).

**Entrega completa**: Añadir T009 (responsive) + T010 (TS check).

## Resumen de tareas

| Fase | Tareas | Paralelizables |
|---|---|---|
| Phase 2 — Fundamentos | T001, T002, T003 | T002 ‖ T003 (tras T001) |
| Phase 3 — US1 (P1) | T004, T005, T006 | T004 ‖ T005 (tras T001); T006 al final |
| Phase 4 — US2 (P1) | T007, T008 | T007 paralelo con T004/T005 |
| Phase 5 — US3 (P2) | T009 | — |
| Phase 6 — Acabado | T010 | — |
| **Total** | **10 tareas** | **5 oportunidades de paralelismo** |
