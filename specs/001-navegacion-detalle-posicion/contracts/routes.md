# Contratos de Ruta: Navegación a Detalle de Posición

**Feature**: 001-navegacion-detalle-posicion | **Fecha**: 2026-05-24

## Rutas de la SPA

### GET /positions

**Componente**: `Positions`  
**Descripción**: Listado de posiciones con filtros  
**Estado actual**: Existe. Se modifica para añadir navegación al detalle.  
**Cambio**: El botón "Ver proceso" pasa a ser un `<Link to={"/positions/" + position.id}>` (o `useNavigate`)

---

### GET /positions/:id

**Componente**: `PositionDetail`  
**Descripción**: Vista de detalle de una posición concreta  
**Estado actual**: No existe. Se crea en esta feature.  
**Parámetros de ruta**:

| Parámetro | Tipo | Validación | Descripción |
|---|---|---|---|
| `id` | `string` (URL) → `number` | `parseInt(id)` no debe ser `NaN` ni ≤ 0 | Identificador de la posición |

**Comportamiento**:
- ID válido + API OK → muestra título de la posición + flecha de retroceso
- ID inválido (NaN) → muestra error sin llamar a la API
- ID válido + API 404/error → muestra mensaje de error + enlace de vuelta al listado

---

## Contrato del endpoint consumido

### GET /positions/:id/interviewFlow

**Usado en**: `PositionDetail` (al montar el componente)  
**Campos consumidos en esta feature**: solo `positionName`  
**URL base**: `http://localhost:3010` (configurable vía variable de entorno)  

**Respuesta esperada (200)**:
```json
{
  "positionName": "string",
  "interviewFlow": { ... }
}
```

**Gestión de errores**:
| Código | Acción en UI |
|---|---|
| 404 | Mostrar "Posición no encontrada" + enlace al listado |
| 500 / red | Mostrar "Error al cargar la posición. Inténtalo de nuevo." + enlace al listado |

---

## Configuración del Router (App.tsx)

```text
BrowserRouter
└── Routes
    ├── Route path="/"          → redirige a /positions
    ├── Route path="/positions" → <Positions />
    └── Route path="/positions/:id" → <PositionDetail />
```
