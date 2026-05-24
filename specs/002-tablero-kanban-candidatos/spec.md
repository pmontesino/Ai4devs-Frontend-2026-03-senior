# Especificación de Funcionalidad: Visualización del Tablero Kanban de Candidatos

**Rama de funcionalidad**: `frontend-PJM`  
**Creada**: 2026-05-24  
**Estado**: Borrador  

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Ver las fases del proceso como columnas (Prioridad: P1)

Un reclutador accede a la vista de detalle de una posición y ve el tablero Kanban con una columna por cada fase del proceso de contratación de esa posición. Las columnas muestran su nombre y están ordenadas según el orden del proceso.

**Por qué esta prioridad**: La estructura de columnas es el esqueleto del tablero; sin ella no se puede visualizar ni gestionar ningún candidato.

**Prueba independiente**: Acceder a la vista de detalle de una posición y verificar que el número de columnas coincide con el número de fases definidas para esa posición.

**Escenarios de Aceptación**:

1. **Dado** que una posición tiene N fases, **Cuando** el reclutador accede a su vista de detalle, **Entonces** se muestran exactamente N columnas con los nombres de cada fase.
2. **Dado** que el tablero ha cargado, **Cuando** el reclutador lo revisa, **Entonces** las columnas están ordenadas según el orden del proceso de contratación.
3. **Dado** que la página está cargando los datos, **Cuando** la respuesta aún no ha llegado, **Entonces** se muestra un indicador de carga.

---

### Historia de Usuario 2 - Ver candidatos en su fase correspondiente (Prioridad: P1)

Un reclutador ve a cada candidato representado como una tarjeta en la columna que corresponde a su fase actual del proceso. Cada tarjeta muestra el nombre completo del candidato y su puntuación media.

**Por qué esta prioridad**: Sin los candidatos visibles el tablero no tiene utilidad.

**Prueba independiente**: Con candidatos en distintas fases, verificar que cada tarjeta aparece en la columna correcta y muestra nombre y puntuación.

**Escenarios de Aceptación**:

1. **Dado** que un candidato está en la fase "Entrevista Técnica", **Cuando** el reclutador ve el tablero, **Entonces** la tarjeta del candidato aparece en la columna "Entrevista Técnica".
2. **Dado** que una tarjeta de candidato está visible, **Cuando** el reclutador la lee, **Entonces** muestra el nombre completo y la puntuación media del candidato.
3. **Dado** que una columna no tiene candidatos, **Cuando** el reclutador ve el tablero, **Entonces** la columna aparece vacía pero visible.
4. **Dado** que un candidato tiene puntuación 0, **Cuando** su tarjeta se muestra, **Entonces** la puntuación se muestra como 0 (no como ausente).

---

### Historia de Usuario 3 - Ver el tablero en dispositivos móviles (Prioridad: P2)

Un reclutador accede al tablero desde su teléfono móvil y puede revisar todas las fases y candidatos sin problemas de legibilidad, con las columnas apiladas verticalmente.

**Por qué esta prioridad**: Mejora la accesibilidad del equipo de RRHH en movilidad, pero no es bloqueante para la funcionalidad principal.

**Prueba independiente**: Abrir el tablero en una pantalla móvil o emulador y verificar que las columnas se apilan verticalmente y el contenido es legible.

**Escenarios de Aceptación**:

1. **Dado** que el reclutador accede al tablero desde un dispositivo móvil, **Cuando** la página carga, **Entonces** las columnas se muestran en vertical, ocupando el ancho completo de la pantalla.
2. **Dado** que el tablero está en vista móvil, **Cuando** el reclutador lo revisa, **Entonces** el nombre de cada columna y las tarjetas de candidatos son legibles sin necesidad de zoom.

---

### Casos Límite

- ¿Qué ocurre si una posición no tiene candidatos en ninguna fase?
- ¿Qué ocurre si la llamada para obtener las fases falla?
- ¿Qué ocurre si la llamada para obtener los candidatos falla?
- ¿Qué ocurre si un candidato tiene una fase que no existe en el listado de fases de esa posición?

## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **RF-001**: El sistema DEBE obtener y mostrar las fases del proceso de la posición como columnas del tablero.
- **RF-002**: El número de columnas DEBE coincidir exactamente con el número de fases del proceso de contratación de la posición.
- **RF-003**: Cada columna DEBE mostrar el nombre de la fase como encabezado.
- **RF-004**: El sistema DEBE obtener y mostrar todos los candidatos en proceso para la posición.
- **RF-005**: Cada candidato DEBE representarse como una tarjeta ubicada en la columna correspondiente a su fase actual.
- **RF-006**: Cada tarjeta DEBE mostrar el nombre completo del candidato.
- **RF-007**: Cada tarjeta DEBE mostrar la puntuación media del candidato.
- **RF-008**: El tablero DEBE ser responsive: en pantallas menores de 576px (breakpoint `sm` de Bootstrap), las columnas se apilan verticalmente ocupando el ancho completo, garantizando legibilidad desde 375px.
- **RF-009**: El sistema DEBE mostrar un indicador de carga mientras se obtienen los datos.
- **RF-010**: Si la carga de datos falla, el sistema DEBE mostrar un mensaje de error informativo.

### Entidades Clave

- **Posición**: Representa el puesto de trabajo; tiene un nombre y un proceso de contratación asociado.
- **Fase del proceso (InterviewStep)**: Cada etapa del proceso de contratación; tiene un nombre y un orden.
- **Candidato**: Persona que ha aplicado a la posición; tiene nombre completo, puntuación media y una fase actual asignada.
- **Tarjeta de candidato**: Representación visual de un candidato en el tablero; muestra nombre y puntuación.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **CE-001**: El tablero carga y muestra todos los candidatos en menos de 3 segundos bajo condiciones de red normales.
- **CE-002**: El 100% de los candidatos en proceso aparece en la columna correcta según su fase actual.
- **CE-003**: El tablero es completamente legible y utilizable en pantallas de 375px de ancho o superior.
- **CE-004**: El reclutador identifica la fase de cualquier candidato con un solo vistazo (sin necesidad de interacción adicional).

## Suposiciones

- El número de fases puede variar por posición; el diseño debe adaptarse a cualquier número.
- Los datos de fases y candidatos se obtienen de los endpoints disponibles en el backend.
- La puntuación media puede ser 0 y debe mostrarse como tal.
- Existe estructura global de página (menú, footer); solo se implementa el contenido del tablero.
- Un candidato siempre tiene asignada una fase válida dentro del proceso de la posición.
- **[U1+U2]** Si cualquiera de las dos llamadas a la API falla (fases o candidatos), `Promise.all` rechaza y se muestra el mensaje de error genérico definido en RF-010. No se diferencia qué llamada específica falló ni se realiza recuperación parcial.
- **[U3]** Un candidato cuyo `currentInterviewStep` no coincida con ninguna de las columnas visibles no aparecerá en ninguna columna (exclusión silenciosa por diseño). Los datos del backend se asumen consistentes con las fases de la posición.
