# Modelo de Datos: Mover Candidato Entre Fases

**Feature**: 003-mover-candidato-fase | **Fecha**: 2026-05-24

## Tipos modificados

### `PositionCandidate` (`frontend/src/types/kanban.ts`)

El tipo debe extenderse con los campos que el backend ya devuelve y que son necesarios para el PUT:

```typescript
// Antes (spec 002):
export type PositionCandidate = {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};

// Después (spec 003):
export type PositionCandidate = {
  /** Identificador del candidato — usado como :id en PUT /candidates/:id */
  id: number;
  /** Identificador del registro de aplicación — campo applicationId en el body del PUT */
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};
```

> **Nota**: El backend ya devuelve `id` y `applicationId` desde `GET /position/:id/candidates`. No hay cambios en el backend.

---

## Tipos de operación nuevos

### `CandidateMovePayload` (inline en `positionService.ts`, no requiere tipo exportado)

```typescript
// Usado internamente en updateCandidateStep:
interface CandidateMovePayload {
  applicationId: number;
  currentInterviewStep: number;  // InterviewStep.id — NO el nombre
}
```

---

## Contratos de props de componentes (cambios respecto a spec 002)

### `KanbanBoard` (`frontend/src/components/KanbanBoard.tsx`)

```typescript
interface KanbanBoardProps {
  interviewSteps: InterviewStep[];
  candidates: PositionCandidate[];
  /** Callback al soltar una tarjeta en una columna distinta a la de origen */
  onMoveCandidate: (candidate: PositionCandidate, newStep: InterviewStep) => void;
  /** ID del candidato cuya actualización está en curso (para indicador visual) */
  pendingCandidateId: number | null;
}
```

Estado interno nuevo en `KanbanBoard`:
```typescript
const [draggingCandidate, setDraggingCandidate] = useState<PositionCandidate | null>(null);
```

### `KanbanColumn` (`frontend/src/components/KanbanColumn.tsx`)

```typescript
interface KanbanColumnProps {
  step: InterviewStep;
  candidates: PositionCandidate[];
  /** Candidato que está siendo arrastrado actualmente (null si no hay arrastre) */
  draggingCandidate: PositionCandidate | null;
  /** Callback al iniciar el arrastre de una tarjeta — fluye de KanbanBoard hacia CandidateCard */
  onDragStart: (candidate: PositionCandidate) => void;
  /** Callback al soltar un candidato en esta columna */
  onDrop: (step: InterviewStep) => void;
  /** ID del candidato pendiente de actualización */
  pendingCandidateId: number | null;
}
```

Estado interno nuevo en `KanbanColumn`:
```typescript
const [isDragOver, setIsDragOver] = useState(false);
```

### `CandidateCard` (`frontend/src/components/CandidateCard.tsx`)

```typescript
interface CandidateCardProps {
  candidate: PositionCandidate;
  /** true mientras se está procesando el movimiento de este candidato */
  isPending: boolean;
  /** Callback al iniciar el arrastre de esta tarjeta */
  onDragStart: (candidate: PositionCandidate) => void;
}
```

---

## Estado nuevo en `PositionDetail`

```typescript
// Dos nuevos useState adicionales al estado principal (PositionDetailState):
const [moveError, setMoveError] = useState<string | null>(null);
const [pendingCandidateId, setPendingCandidateId] = useState<number | null>(null);
```

### Función `handleMoveCandidate`

```typescript
const handleMoveCandidate = async (
  candidate: PositionCandidate,
  newStep: InterviewStep
): Promise<void> => {
  if (state.status !== 'success') return;
  if (candidate.currentInterviewStep === newStep.name) return; // RF-008

  const prevCandidates = state.candidates;
  setMoveError(null);

  // Actualización optimista
  setState(prev =>
    prev.status === 'success'
      ? {
          ...prev,
          candidates: prev.candidates.map(c =>
            c.id === candidate.id ? { ...c, currentInterviewStep: newStep.name } : c
          ),
        }
      : prev
  );
  setPendingCandidateId(candidate.id);

  try {
    await updateCandidateStep(candidate.id, candidate.applicationId, newStep.id);
  } catch (err: unknown) {
    // Rollback
    setState(prev =>
      prev.status === 'success' ? { ...prev, candidates: prevCandidates } : prev
    );
    setMoveError(
      err instanceof Error ? err.message : 'Error al actualizar la fase. Inténtalo de nuevo.'
    );
  } finally {
    setPendingCandidateId(null);
  }
};
```

---

## Árbol de componentes actualizado (estado success)

```text
PositionDetail
├── state: PositionDetailState (loading | success | error)
├── state: moveError: string | null
├── state: pendingCandidateId: number | null
├── handler: handleMoveCandidate(candidate, newStep): Promise<void>
├── Alert (Bootstrap, dismissible) — visible solo si moveError !== null
└── KanbanBoard
    ├── props: interviewSteps, candidates, onMoveCandidate, pendingCandidateId
    ├── state: draggingCandidate: PositionCandidate | null
    └── KanbanColumn (×N fases)
        ├── props: step, candidates, draggingCandidate, onDrop, pendingCandidateId
        ├── state: isDragOver: boolean
        └── CandidateCard (×M candidatos en esta fase)
            └── props: candidate, isPending, onDragStart
```
