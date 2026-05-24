# Investigación: Navegación a Detalle de Posición

**Feature**: 001-navegacion-detalle-posicion | **Fecha**: 2026-05-24

## Decisiones

### 1. Sistema de enrutamiento

**Decisión**: `BrowserRouter` + `Routes` + `Route` de React Router DOM v6 (ya instalado)  
**Justificación**: La dependencia ya existe en `package.json`; v6 es el estándar actual con API de hooks (`useNavigate`, `useParams`); URLs limpias sin fragmento `#`  
**Alternativas descartadas**: HashRouter (incompatible con rutas limpias), enrutamiento manual con `window.location` (rompe el modelo de componentes React)

### 2. Identificador de posición

**Decisión**: Añadir campo `id: number` a los datos mock de `Positions.tsx` y usarlo como parámetro de ruta  
**Justificación**: Es la forma natural de referenciar recursos en REST; facilita la transición posterior a datos reales de la API  
**Alternativas descartadas**: Usar el índice del array (frágil ante reordenaciones), usar el título como slug (riesgo de colisiones y codificación URL)

### 3. Navegación de retroceso

**Decisión**: `<Link to="/positions">` explícito con icono de flecha  
**Justificación**: Funciona correctamente tanto desde navegación interna como desde acceso directo por URL; comportamiento predecible y semánticamente correcto con `<a>`  
**Alternativas descartadas**: `useNavigate(-1)` — falla cuando el usuario accede directamente a la URL del detalle (historial vacío)

### 4. Obtención del título de la posición

**Decisión**: Llamada a `GET /positions/:id/interviewFlow` en `useEffect` dentro de `PositionDetail`  
**Justificación**: La API es la fuente de verdad; el título no se pierde en recarga ni en acceso directo  
**Alternativas descartadas**: Pasar el título como `state` en la navegación de React Router (se pierde en recarga de página)

### 5. Gestión de errores de navegación

**Decisión**: Si el `id` no es un entero válido o la API devuelve 404, mostrar un mensaje de error y un enlace de vuelta al listado  
**Justificación**: Requisito mínimo de seguridad (RF-IV de la constitución: validar ID antes de llamar a la API) y de UX  
**Alternativas descartadas**: Redirección silenciosa a `/positions` (oculta el error al usuario)
