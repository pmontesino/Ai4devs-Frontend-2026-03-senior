# Modelo de Datos: Navegación a Detalle de Posición

**Feature**: 001-navegacion-detalle-posicion | **Fecha**: 2026-05-24

## Entidades

### Position (datos mock — Positions.tsx)

```typescript
type Position = {
  id: number;           // identificador único — AÑADIR al mock existente
  title: string;        // título de la posición
  manager: string;      // nombre del manager responsable
  deadline: string;     // fecha límite (ISO 8601)
  status: 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';
};
```

**Cambio respecto al estado actual**: Añadir campo `id` al tipo y a cada entrada del array mock.

---

### InterviewFlowResponse (respuesta de API — GET /positions/:id/interviewFlow)

Solo se consume el campo `positionName` en esta feature:

```typescript
type InterviewFlowResponse = {
  positionName: string;
  interviewFlow: {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  };
};

type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};
```

> Los campos de `interviewFlow` e `interviewSteps` son consumidos por la spec 002 (tablero Kanban). Se definen aquí para no duplicar la llamada API.

---

## Estados de la vista PositionDetail

```typescript
type PositionDetailState =
  | { status: 'loading' }
  | { status: 'success'; positionName: string }
  | { status: 'error'; message: string };
```

**Transiciones**:
- Al montar el componente → `loading`
- Respuesta OK de la API → `success` con `positionName`
- Error de red o ID inválido → `error` con mensaje descriptivo
