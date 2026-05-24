# Especificación de Funcionalidad: Mover Candidato Entre Fases

**Rama de funcionalidad**: `frontend-PJM`  
**Creada**: 2026-05-24  
**Estado**: Borrador  

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Mover un candidato a otra fase arrastrando su tarjeta (Prioridad: P1)

Un reclutador decide avanzar a un candidato a la siguiente fase del proceso. Para ello, arrastra la tarjeta del candidato desde su columna actual y la suelta en la columna de la nueva fase. El sistema actualiza automáticamente la fase del candidato y la tarjeta queda ubicada en la nueva columna.

**Por qué esta prioridad**: Es la funcionalidad central de gestión del tablero; el propósito principal de la vista de detalle.

**Prueba independiente**: Arrastrar una tarjeta de candidato de una columna a otra y verificar que el candidato aparece en la nueva columna tanto en la UI como al recargar la página.

**Escenarios de Aceptación**:

1. **Dado** que un candidato está en la fase "Screening inicial", **Cuando** el reclutador arrastra su tarjeta a la columna "Entrevista Técnica" y la suelta, **Entonces** la tarjeta aparece en la columna "Entrevista Técnica" y la fase del candidato queda actualizada.
2. **Dado** que el reclutador está arrastrando una tarjeta, **Cuando** la tiene sobre una columna destino válida, **Entonces** se muestra una indicación visual de que puede soltarla ahí.
3. **Dado** que el reclutador suelta una tarjeta en la misma columna de origen, **Cuando** la operación finaliza, **Entonces** la tarjeta vuelve a su posición sin enviar ninguna actualización.

---

### Historia de Usuario 2 - Gestionar el error al actualizar la fase (Prioridad: P1)

El reclutador arrastra una tarjeta a una nueva columna, pero la actualización falla por un error de red o del servidor. El sistema informa del fallo y devuelve la tarjeta a su columna original, manteniendo la consistencia del tablero.

**Por qué esta prioridad**: Sin gestión de errores, el tablero puede mostrar un estado incorrecto que induzca a error en la toma de decisiones de contratación.

**Prueba independiente**: Simular un error de red al mover una tarjeta y verificar que la tarjeta vuelve a su posición original y se muestra un mensaje de error.

**Escenarios de Aceptación**:

1. **Dado** que el reclutador ha soltado una tarjeta en una nueva columna, **Cuando** el sistema intenta guardar el cambio y falla, **Entonces** la tarjeta vuelve automáticamente a su columna original.
2. **Dado** que se ha producido un error al actualizar la fase, **Cuando** el reclutador ve el tablero, **Entonces** se muestra un mensaje de error informativo (no técnico).
3. **Dado** que se está procesando la actualización, **Cuando** el reclutador intenta mover otra tarjeta, **Entonces** la interacción no bloquea el uso del tablero.

---

### Casos Límite

- ¿Qué ocurre si se intenta mover una tarjeta mientras hay otra actualización en curso?
- ¿Qué ocurre si la conexión se pierde en mitad de un arrastre?
- ¿Puede un candidato moverse a cualquier fase o solo a la siguiente en el orden?
- ¿Qué ocurre si se mueve una tarjeta a una columna que ya tiene muchos candidatos?

## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **RF-001**: El sistema DEBE permitir al usuario arrastrar una tarjeta de candidato desde una columna y soltarla en otra columna del tablero.
- **RF-002**: Al soltar la tarjeta en una columna distinta a la de origen, el sistema DEBE enviar la actualización de fase al servidor.
- **RF-003**: Mientras se procesa la actualización, el sistema DEBE mostrar una indicación visual de estado pendiente.
- **RF-004**: Si la actualización se completa correctamente, la tarjeta DEBE permanecer en la columna destino.
- **RF-005**: Si la actualización falla, la tarjeta DEBE volver a la columna de origen automáticamente.
- **RF-006**: Si la actualización falla, el sistema DEBE mostrar un mensaje de error comprensible para el usuario.
- **RF-007**: Al arrastrar sobre una columna válida, el sistema DEBE proporcionar retroalimentación visual.
- **RF-008**: Soltar una tarjeta en su propia columna de origen NO DEBE desencadenar ninguna actualización.
- **RF-009**: El usuario DEBE poder mover candidatos a cualquier fase del proceso, sin restricción de orden.

### Entidades Clave

- **Tarjeta de candidato**: Elemento arrastrable que representa a un candidato; pertenece a una columna/fase.
- **Columna destino**: Fase a la que se quiere mover al candidato; es la zona de destino del arrastre.
- **Actualización de fase**: Operación que persiste el cambio de fase de un candidato en el sistema.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **CE-001**: El reclutador puede completar el cambio de fase de un candidato en menos de 5 segundos (arrastre + confirmación visual).
- **CE-002**: El tablero refleja el estado correcto de todos los candidatos tras cualquier operación de movimiento.
- **CE-003**: El 100% de los errores de actualización devuelven la tarjeta a su posición original sin intervención del usuario.
- **CE-004**: El reclutador recibe retroalimentación visual del resultado de cada operación (éxito o error) en menos de 3 segundos.

## Suposiciones

- Un candidato puede moverse a cualquier fase del proceso sin restricción de orden.
- La actualización de fase requiere el identificador de la aplicación y el identificador de la nueva fase.
- Los identificadores de las fases están disponibles desde los datos cargados al iniciar la vista.
- La operación de actualización es atómica: o se completa con éxito o se revierte visualmente al estado anterior.
- No se requiere confirmación explícita del usuario antes de enviar la actualización.
- **Movimientos concurrentes**: múltiples arrastres simultáneos son técnicamente posibles; `pendingCandidateId` rastrea solo el último movimiento activo. El tablero no bloquea nuevos arrastres durante una actualización en curso; si dos actualizaciones se solapan, el estado final refleja el resultado de la última llamada completada. Este comportamiento es aceptable para el alcance actual.
- **Mensaje de error**: cuando la actualización de fase falla, se muestra un Alert Bootstrap dismissible con el texto "Error al actualizar la fase. Inténtalo de nuevo."; si el servidor devuelve 404 se muestra "Candidato no encontrado". No se exponen detalles técnicos al usuario.
- **Criterios de rendimiento CE-001 y CE-004**: la actualización optimista garantiza respuesta visual inmediata (<200ms percibido), satisfaciendo CE-001 (<5s) y CE-004 (<3s) sin necesidad de tareas de medición de performance en esta iteración. Se documenta como deuda técnica si el producto requiere CI de performance.
