# Tasks: Mover Candidato Entre Fases

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Rama**: `frontend-PJM`  
**Input**: plan.md · spec.md · research.md · data-model.md · contracts/routes.md

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Paralelizable — fichero distinto, sin dependencias en tareas incompletas
- **[US1], [US2]**: Historia de usuario a la que pertenece la tarea (fases de HU)
- Todas las rutas son relativas a la raíz del repositorio

---

## Phase 1: Setup — Fundación bloqueante

**Propósito**: Extender el tipo y añadir la función de servicio. NINGUNA historia de usuario puede comenzar hasta que esta fase esté completa.

> ⚠️ **CRÍTICO**: Las historias de usuario dependen de que `PositionCandidate` incluya `id` y `applicationId`, y de que `updateCandidateStep` exista.

- [x] T001 [P] Extender `PositionCandidate` añadiendo `id: number` y `applicationId: number` en `frontend/src/types/kanban.ts`
- [x] T002 [P] Añadir la función exportada `updateCandidateStep(candidateId, applicationId, interviewStepId)` que llama a `PUT /candidates/:id` con el body `{ applicationId, currentInterviewStep: interviewStepId }` en `frontend/src/services/positionService.ts`

**Checkpoint**: Tipo y servicio listos — se puede iniciar implementación en paralelo de US1

---

## Phase 2: Historia de Usuario 1 — Arrastrar tarjeta y mover candidato (P1) 🎯 MVP

**Goal**: El reclutador puede arrastrar una tarjeta de candidato de una columna a otra. El sistema aplica la actualización de forma optimista y llama a `PUT /candidates/:id`. La tarjeta aparece en la columna destino inmediatamente (RF-001, RF-002, RF-003, RF-007, RF-008, RF-009).

**Prueba independiente**: Con la app levantada, abrir el detalle de una posición, arrastrar una tarjeta de candidato a otra columna y verificar que: (a) la tarjeta aparece en la columna destino, (b) se muestra el indicador de estado pendiente durante el proceso, (c) soltar en la misma columna no dispara ninguna llamada de red.

- [x] T003 [P] [US1] Añadir clases CSS `.kanban-column--drag-over` (fondo azul tenue + borde discontinuo) y `.candidate-card--pending` (opacidad 0.6) en `frontend/src/components/KanbanBoard.css`
- [x] T004 [P] [US1] Añadir el atributo `draggable`, la prop `onDragStart: (candidate: PositionCandidate) => void`, la prop `isPending: boolean` (con clase `candidate-card--pending` y spinner Bootstrap pequeño cuando `isPending`), y los atributos `aria-grabbed` y `aria-busy` a `frontend/src/components/CandidateCard.tsx`
- [x] T005 [P] [US1] Añadir las props `draggingCandidate: PositionCandidate | null`, `onDragStart: (candidate: PositionCandidate) => void`, `onDrop: (step: InterviewStep) => void` y `pendingCandidateId: number | null` a la interfaz de `KanbanColumn`; añadir estado local `isDragOver`; implementar handlers `onDragOver` (preventDefault + setIsDragOver(true)), `onDragLeave` (setIsDragOver(false)) y `onDrop` (setIsDragOver(false) + llamar onDrop); pasar `onDragStart` y `isPending={candidate.id === pendingCandidateId}` a cada `CandidateCard` en `frontend/src/components/KanbanColumn.tsx`
- [x] T006 [US1] Extender `KanbanBoardProps` con `onMoveCandidate: (candidate: PositionCandidate, newStep: InterviewStep) => void` y `pendingCandidateId: number | null`; añadir estado `draggingCandidate: PositionCandidate | null`; pasar `onDragStart={setDraggingCandidate}` y `onDrop` a cada `KanbanColumn`; en `onDrop` llamar `onMoveCandidate(draggingCandidate, step)` solo si `draggingCandidate.currentInterviewStep !== step.name` (RF-008); limpiar `draggingCandidate` con un handler `onDragEnd` en cada `CandidateCard` que llame `setDraggingCandidate(null)` — garantiza limpieza si el usuario cancela el arrastre fuera de cualquier columna en `frontend/src/components/KanbanBoard.tsx`
- [x] T007 [US1] Añadir estado `pendingCandidateId: number | null` y la función `handleMoveCandidate(candidate, newStep)` en `PositionDetail`: aplicar actualización optimista con `setState` funcional, llamar `setPendingCandidateId(candidate.id)`, llamar `updateCandidateStep`, y limpiar `pendingCandidateId` en `finally`; pasar `onMoveCandidate={handleMoveCandidate}` y `pendingCandidateId` a `KanbanBoard` en `frontend/src/components/PositionDetail.tsx`

**Checkpoint**: Las tarjetas son arrastrables, el tablero actualiza optimistamente y el indicador de pendiente es visible

---

## Phase 3: Historia de Usuario 2 — Gestión de error y rollback (P1)

**Goal**: Si `PUT /candidates/:id` falla, la tarjeta vuelve a su columna original y se muestra un Alert dismissible con el mensaje de error (RF-005, RF-006).

**Prueba independiente**: Con un mock de `fetch` que rechaza la llamada PUT, arrastrar una tarjeta y verificar que: (a) la tarjeta vuelve a la columna de origen, (b) aparece un Alert Bootstrap con el texto de error, (c) el Alert puede cerrarse.

- [x] T008 [US2] Completar `handleMoveCandidate` en `frontend/src/components/PositionDetail.tsx`: añadir estado `moveError: string | null`; capturar `prevCandidates` antes de la actualización optimista; en bloque `catch` hacer rollback con `setState` funcional y llamar `setMoveError`; en `finally` limpiar `pendingCandidateId`; renderizar un `<Alert variant="danger" dismissible onClose={() => setMoveError(null)}>` sobre el tablero cuando `moveError !== null`

**Checkpoint**: El tablero gestiona errores de forma robusta — rollback automático y mensaje de error visible

---

## Phase Final: Verificación

**Propósito**: Confirmar que los cambios no rompen la compilación TypeScript del frontend.

- [x] T009 [P] Ejecutar `tsc --noEmit` en `frontend/` y confirmar 0 errores de TypeScript

---

## Grafo de Dependencias

```text
T001 ──────────────────────────────→ T005 (PositionCandidate.id en KanbanColumn)
T001 ──────────────────────────────→ T006 (PositionCandidate en KanbanBoard)
T001 ──────────────────────────────→ T007 (PositionCandidate en PositionDetail)
T002 ──────────────────────────────→ T007 (updateCandidateStep llamado en handleMoveCandidate)
T003 ──────────────────────────────→ T005 (CSS aplicado desde KanbanColumn)
T004 ──────────────────────────────→ T006 (KanbanBoard renderiza CandidateCard con onDragStart)
T005 ──────────────────────────────→ T006 (KanbanBoard renderiza KanbanColumn con nuevas props)
T006 ──────────────────────────────→ T007 (PositionDetail pasa handlers a KanbanBoard)
T007 ──────────────────────────────→ T008 (extiende handleMoveCandidate con rollback)
T008 ──────────────────────────────→ T009 (verificación final)
```

## Oportunidades de Ejecución en Paralelo

### Bloque paralelo 1 — Fundación (inicio)
```text
T001 (kanban.ts)  ──┐
                    ├─→ T005, T006, T007
T002 (positionService.ts) ──┘
```

### Bloque paralelo 2 — Preparación de componentes hoja (tras T001)
```text
T003 (KanbanBoard.css)  ──┐
T004 (CandidateCard.tsx) ──┼─→ T006 (KanbanBoard)
T005 (KanbanColumn.tsx) ──┘
```

## Estrategia de Implementación

**MVP mínimo** (US1 — 7 tareas): T001 → T002 → T003 + T004 + T005 → T006 → T007  
Entrega: tablero con drag and drop funcional y actualización optimista.

**Entrega completa** (US1 + US2): + T008  
Entrega: gestión robusta de errores con rollback y Alert dismissible.

**Verificación final**: T009 — 0 errores TypeScript confirma la entrega.

| Historia | Tareas | Puede implementarse independientemente |
|---|---|---|
| US1 (P1) — Arrastrar tarjeta | T001–T007 | ✅ MVP completo |
| US2 (P1) — Gestión de error | T008 | ✅ Extiende handleMoveCandidate de T007 |
| Final | T009 | ✅ Validación TypeScript |
