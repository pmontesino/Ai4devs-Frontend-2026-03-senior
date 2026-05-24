# Contratos de API: Mover Candidato Entre Fases

**Feature**: 003-mover-candidato-fase | **Fecha**: 2026-05-24

## Endpoints consumidos

### GET /position/:id/interviewflow *(ya implementado, sin cambios)*

Devuelve `InterviewStep[]` con `id` y `name` — el `id` numérico es necesario para el cuerpo del PUT.

---

### GET /position/:id/candidates *(ya implementado — tipo extendido en esta spec)*

**Respuesta (200)** — campos relevantes para spec 003:
```json
[
  {
    "id": 1,
    "applicationId": 2,
    "fullName": "string",
    "currentInterviewStep": "string",
    "averageScore": 0
  }
]
```

> **Nota**: `id` y `applicationId` ya son devueltos por el backend. Esta spec solo los añade al tipo TypeScript `PositionCandidate`.

---

### PUT /candidates/:id *(nuevo consumo en esta spec)*

**URL base**: `process.env.REACT_APP_API_URL ?? 'http://localhost:3010'`  
**Ruta**: `PUT /candidates/:id`  
**Parámetro de ruta**: `id` = `PositionCandidate.id` (ID numérico del candidato)  
**Validación del parámetro**: entero > 0 — ya disponible desde los datos cargados (nunca input directo del usuario)

**Body**:
```json
{
  "applicationId": 2,
  "currentInterviewStep": 3
}
```

> ⚠️ `currentInterviewStep` en el body es el **ID numérico** del `InterviewStep` (campo `InterviewStep.id`), **no el nombre**. Verificado en `candidateController.ts`: `parseInt(currentInterviewStep)`.

**Respuesta (200)**:
```json
{
  "message": "Candidate stage updated successfully",
  "data": { ... }
}
```

**Gestión de errores**:

| Código | Condición | Acción en UI |
|---|---|---|
| 200 | Éxito | Estado ya actualizado optimistamente; `setPendingCandidateId(null)` |
| 404 | Application not found | Rollback + `setMoveError('Candidato no encontrado')` |
| 400 | ID inválido | Rollback + `setMoveError('Error al actualizar la fase. Inténtalo de nuevo.')` |
| 500 / red | Error servidor | Rollback + `setMoveError('Error al actualizar la fase. Inténtalo de nuevo.')` |

---

## Función de servicio nueva

### `updateCandidateStep(candidateId, applicationId, interviewStepId): Promise<void>`

```typescript
// En frontend/src/services/positionService.ts
export async function updateCandidateStep(
  candidateId: number,
  applicationId: number,
  interviewStepId: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId, currentInterviewStep: interviewStepId }),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Candidato no encontrado');
    throw new Error('Error al actualizar la fase. Inténtalo de nuevo.');
  }
}
```

---

## Flujo de drag and drop (HTML5 DnD API)

```text
1. CandidateCard
   → draggable="true"
   → onDragStart: e.preventDefault() no necesario; llamar onDragStart(candidate)
   → aria-grabbed="true" durante el arrastre

2. KanbanColumn
   → onDragOver: e.preventDefault() (permite el drop); setIsDragOver(true)
   → onDragLeave: setIsDragOver(false)
   → onDrop: e.preventDefault(); setIsDragOver(false); llamar onDrop(step)
   → className con "kanban-column--drag-over" cuando isDragOver=true

3. KanbanBoard
   → recibe onDragStart del candidato → setDraggingCandidate
   → recibe onDrop del step → llama onMoveCandidate(draggingCandidate, step)
                                  si draggingCandidate.currentInterviewStep !== step.name (RF-008)
   → document.addEventListener("dragend") → setDraggingCandidate(null)

4. PositionDetail
   → handleMoveCandidate: actualización optimista → PUT → rollback si error
```

---

## Estilos CSS nuevos (KanbanBoard.css)

```css
/* Columna con candidato sobre ella durante el arrastre (RF-007) */
.kanban-column--drag-over {
  background-color: rgba(13, 110, 253, 0.08);
  outline: 2px dashed #0d6efd;
  outline-offset: -2px;
  border-radius: 4px;
}

/* Tarjeta con actualización pendiente (RF-003) */
.candidate-card--pending {
  opacity: 0.6;
}
```
