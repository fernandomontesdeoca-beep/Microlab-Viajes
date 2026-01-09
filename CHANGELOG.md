# Changelog - Microlab-Viajes

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-10-27
### Hito: Refactorización Modular y Arquitectura Core
Se ha migrado el proyecto de un prototipo monolítico a una arquitectura escalable basada en componentes, servicios y contexto global.

### 🚀 Añadido (Nuevas Funcionalidades)
- **Máquina de Estados Global**: Implementada lógica en `AppContext` para manejar los estados `IDLE`, `TRIP_ACTIVE`, y `VISIT_ACTIVE`.
- **Recuperación de Sesión**: El sistema ahora consulta Firestore al iniciar para detectar si el usuario tenía un viaje o visita sin cerrar (persistencia ante cierres inesperados).
- **Indicador de Conectividad**: Badge en el Header que muestra en tiempo real si la app está Online u Offline.
- **Reglas de Negocio (Core)**:
  - Definición de constantes para precios y tipos de vehículos.
  - Utilidad `calculations.js` preparada para la regla del 50/50 en costos.

### 🏗️ Arquitectura y Estructura
- **Configuración**:
  - `src/config/firebase.js`: Inicialización robusta con validación de variables de entorno.
  - `src/config/constants.js`: Centralización de "números mágicos" y nombres de colecciones.
  - `src/config/version.js`: Control de versión del build.
- **Contexto**:
  - `src/context/AppContext.jsx`: "Cerebro" de la app que maneja Auth anónimo y Estado.
  - `src/hooks/useAppContext.js`: Hook para consumo seguro del contexto.
- **Servicios (Capa de Datos)**:
  - `src/services/tripService.js`: CRUD para inicio y fin de viajes.
  - `src/services/visitService.js`: Gestión de visitas a clientes.
  - `src/services/settingsService.js`: Gestión de configuración global.
- **Componentes UI (Atomic Design)**:
  - `ui/Button.jsx`, `ui/Card.jsx`, `ui/Badge.jsx`: Componentes base reutilizables con Tailwind.
  - `layout/Header.jsx`: Cabecera inteligente conectada al estado de red.
  - `layout/MainLayout.jsx`: Contenedor principal centrado.
  - `features/ControlPanel.jsx`: Panel principal que cambia dinámicamente según el estado del usuario.

### ♻️ Refactorización (Cambios de Código)
- **App.jsx**: Se eliminó todo el código monolítico. Ahora actúa solo como integrador de `AppProvider` y `MainLayout`.
- **Limpieza**: Eliminados `App.css` y estilos CSS vainilla en favor de clases utilitarias de Tailwind.

---
## [0.0.0] - Prototipo Inicial
### Deprecado
- Código monolítico original en `App.jsx` (Reemplazado por arquitectura v1.0.0).
- Configuración híbrida de Firebase (Reemplazada por `import.meta.env` estándar).