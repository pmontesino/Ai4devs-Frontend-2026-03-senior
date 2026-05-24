# Especificación de Funcionalidad: Navegación a Detalle de Posición

**Rama de funcionalidad**: `frontend-PJM`  
**Creada**: 2026-05-24  
**Estado**: Borrador  

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Navegar al detalle de una posición (Prioridad: P1)

Un reclutador está revisando el listado de posiciones abiertas. Al encontrar la posición que le interesa gestionar, hace clic en el botón "Ver proceso" de esa tarjeta y es llevado a la vista de detalle de esa posición concreta.

**Por qué esta prioridad**: Es el punto de entrada imprescindible a la funcionalidad de gestión de candidatos. Sin esta navegación, el resto de casos de uso son inaccesibles.

**Prueba independiente**: Se puede verificar haciendo clic en "Ver proceso" en cualquier tarjeta de posición y comprobando que la URL cambia y se muestra la vista de detalle correcta de esa posición.

**Escenarios de Aceptación**:

1. **Dado** que el reclutador está en la página de listado de posiciones, **Cuando** hace clic en el botón "Ver proceso" de una posición, **Entonces** es redirigido a la página de detalle de esa posición.
2. **Dado** que el reclutador está en la vista de detalle de una posición, **Cuando** hace clic en la flecha de retroceso, **Entonces** vuelve al listado de posiciones.
3. **Dado** que el reclutador está en la vista de detalle, **Cuando** la página carga, **Entonces** se muestra el título de la posición en la parte superior.

---

### Casos Límite

- ¿Qué ocurre si se accede directamente a la URL de detalle de una posición que no existe?
- ¿Qué ocurre si el usuario no tiene permisos para ver esa posición?

## Requisitos *(obligatorio)*

### Requisitos Funcionales

- **RF-001**: El sistema DEBE mostrar un botón "Ver proceso" en cada tarjeta del listado de posiciones.
- **RF-002**: Al hacer clic en "Ver proceso", el sistema DEBE navegar a la vista de detalle de la posición correspondiente.
- **RF-003**: La vista de detalle DEBE mostrar el título de la posición en la parte superior de la página.
- **RF-004**: La vista de detalle DEBE incluir un elemento de navegación (flecha) en la parte superior izquierda para volver al listado de posiciones.
- **RF-005**: Al hacer clic en la flecha de retroceso, el sistema DEBE navegar de vuelta al listado de posiciones.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **CE-001**: El reclutador puede navegar del listado al detalle de una posición en menos de 2 clics.
- **CE-002**: El reclutador puede volver al listado desde el detalle en 1 clic.
- **CE-003**: El título de la posición es visible sin necesidad de desplazarse.

## Suposiciones

- La página de listado de posiciones (`/positions`) ya existe y funciona con sus filtros y tarjetas.
- Existe una estructura global de página con menú superior y footer; solo se implementa el contenido interno.
- El sistema de enrutamiento del frontend soporta rutas con parámetro de ID de posición (p.ej. `/positions/:id`).
- Los datos del título de la posición se obtienen del endpoint `GET /positions/:id/interviewFlow`.
