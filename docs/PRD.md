# Requisitos y estado

| ID      | Requisito                    | Estado / criterio                                                                         |
| ------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| AUTH-1  | Login y refresh persistente  | Implementado cliente Supabase; requiere usuario y confirmación de correo según proveedor  |
| AUTH-2  | Dispositivos y revocación    | Implementado para API/RLS; no sustituye revocación interna de Supabase Auth               |
| API-1   | API Keys por usuario         | Generar/revocar implementado; consumo externo requiere credencial servidor                |
| API-2   | Ingresos/gastos externos     | REST v1 validada, propietario forzado, idempotencia y límite por llave                    |
| DATA-1  | Registro rápido              | Formulario RHF/Zod con cuenta, categoría, fecha, cuotas                                   |
| DATA-2  | Crear tarjeta desde registro | Acceso a crear cuenta/tarjeta; vuelve a registrar el movimiento después                   |
| FIN-1   | EA/TEM y amortización        | Función TS y calendario SQL atómico; cuotas estimadas sin comisiones                      |
| FIN-2   | Préstamos y abonos           | Capital y abonos con protección contra sobrepago; no liquidación contractual de intereses |
| FIN-3   | Proyección                   | Caja + futuros ingresos − compromisos − cuotas; compromisos mensuales explícitos          |
| STAT-1  | 50/30/20                     | Presupuesto descriptivo por categoría; clasificación manual y regla de texto en Telegram  |
| PWA-1   | Instalación y offline        | Manifest, iconos, shortcuts y fallback offline; sin escrituras offline                    |
| WID-1   | Widgets nativos              | Guía y API preparadas; extensiones nativas pendientes                                     |
| BOT-1   | Telegram texto               | Adaptador implementado, necesita variables y registro de webhook                          |
| BOT-2   | Telegram audio               | Pendiente proveedor de transcripción y control de costo                                   |
| ALERT-1 | Alertas de pago              | Cron preparado, genera avisos internos con credenciales configuradas                      |
| ALERT-2 | Email/Push/Telegram          | Entrega externa pendiente de proveedores y consentimiento                                 |
| HOOK-1  | Webhooks salientes           | Pendientes firma HMAC, cola, reintentos y protección SSRF                                 |
| OPS-1   | GitHub                       | Push solicitado a JoseOP99/bolsillo-roto, rama main                                       |
| OPS-2   | Vercel                       | Código compatible, variables y despliegue pendientes                                      |

Antes de uso público: pruebas completas con dos usuarios autorizados, confirmación de correo/recuperación de contraseña, conciliación de pagos, pruebas de integración reales para API Keys, revisar límites gratuitos y privacidad de saldos.
