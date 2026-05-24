# Plan de Implementación: Mover Candidato Entre Fases

**Rama**: `frontend-PJM` | **Fecha**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

## Resumen

Hacer arrastrables las tarjetas de candidato del tablero Kanban usando la HTML5 Drag and Drop API nativa (sin nuevas dependencias). El reclutador arrastra una tarjeta a una columna destino; el sistema aplica la actualización de forma optimista, llama a `PUT /candidates/:id` con el nuevo `InterviewStep.id` como `currentInterviewStep`, y revierte el estado visual si la operación falla.

---

## Contexto Técnico

**Lenguaje/Versión**: TypeScript 4.9 / React 18.3  
**Dependencias principales**: HTML5 Drag and Drop API (nativa, sin nuevas dependencias); React Bootstrap 2.x / Bootstrap 5.3 (Alert de error)  
**Almacenamiento**: N/A  
**Testing**: Jest + React Testing Library  
**Plataforma**: Navegador web (SPA, Create React App)  
**Tipo de proyecto**: Aplicación web — módulo frontend de LTI ATS  
**Objetivos de rendimiento**: CE-001 <5s (arrastre + confirmación); CE-004 <3s (feedback visual); actualización optimista garantiza CLS=0 y respuesta percibida inmediata  
**Restricciones**: Sin nuevas dependencias npm; actualización optimista obligatoria con rollback garantizado (CE-003)  
**Escala/Alcance**: 1 nueva función de servicio, extensión de 1 tipo, modificación de 4 componentes existentes

---

## Verificación de la Constitución

*PUERTA: debe superarse antes de la Fase 0. Se revisa de nuevo tras el diseño.*

| Principio | Estado | Notas |
|---|---|---|
| I. Estructura y Mantenibilidad | ✅ | Drag en `CandidateCard`; drop en `KanbanColumn`; coordinación en `KanbanBoard`; lógica async en `PositionDetail`. Sin over-ingeniería. |
| II. Calidad de Código | ✅ | JSDoc en `updateCandidateStep`; sin `any`; tipos estrictos para todos los handlers de eventos |
| III. Rendimiento | ✅ | Actualización optimista: CLS=0; INP sentido por el usuario <200ms; sin re-renders innecesarios |
| IV. Seguridad (NO NEGOCIABLE) | ✅ | `candidateId`, `applicationId` e `interviewStepId` provienen de datos cargados desde la API, nunca de input directo del usuario; sin `dangerouslySetInnerHTML` |
| V. Accesibilidad y UX | ⚠️ EXCEPCIÓN JUSTIFICADA | HTML5 DnD carece de soporte de teclado. La spec exige explícitamente arrastrar (RF-001) y no define alternativa de teclado. Se documenta como deuda técnica. Se añaden `aria-grabbed` y `aria-dropeffect` para lectores de pantalla. |

**Resultado**: Una excepción justificada en principio V. Sin violaciones bloqueantes.

---

## ⚠️ Hallazgo: campos faltantes en `PositionCandidate`

El backend ya devuelve `id` (candidate ID) y `applicationId` desde `GET /position/:id/candidates` — verificado en `backend/src/application/services/positionService.ts`, función `getCandidatesByPositionService`. Sin embargo, el tipo `PositionCandidate` (spec 002) no los incluye.

**Acción**: Añadir `id: number` y `applicationId: number` a `PositionCandidate` como parte de esta spec.

Además, `currentInterviewStep` en el body del PUT es el **ID numérico** del `InterviewStep`, no su nombre — verificado en `backend/src/presentation/controllers/candidateController.ts`: `parseInt(currentInterviewStep)`.

---

## Estructura del Proyecto

### Documentación (esta feature)

```text
specs/003-mover-candidato-fase/
├── plan.md              ← este fichero
├── research.md          ← decisiones de investigación (Fase 0)
├── data-model.md        ← entidades y contratos (Fase 1)
├── contracts/           ← contratos de ruta y API (Fase 1)
└── tasks.md             ← tareas de implementación (generado por /speckit.tasks)
```

### Código fuente — ficheros modificados

```text
frontend/src/
├── types/
│   └── kanban.ts              ← MODIFICAR: añadir id y applicationId a PositionCandidate
├── services/
│   └── positionService.ts     ← MODIFICAR: añadir updateCandidateStep()
└── components/
    ├── PositionDetail.tsx     ← MODIFICAR: moveError, pendingCandidateId, handleMoveCandidate, Alert
    ├── KanbanBoard.tsx        ← MODIFICAR: draggingCandidate state, pasar onMoveCandidate y pendingCandidateId
    ├── KanbanColumn.tsx       ← MODIFICAR: zona de drop, feedback isDragOver
    ├── CandidateCard.tsx      ← MODIFICAR: draggable, onDragStart, isPending
    └── KanbanBoard.css        ← MODIFICAR: añadir .kanban-column--drag-over y .candidate-card--pending
```

**Sin ficheros nuevos** — esta spec modifica exclusivamente ficheros existentes.

---

## Revisión de Constitución post-diseño

| Principio | Estado | Observación |
|---|---|---|
| I. Estructura y Mantenibilidad | ✅ | Árbol de componentes bien definido; cada componente tiene una sola responsabilidad nueva |
| II. Calidad de Código | ✅ | JSDoc en función de servicio; tipos en todos los props nuevos |
| III. Rendimiento | ✅ | Actualización optimista verificada; `finally` limpia pending state |
| IV. Seguridad (NO NEGOCIABLE) | ✅ | IDs siempre del servidor; sin eval ni HTML dinámico |
| V. Accesibilidad y UX | ⚠️ | Excepción DnD/teclado documentada; `aria-grabbed`, `aria-dropeffect`, `aria-busy` añadidos como mitigación parcial |

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
