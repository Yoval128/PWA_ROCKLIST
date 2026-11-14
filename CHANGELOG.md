# CHANGELOG — RockList PWA

Todos los cambios notables de este proyecto se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [2.0.0] — 2026-11-14

### ✨ Añadido
- **Eliminar canciones** — cada item del setlist ahora incluye un botón `✕` para borrar la entrada del `localStorage`.
- **Botón de sincronización manual** — aparece automáticamente cuando el dispositivo queda sin conexión; permite reintentar la sincronización al recuperar la red sin recargar la página.
- **Estado vacío de la lista** — se muestra un mensaje descriptivo cuando el setlist aún no tiene canciones.
- **CSS Custom Properties** (`--color-*`, `--radius`, `--transition`) en `:root` para centralizar el sistema de diseño.
- **Clases de botón semánticas** (`btn-secondary`, `btn-danger`) que reemplazan estilos en línea dispersos.
- **Clase `.tag-sync`** (verde / rojo) para indicar el estado de sincronización de cada canción de forma visual.
- **Atributos ARIA** (`role`, `aria-live`, `aria-label`) en elementos clave para mejorar la accesibilidad.
- **`<meta name="description">`** y **`<meta name="theme-color">`** en `<head>`.
- **`novalidate`** en el formulario + `.trim()` en los inputs para limpiar espacios antes de guardar.
- **Coordenadas GPS con precisión de 5 decimales** (`toFixed(5)`) para mayor legibilidad.
- **Animación `pulse`** en el texto del splash screen.
- **Header `sticky`** — permanece visible al hacer scroll en listas largas.

### 🎨 Cambiado — Paleta de colores
| Token | v1 | v2 |
|---|---|---|
| Fondo (`--color-bg`) | `#121212` | `#0d0d0d` |
| Superficie | `#222` | `#1a1a2e` (azul profundo) |
| Acento principal | `#e50914` (rojo) | `#f5a623` (naranja ámbar) |
| Acento hover | `#b0070f` | `#e8831a` |
| Éxito | `#28a745` | `#2ecc71` |
| Peligro / Offline | `#dc3545` | `#e74c3c` |
| `theme_color` (manifest) | `#e50914` | `#f5a623` |
| `background_color` (manifest) | `#000000` | `#0d0d0d` |

### 📱 Cambiado — Responsividad
- Diseño **mobile-first**: el contenido se adapta desde 320 px en adelante.
- **Breakpoint `sm` (≥ 480 px)** — aumenta el padding del contenedor.
- **Breakpoint `md` (≥ 768 px)** — el formulario pasa a un **grid de 2 columnas**; el botón de submit y la fila GPS ocupan el ancho completo.
- **Breakpoint `lg` (≥ 1024 px)** — el contenedor central se expande a `max-width: 860 px` con más padding interior.
- Tipografía con **`clamp()`** para títulos: escala fluidamente entre móvil y escritorio.
- `max-width: 720 px` centrado en `main` para evitar líneas demasiado largas en pantallas anchas.
- Inputs y botones con `width: 100%` por defecto para aprovechar el ancho disponible.
- Tarjetas `<li>` con **flexbox** (`justify-content: space-between`) para alinear info + botón de borrado.

### 🔧 Cambiado — HTML semántico
- Se eliminaron todos los `style=""` en línea de los botones de `index.html`.
- Se añadió `role="banner"`, `role="main"` y `role="list"` / `role="listitem"`.
- El `<h3>` del formulario es ahora parte visual del card del formulario (no un encabezado suelto).
- El botón de notificaciones usa `classList.add('oculto')` en lugar de `style.display = 'none'`.

### 🗑️ Eliminado
- `alert()` al detectar pérdida de conexión — reemplazado por el botón de sincronización manual no intrusivo.
- Estilos en línea (`style="background-color: ..."`) en todos los botones de `index.html`.

---

## [1.0.0] — 2026-11-13 _(versión inicial)_

### ✨ Añadido
- Splash screen con transición automática de 2 segundos.
- Formulario para capturar canción + banda al setlist.
- Almacenamiento local con `localStorage`.
- Integración de **Geolocalización** (`navigator.geolocation`) para registrar el lugar de captura de cada canción.
- Solicitud de permisos de **Notificaciones** del navegador; disparo de notificación al agregar una canción.
- Indicador de estado de red (badge "Conectado" / "Sin conexión").
- Sincronización automática de registros pendientes al recuperar la conexión.
- Registro del **Service Worker** (`sw.js`) para soporte offline.
- **Web App Manifest** (`manifest.json`) para instalación como PWA.
