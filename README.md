# Bolsillo Roto

Finanzas personales en pesos colombianos. Next.js App Router, React, Supabase y PWA. Identidad basada en las referencias originales de esta carpeta, con logo transparente.

## Ejecutar

```sh
npm ci
# Copia .env.example a .env.local y configura las variables.
npm run dev
```

- `/`: aplicación conectada a Supabase, con registro e inicio de sesión por correo y contraseña. Confirma el correo si tu configuración de Auth lo exige.
- `/demo`: datos ficticios persistidos únicamente en el navegador. No escribe en Supabase.
- Crea tu primera cuenta en **Mis cuentas**, luego usa **Nuevo movimiento**.
- Las compras a cuotas requieren una tarjeta de crédito y un gasto. La tabla futura se genera en una transacción SQL atómica.

## Única base autorizada

Proyecto Supabase **bolsillo-roto**, referencia `kgergeimnxcyptffvmnp`, región `us-east-1`. Las tres migraciones versionadas en `supabase/migrations/` ya se aplicaron mediante el conector de Supabase durante la implementación. No crear otra base ni volver a ejecutar estas migraciones manualmente sobre el mismo proyecto.

## Configuración

| Variable                               | Uso                                                                 |
| -------------------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL pública del proyecto                                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Llave pública, protegida por RLS                                    |
| `SUPABASE_SERVICE_ROLE_KEY`            | Solo servidor: peticiones de integraciones mediante API Keys y cron |
| `CRON_SECRET`                          | Autoriza el cron de alertas                                         |
| `APP_URL`                              | Origen HTTPS propio para Telegram                                   |
| `TELEGRAM_WEBHOOK_SECRET`              | Secreto del webhook de Telegram                                     |
| `TELEGRAM_CHAT_ID`                     | Único chat permitido para este adaptador personal                   |
| `TELEGRAM_API_KEY`                     | API Key del usuario que recibe los gastos                           |
| `TELEGRAM_ACCOUNT_ID`                  | Cuenta de ese usuario para los gastos del bot                       |

Nunca publiques `.env.local`, una `service_role`, contraseñas o API Keys privadas. Las llaves públicas de Supabase sí están destinadas al navegador; las tablas aplican RLS. En Vercel configura las variables en los ajustes del proyecto antes de desplegar. El push a GitHub no configura Vercel ni publica una web por sí solo.

## Funciones

- Dashboard, búsqueda, filtros, exportación CSV y registro validado con React Hook Form + Zod.
- Cuentas bancarias, efectivo, tarjetas con EA, corte y pago; sin PAN ni CVV.
- Motor EA → TEM y amortización de cuota fija con redondeo a centavos y último saldo cero.
- Presupuesto 50/30/20 sobre ingresos registrados.
- Préstamos por cobrar/pagar y abonos con bloqueo de concurrencia para evitar sobrepago.
- Compromisos mensuales y proyección de caja con cuotas futuras pendientes.
- API REST v1, API Keys aleatorias de 256 bits, almacenamiento SHA-256, revocación, cuota de 60 solicitudes/minuto por llave e idempotencia.
- Sesiones persistentes con refresh automático, registro y revocación de dispositivos a nivel de aplicación y RLS.
- Manifest, shortcuts, service worker y página offline. Se requiere conexión para operar con datos reales.
- Cron diario preparado para crear avisos internos; adaptador Telegram de texto preparado y restringido a un chat.

## Límites actuales

La integración por API Key y el cron necesitan la credencial privada de servidor. El bot requiere registrar el webhook y sus variables. Email, Web Push, audio/transcripción, entrega de webhooks salientes y widgets nativos requieren implementaciones/proveedores adicionales; no están activados. No se promete costo cero ilimitado: depende del uso y las condiciones de cada proveedor.

Los abonos de préstamos son un subregistro independiente: no crean movimientos en cuentas. El cron genera avisos, no realiza pagos ni envía mensajes externos. Las cuotas se proyectan; todavía no existe conciliación automática con un banco. La regla 50/30/20 es descriptiva; no clasifica con IA. La proyección es estimada y excluye compromisos cuyo día ya pasó o es hoy para reducir duplicaciones. No hay sincronización offline ni widgets nativos en esta versión.

## Verificar

```sh
npm run typecheck
npm test
npm run build
```

Las pruebas cubren tasas, conservación de capital, fechas de fin de mes y análisis de comandos Telegram. La compilación verifica tipos y rutas. La revisión de RLS no reemplaza pruebas de integración con dos usuarios reales antes de abrir el registro al público.

## Documentación

- [Contexto y arquitectura](docs/CONTEXTO.md)
- [Diseño](docs/DISENO.md)
- [API e integración AppSheet](docs/API.md)
- [Widgets y PWA](docs/WIDGETS.md)
- [Modelo financiero](docs/FINANZAS.md)
- [Requisitos y estado](docs/PRD.md)

Creado por [Zenubit](https://zenubit.com).
