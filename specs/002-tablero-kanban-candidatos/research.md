# Investigación: Tablero Kanban de Candidatos

**Feature**: 002-tablero-kanban-candidatos | **Fecha**: 2026-05-24

## Decisiones

### 1. Rutas reales del backend

**Decisión**: Usar `/position/:id/interviewflow` y `/position/:id/candidates` (singular `position`, `interviewflow` en minúsculas)  
**Justificación**: Confirmado en `backend/src/index.ts` → `app.use('/position', positionRoutes)` y `backend/src/routes/positionRoutes.ts` → `router.get('/:id/interviewflow', ...)` y `router.get('/:id/candidates', ...)`  
**Impacto**: La función `getPositionInterviewFlow` de spec 001 tiene la URL incorrecta (`/positions/.../interviewFlow`). Debe corregirse en `positionService.ts` como parte de esta spec.  
**Alternativas descartadas**: No aplica — es un hecho del backend, no una elección.

### 2. Matching candidato-columna

**Decisión**: Comparar `candidate.currentInterviewStep` (string) con `step.name` de `InterviewStep`  
**Justificación**: El endpoint `GET /position/:id/candidates` devuelve `currentInterviewStep` como string (nombre de la fase), según el API spec. El `InterviewStep` tiene un campo `name`. La comparación directa de strings es la forma natural de relacionarlos.  
**Alternativas descartadas**: Comparar por `id` numérico — el endpoint de candidatos no devuelve el ID del paso, solo su nombre.

### 3. Estrategia de fetch paralelo

**Decisión**: `Promise.all([getPositionInterviewFlow(id), getPositionCandidates(id)])` en el `useEffect` de `PositionDetail`  
**Justificación**: Ambas llamadas son independientes entre sí; ejecutarlas en paralelo reduce el tiempo de carga a `max(t1, t2)` en lugar de `t1 + t2`. Esto ayuda a cumplir CE-001 (<3s).  
**Alternativas descartadas**: Dos `useEffect` separados — crearían dos estados de carga independientes y renders intermedios no deseados con posible CLS.

### 4. Extensión de PositionDetail como contenedor

**Decisión**: Extender `PositionDetail.tsx` existente para que, en estado `success`, también renderice `KanbanBoard`  
**Justificación**: `PositionDetail` ya gestiona la validación del `id`, el routing, el título y los estados de carga/error. Duplicar esta lógica en un nuevo componente viola YAGNI.  
**Alternativas descartadas**: Crear un componente `PositionDetailWithKanban` — sobre-ingeniería; el componente existente se puede extender limpiamente añadiendo `interviewSteps` y `candidates` al estado `success`.

### 5. Layout responsive del tablero

**Decisión**: Contenedor `d-flex flex-nowrap overflow-auto` en desktop; `flex-direction: column` en mobile vía clase CSS `kanban-board`  
**Justificación**: El número de columnas es dinámico (N fases). Bootstrap `Row/Col` divide en 12 partes fijas y no se adapta bien a un número variable de columnas. El flex layout con scroll horizontal en desktop y apilado vertical en mobile es más robusto.  
**Alternativas descartadas**: `Row/Col` con `xs={12} md={auto}` — genera problemas de alineación cuando hay muchas columnas; no soporta scroll horizontal nativo de Bootstrap.

### 6. Amplitud y fijado de columnas

**Decisión**: Columnas con `min-width: 250px; width: 280px; flex-shrink: 0` en desktop  
**Justificación**: Asegura que el nombre de la fase sea legible sin truncación y que las tarjetas tengan espacio suficiente. El scroll horizontal permite tener más de 4 columnas sin romper el layout.  
**Alternativas descartadas**: Columnas de ancho porcentual — en pantallas anchas quedan demasiado anchas; en pantallas estrechas no son legibles.
