# Tasks: Navegación a Detalle de Posición

**Input**: Documentos de diseño en `specs/001-navegacion-detalle-posicion/`
**Rama**: `frontend-PJM` | **Fecha**: 2026-05-24
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Formato: `[ID] [P?] [Story?] Descripción`

- **[P]**: Paralelizable (ficheros distintos, sin dependencias incompletas)
- **[Story]**: Historia de usuario a la que pertenece la tarea (US1, US2, US3)
- Rutas de fichero explícitas en todas las descripciones

---

## Phase 1: Configuración (Infraestructura compartida)

**Propósito**: Habilitar el sistema de enrutamiento en `App.tsx` — prerequisito bloqueante para todas las historias

- [x] T001 Configurar `BrowserRouter` + `Routes` en `frontend/src/App.tsx` con rutas `/`, `/positions` y `/positions/:id` (redirige `/` a `/positions`)

**Checkpoint**: El enrutamiento está activo y el servidor de desarrollo arranca sin errores.

---

## Phase 2: Fundamentos (Prerequisitos bloqueantes)

**Propósito**: Infraestructura compartida que DEBE estar lista antes de cualquier historia de usuario

**⚠️ CRÍTICO**: No se puede empezar ninguna historia hasta completar esta fase.

- [x] T002 Definir y exportar los tipos `Position`, `InterviewFlowResponse`, `InterviewStep` y `PositionDetailState` en `frontend/src/types/position.ts`
- [x] T003 [P] Crear `frontend/src/services/positionService.ts` con la función `getPositionInterviewFlow(id: number): Promise<InterviewFlowResponse>` que llama a `GET /positions/:id/interviewFlow`

**Checkpoint**: Tipos e infraestructura de servicio disponibles. Las historias de usuario pueden implementarse en paralelo.

---

## Phase 3: Historia de Usuario 1 — Navegar al detalle (Prioridad: P1) 🎯 MVP

**Objetivo**: El reclutador puede ir del listado de posiciones a la vista de detalle y volver.

**Prueba independiente**: Hacer clic en "Ver proceso" en cualquier tarjeta cambia la URL a `/positions/:id` y muestra la vista de detalle con el título de la posición y una flecha de retroceso.

### Implementación — Historia de Usuario 1

- [x] T004 [US1] Actualizar el tipo `Position` en `frontend/src/components/Positions.tsx` para añadir el campo `id: number` y añadir `id` a cada elemento del array mock
- [x] T005 [US1] Reemplazar el botón "Ver proceso" en `frontend/src/components/Positions.tsx` por un `<Link to={"/positions/" + position.id}>` usando `react-router-dom`
- [x] T006 [US1] Crear `frontend/src/components/PositionDetail.tsx` con:
  - Lectura del parámetro `:id` con `useParams`
  - Validación de que `id` es un entero válido (no `NaN`, no ≤ 0)
  - Llamada a `positionService.getPositionInterviewFlow(id)` en `useEffect`
  - Estado `PositionDetailState` (`loading` → `success` | `error`)
  - Renderizado del título (`positionName`) cuando el estado es `success`
  - Enlace `<Link to="/positions">` con flecha de retroceso (`aria-label="Volver al listado"`)
  - Mensaje de error y enlace de vuelta al listado cuando el estado es `error`
  - Skeleton o indicador de carga cuando el estado es `loading`

**Checkpoint**: La Historia de Usuario 1 es completamente funcional y verificable de forma independiente.

---

## Phase 4: Acabado y calidad transversal

**Propósito**: Correcciones que afectan a múltiples ficheros o que requieren que todas las historias estén completas.

- [x] T007 [P] Revisar accesibilidad en `frontend/src/components/PositionDetail.tsx`: confirmar `aria-label` en botón de retroceso, gestión del foco al montar el componente y contraste de colores
- [x] T008 [P] Revisar seguridad en `frontend/src/services/positionService.ts` y `frontend/src/components/PositionDetail.tsx`: confirmar que el `id` se valida antes de cualquier llamada a la API y que la URL base es configurable vía variable de entorno
- [x] T009 Verificar que no hay errores de TypeScript en los ficheros modificados (`frontend/src/App.tsx`, `frontend/src/components/Positions.tsx`, `frontend/src/components/PositionDetail.tsx`, `frontend/src/services/positionService.ts`)

---

## Dependencias entre historias

```text
T001 (setup routing)
  └── T002 (tipos)
        └── T003 (positionService)     [paralelo con T004]
  └── T004 (Positions.tsx: añadir id)  [paralelo con T003]
        └── T005 (Positions.tsx: Link)
              └── T006 (PositionDetail.tsx)
                    └── T007, T008, T009 (polish — paralelos entre sí)
```

## Ejecución en paralelo — Historia de Usuario 1

Una vez completados T001 + T002:

```text
Tarea paralela A: T003 — positionService.ts
Tarea paralela B: T004 → T005 — Positions.tsx (id + Link)
```

Ambas convergen en T006 (PositionDetail.tsx).

## Estrategia de implementación

**MVP (entrega mínima verificable)**: T001 → T002 → T003 + T004 → T005 → T006  
Completa la única historia de usuario (P1) y es verificable de extremo a extremo.

**Entrega completa**: Añadir T007 + T008 + T009 para accesibilidad, seguridad y calidad de código.

## Resumen de tareas

| Fase | Tareas | Paralelizables |
|---|---|---|
| Phase 1 — Setup | T001 | — |
| Phase 2 — Fundamentos | T002, T003 | T003 paralelo tras T002 |
| Phase 3 — US1 (P1) | T004, T005, T006 | T003 ‖ T004 |
| Phase 4 — Acabado | T007, T008, T009 | T007 ‖ T008 |
| **Total** | **9 tareas** | **3 oportunidades de paralelismo** |
