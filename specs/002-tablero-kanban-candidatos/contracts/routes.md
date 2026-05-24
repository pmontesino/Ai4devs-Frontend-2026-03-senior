# Contratos de API: Tablero Kanban de Candidatos

**Feature**: 002-tablero-kanban-candidatos | **Fecha**: 2026-05-24

## Endpoints consumidos

### GET /position/:id/interviewflow

**Usado en**: `PositionDetail` (ya implementado en spec 001 — corregir URL)  
**Corrección de bug spec 001**: la URL era `/positions/${id}/interviewFlow` → debe ser `/position/${id}/interviewflow`  
**Respuesta (200)**:

```json
{
  "positionName": "string",
  "interviewFlow": {
    "id": 1,
    "description": "string",
    "interviewSteps": [
      { "id": 1, "interviewFlowId": 1, "interviewTypeId": 1, "name": "CV Review", "orderIndex": 1 }
    ]
  }
}
```

---

### GET /position/:id/candidates *(nuevo en esta spec)*

**Usado en**: `PositionDetail` (fetch paralelo junto con interviewflow)  
**URL base**: `process.env.REACT_APP_API_URL ?? 'http://localhost:3010'`  
**Validación del parámetro `id`**: entero > 0 (ya validado en `PositionDetail` antes de llamar al servicio)  

**Respuesta (200)**:

```json
[
  {
    "fullName": "string",
    "currentInterviewStep": "string",
    "averageScore": 0
  }
]
```

**Gestión de errores**:

| Código | Acción en UI |
|---|---|
| 404 | `setState({ status: 'error', message: 'Posición no encontrada' })` |
| 500 / red | `setState({ status: 'error', message: 'Error al cargar los candidatos. Inténtalo de nuevo.' })` |

---

## Función de servicio nueva

### `getPositionCandidates(id: number): Promise<PositionCandidate[]>`

```typescript
// En frontend/src/services/positionService.ts
export async function getPositionCandidates(
  id: number
): Promise<PositionCandidate[]> {
  const response = await fetch(`${API_BASE_URL}/position/${id}/candidates`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Posición no encontrada');
    throw new Error('Error al cargar los candidatos. Inténtalo de nuevo.');
  }
  return response.json() as Promise<PositionCandidate[]>;
}
```

---

## Estrategia de fetch en PositionDetail

```typescript
// Fetch paralelo en useEffect
Promise.all([
  getPositionInterviewFlow(positionId),
  getPositionCandidates(positionId)
])
  .then(([flowData, candidates]) => {
    const steps = [...flowData.interviewFlow.interviewSteps]
      .sort((a, b) => a.orderIndex - b.orderIndex);
    setState({
      status: 'success',
      positionName: flowData.positionName,
      interviewSteps: steps,
      candidates,
    });
  })
  .catch((err: Error) => {
    setState({ status: 'error', message: err.message });
  });
```

---

## Árbol de componentes (PositionDetail en estado success)

```text
PositionDetail
├── <nav> ← Volver al listado (ya existente, sin cambios)
├── <h1> {positionName} (ya existente, sin cambios)
└── KanbanBoard (NUEVO)
    └── KanbanColumn × N (una por cada InterviewStep)
        └── CandidateCard × M (una por candidato en esa columna)
```
