# Verificación de la primera versión

Fecha: 29 de octubre de 2026. Se usó la base única `kgergeimnxcyptffvmnp`; no se insertaron movimientos ni usuarios ficticios en Supabase.

- `npm run build`: compilación de producción y generación de las 14 rutas correctas.
- `npm run typecheck`: sin errores de tipos.
- `npm test`: 5 pruebas correctas. Conversión EA/TEM, conservación de capital, saldo final cero, fecha de febrero, entradas inválidas y comandos Telegram.
- Navegador escritorio: dashboard y marca transparente renderizados; formulario abierto con etiquetas, gasto ficticio de $20.000 guardado únicamente en `/demo`; saldo pasó de $9.935.200 a $9.915.200 y apareció la fila correspondiente.
- Simulador: $1.200.000 a 12 meses y EA 0 produjo cuotas de $100.000 e intereses $0; última fila con saldo $0.
- Navegador móvil: viewport 390 × 844, menú abierto y navegación/búsqueda funcionales. Ancho del documento 375 px (más barra de desplazamiento), sin desbordamiento horizontal de la página. Se restableció el viewport.
- Persistencia demo: el movimiento local siguió visible después de recargar. Búsqueda por descripción mostró únicamente la fila esperada.
- HTTP: `/api/v1/transactions`, `/keys`, `/accounts` y `/summary` devolvieron 401 sin Bearer Token. Manifest servido con tres iconos.
- Base: RLS habilitada en las 10 tablas públicas y el contador privado. Las funciones financieras y cron no son ejecutables por `anon`; los wrappers públicos son invoker y las implementaciones privilegiadas están en `private` con identidad explícita.
- Asesor Supabase: sin advertencias/errores de seguridad; una nota informativa de RLS sin políticas en `private.api_usage`, intencionalmente accesible solo al servicio de servidor.
- Durante cambios en caliente apareció un error de hidratación por espacios de JSX. Se comprobó nuevamente con la compilación de producción; no hubo errores nuevos después de recargar.

## Verificación pendiente

No se probó el flujo autenticado completo con cuentas de usuario reales ni el aislamiento funcional con dos usuarios porque no se crearon usuarios/datos de prueba en la base real. No se probó una llamada externa con API Key: falta la credencial privada de servidor. El cron y Telegram necesitan configuración; no se enviaron notificaciones externas. Instalación PWA en dispositivos físicos, email, push, audio y widgets nativos no se verificaron. El adaptador Telegram solo registra mensajes de texto: no envía respuestas al chat.

Estas limitaciones están reflejadas en README y PRD; no deben presentarse como integraciones activas.
