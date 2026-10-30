# Diseño de Bolsillo Roto

Referencia del usuario: `DESIGN.md`, `screen.png` y `code.html`. Se conserva la identidad oscura/mint y se refinan la densidad, micro-interacciones, tipografía y experiencia táctil con estándares modernos de ingeniería frontend (skills de diseño de alta gama).

## Sistema de Diseño y Tokens

- **Fondo base**: `#090e17` (Obsidian Canvas)
- **Superficies**: `#111827` (Panel Base) y `#151d2e` (Elevated Panel)
- **Líneas y bordes**: `#1c2636` (Default) y `#283548` (Hover)
- **Texto**: `#edf2fa` (Primary) y `#8a99b0` (Muted/Secondary)
- **Acento positivo / Liquidez**: `#5ee8ad` (Electric Mint) con halo difuminado `rgba(94, 232, 173, 0.08-0.18)`
- **Alerta / Egresos**: `#ef9282` (Coral) y `rgba(239, 146, 130, 0.08)`
- **Acento analítico**: `#a5adef` (Lavender Soft)
- **Sombras de elevación**: `--shadow-card` y `--shadow-elevated` para profundidad sin ruido visual

## Tipografía

- **Títulos y Display**: **Plus Jakarta Sans** (700-800) con espaciado ajustado (`tracking: -1px` a `-0.4px`).
- **Cuerpo y Datos**: **Geist** (Vercel Core typography stack), eliminando la dependencia de fuentes genéricas y garantizando renderizado nítido.
- **Cifras tabulares**: `font-feature-settings: "tnum" 1` en todo el flujo de números y monedas para garantizar alineación vertical perfecta en balances y tablas.

## Navegación y Ergonomía

- Navegación lateral persistente en escritorio con indicador activo flotante (`border-radius`, barra lateral menta y dot de estatus con glow sutil).
- Topbar con efecto glassmorphic `backdrop-filter: blur(12px)` fijada en la parte superior.
- Menú lateral deslizable y drawer overlay en pantallas táctiles y móviles (`transform` acelerado por GPU).
- Botón principal de acción ("Nuevo movimiento") con realce táctil `active: scale(0.975)`, sombreado luminoso y atajo de teclado accesible `⌘ K` / `Ctrl+K`.

## Componentes y Estados

- **Tarjetas de métricas**: Efecto hover con elevación suave `transform: translateY(-1px)` y micro-barras de progreso con degradado de liquidez.
- **Formularios y modales**: Backdrop con desenfoque de 10px, animación de apertura fluida tipo `slide-up`, campos con outline accesible en foco y estado de error con contraste legible (`#ffb0a0`).
- **Notificaciones Toast**: Animación con físicas tipo spring de entrada desde la parte inferior central.
- **Accesibilidad**: Reglas estrictas para `prefers-reduced-motion: reduce`, navegación completa por teclado con trampas de foco en diálogos modales.
