# Diseño de Bolsillo Roto

La portada integra el bolsillo ilustrado en un titular de dos líneas. Nova Wallet sirvió como referencia para el protagonismo del producto y la acción principal. Lugano Living Lab aportó los cambios de escala y el ritmo editorial entre secciones. Los textos y funciones son propios de Bolsillo Roto.

La portada presenta las cuentas, explica el registro, permite simular cuotas y ofrece acceso al formulario. El panel conserva sus herramientas, agrupa opciones secundarias y separa cifras con espacio y contraste. La demo usa datos ficticios locales.

El tema claro es el inicial. El selector guarda la preferencia de tema en el navegador y se comparte entre portada y panel. La paleta de finanzas conserva verdes y acentos de gasto. Los títulos usan Plus Jakarta Sans y el cuerpo Inter, con cifras tabulares.

| Antes | Ahora | Motivo |
| --- | --- | --- |
| Acceso poco visible sobre un panel vacío | Portada con botón de entrada y formulario accesible por ancla | Ubicar la acción principal desde el primer pantallazo |
| Barra lateral cargada de opciones | Tareas principales visibles y herramientas secundarias desplegables | Dar prioridad al registro y las consultas diarias |
| Cabecera fija | Se retira al bajar y reaparece al subir, con prioridad al foco y al menú abierto | Ampliar el espacio de lectura |
| Decoración en las cifras | Montos legibles y gráfico con objetivos 50/30/20 identificados | Mostrar qué representa cada dato |

Las secciones se entregan visibles en HTML. IntersectionObserver inicia entradas suaves de 550 ms. El bolsillo tiene una entrada de 650 ms y la cabecera usa una transición de 240 ms. La reducción de movimiento desactiva las animaciones y el scroll suave. Menús y formularios conservan foco visible, cierre con Escape y objetivos táctiles amplios.

La marca usa `public/logo.webp` para la imagen visible, favicon y recursos PWA propios. La firma oficial usa `public/zenubit-mark.webp`, optimizado a partir de `logoZenubit.webp` del repositorio Zenubit. La imagen protagonista y el simulador funcional aportan la evidencia visual. Se omiten vídeos y fotografías decorativas para preservar peso y autenticidad.
