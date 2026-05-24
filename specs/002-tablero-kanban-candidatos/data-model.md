# Modelo de Datos: Tablero Kanban de Candidatos

**Feature**: 002-tablero-kanban-candidatos | **Fecha**: 2026-05-24

## Tipos existentes reutilizados (de spec 001)

Los siguientes tipos ya existen en `frontend/src/types/position.ts` y son reutilizados sin cambios:

```typescript
type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;       // ← usado para el matching candidato-columna
  orderIndex: number; // ← determina el orden de las columnas
};

type InterviewFlowResponse = {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
};
```

---

## Tipos nuevos — `frontend/src/types/kanban.ts`

```typescript
/** Candidato en proceso para una posición (respuesta de GET /position/:id/candidates) */
export type PositionCandidate = {
  /** Nombre completo del candidato */
  fullName: string;
  /** Nombre de la fase actual del candidato — usado para matching con InterviewStep.name */
  currentInterviewStep: string;
  /** Puntuación media del candidato (puede ser 0) */
  averageScore: number;
};

/**
 * Estado del tablero Kanban.
 * Modela las tres fases del ciclo de vida: carga, éxito y error.
 */
export type KanbanBoardState =
  | { status: 'loading' }
  | { status: 'success'; interviewSteps: InterviewStep[]; candidates: PositionCandidate[] }
  | { status: 'error'; message: string };
```

> **Nota**: `KanbanBoardState` importa `InterviewStep` de `../types/position`.

---

## Cambios en tipos existentes

### `PositionDetailState` (`frontend/src/types/position.ts`)

El estado `success` se extiende para incluir los datos del Kanban, eliminando la necesidad de un estado separado:

```typescript
// Antes (spec 001):
type PositionDetailState =
  | { status: 'loading' }
  | { status: 'success'; positionName: string }
  | { status: 'error'; message: string };

// Después (spec 002):
type PositionDetailState =
  | { status: 'loading' }
  | { status: 'success'; positionName: string; interviewSteps: InterviewStep[]; candidates: PositionCandidate[] }
  | { status: 'error'; message: string };
```

---

## Contratos de componentes (Props)

### KanbanBoard

```typescript
type KanbanBoardProps = {
  /** Fases del proceso, ordenadas por orderIndex */
  interviewSteps: InterviewStep[];
  /** Lista completa de candidatos para la posición */
  candidates: PositionCandidate[];
};
```

### KanbanColumn

```typescript
type KanbanColumnProps = {
  /** Fase del proceso que representa esta columna */
  step: InterviewStep;
  /** Candidatos cuyo currentInterviewStep coincide con step.name */
  candidates: PositionCandidate[];
};
```

### CandidateCard

```typescript
type CandidateCardProps = {
  /** Candidato a mostrar */
  candidate: PositionCandidate;
};
```

---

## Lógica de distribución de candidatos

```typescript
// En KanbanBoard: filtrar candidatos por columna
const candidatesInStep = (step: InterviewStep) =>
  candidates.filter((c) => c.currentInterviewStep === step.name);
```

**Ordenación de columnas**: `interviewSteps` se ordenan por `orderIndex` ascendente antes de renderizar.

**Caso límite**: Si `candidate.currentInterviewStep` no coincide con ningún `step.name`, el candidato NO aparece en ninguna columna (comportamiento silencioso). Documentado como suposición en `spec.md`.
