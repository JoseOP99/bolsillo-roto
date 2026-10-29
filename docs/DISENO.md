# Diseño de Bolsillo Roto

Referencia del usuario: `DESIGN.md`, `screen.png` y `code.html`. Se conserva la identidad oscura/mint y se cambia la densidad y el lenguaje hacia un uso personal comprensible. La referencia original se conserva como evidencia, no es el código ejecutado.

Fondo `#0c111b`, superficies `#141b27`, bordes `#242d3b`, texto `#edf2fa`, menta `#68edb4`, coral para salidas y lavanda para categorías. Plus Jakarta Sans para títulos, Inter para cuerpo/datos y cifras tabulares. Fuentes cargadas desde Google Fonts con fallback del sistema; se puede autoalojar más adelante.

Navegación lateral en escritorio, menú lateral superpuesto en móvil; tarjetas en tres columnas, cuerpo principal 2 columnas y una sola en móvil. Acción principal Nuevo movimiento, atajo Ctrl/⌘ K y formularios con etiquetas visibles. Foco visible y soporte reduced-motion. Las tablas permiten desplazamiento y ocultan la categoría secundaria en pantallas pequeñas.

Marca: `public/logo.png`, editada desde la imagen original para quitar el fondo blanco, preservando bolsillo, tarjeta, billetes y monedas. No guardar imágenes de producción en rutas temporales. Fallback `public/icon.svg`. Firma activa: Creado por Zenubit enlaza a https://zenubit.com.

Estados: cero datos reales antes de iniciar sesión, demo explícita independiente, mensajes de guardado/error, validación en formulario, bloqueo durante envío, página offline, vacíos en movimientos y dispositivos. No simular métricas de API ni anunciar proveedores conectados si no lo están.

Las pequeñas curvas de las tarjetas resumen son decoración; la gráfica central usa valores registrados y objetivos por categoría. Proyección se presenta aparte y explica la fórmula. Las revisiones de escritorio/móvil y hallazgos se registran en VERIFICACION.md.
