# API REST v1

Origen: tu despliegue HTTPS. Respuestas JSON con `Cache-Control: no-store`. No habilita CORS abierto; AppSheet, Make y Apps Script deben consumirla desde sus servidores. Una API Key autoriza lectura de cuentas/resumen/transacciones y creación de transacciones del propietario. No autoriza administrar llaves ni dispositivos.

## Autenticación

`Authorization: Bearer br_<64 caracteres hexadecimales>` para integraciones. La llave se genera desde Integraciones con una sesión Supabase válida, se muestra una vez y puede revocarse. Se verifica por SHA-256 y expira si se configura `expires_at`. Límite fijo por minuto de 60 peticiones por llave. La credencial `SUPABASE_SERVICE_ROLE_KEY` vive exclusivamente en Vercel o `.env.local`.

La aplicación también acepta un access token JWT emitido por Supabase. Se verifica con `auth.getUser(token)`, se comprueba la revocación del dispositivo y se ejecuta con la identidad del usuario y RLS. La API nunca acepta un `user_id` del cuerpo: lo deriva de la identidad verificada.

Para las API Keys, la credencial de servidor realiza la búsqueda privada y las consultas siempre filtran por el propietario de la llave. La función financiera vuelve a validar que la cuenta pertenezca al mismo usuario. Las llaves personales no son JWT y no deben enviarse directamente a la API REST de Supabase.

## Endpoints

| Método          | Ruta                          | Resultado                                   |
| --------------- | ----------------------------- | ------------------------------------------- |
| GET             | `/api/v1/accounts`            | IDs y condiciones de las cuentas propias    |
| GET             | `/api/v1/transactions?page=0` | Hasta 50 movimientos; páginas desde cero    |
| POST            | `/api/v1/transactions`        | Crea ingreso/gasto y amortización si aplica |
| POST            | `/api/v1/gastos`              | Fuerza `kind: expense`                      |
| POST            | `/api/v1/ingresos`            | Fuerza `kind: income`                       |
| GET             | `/api/v1/summary`             | Ingresos, gastos y cuotas futuras del mes   |
| GET/POST/DELETE | `/api/v1/keys`                | Listar/crear/revocar llaves; solo JWT       |
| GET/DELETE      | `/api/v1/devices`             | Listar/revocar dispositivos; solo JWT       |

## Crear una transacción

```http
POST /api/v1/gastos
Authorization: Bearer br_TU_LLAVE_PRIVADA
Content-Type: application/json
Idempotency-Key: appsheet-fila-123

{
  "description": "Mercado semanal",
  "amount": 20000,
  "category": "Necesidades",
  "account_id": "UUID_DE_TU_CUENTA",
  "occurred_on": "2026-10-29",
  "installments": 1
}
```

Campos: `amount` es un número positivo con hasta dos decimales, máximo 10¹² COP; no se aceptan separadores de miles. `category`: `Necesidades`, `Deseos` o `Ahorro`. Fecha ISO `YYYY-MM-DD`. Descripción de 2 a 160 caracteres. `installments`: entero 1–120; valor por defecto 1. Para `/transactions` se requiere además `kind`: `income` o `expense`. Más de una cuota exige gasto con tarjeta de crédito.

Respuesta `201`: `{ "data": { "id": "…", "user_id": "…", "amount": 20000, … } }`. La creación de la transacción y todas sus cuotas ocurre en una única transacción de base de datos.

Usa una `Idempotency-Key` estable y única por registro lógico, máximo 100 caracteres. Repetirla devuelve el registro original sin duplicar cuotas; si cambias el cuerpo, la misma llave seguirá devolviendo el original. Se usa un bloqueo transaccional para peticiones concurrentes. No reutilices la llave para otro movimiento.

## AppSheet

1. Genera una llave en Integraciones. Copia el secreto a la configuración privada de tu automatización.
2. Consulta `GET /api/v1/accounts` para identificar la cuenta de destino.
3. Configura un Bot → Task → Webhook, método POST y URL `https://TU_DOMINIO/api/v1/gastos`.
4. Añade encabezados `Authorization`, `Content-Type` e `Idempotency-Key` (esta última con el ID estable de la fila).
5. Construye el JSON con columnas de monto, descripción, fecha y cuenta. Envía el monto como número, sin comillas ni símbolos monetarios. No guardes la API Key en columnas de una hoja compartida ni en formularios públicos.

Valida primero con un registro autorizado. Un fallo 503 en la ruta de integración suele indicar que falta la credencial privada de servidor.

## Errores

| Código | Significado                                                       |
| ------ | ----------------------------------------------------------------- |
| 400    | JSON inválido                                                     |
| 401    | Falta autenticación, sesión/llave inválida o dispositivo revocado |
| 403    | Credencial insuficiente para administrar llaves o dispositivos    |
| 413    | Cuerpo superior a 16 KiB                                          |
| 422    | Datos o cuenta no válidos                                         |
| 429    | Cuota por minuto alcanzada                                        |
| 500    | Error interno sin detalles sensibles                              |
| 503    | Configuración o dependencia no disponible                         |

## Telegram y cron

`POST /api/telegram` valida `X-Telegram-Bot-Api-Secret-Token` y el chat configurado, interpreta `Gasté 20k en comida` y llama a la API con idempotencia por update ID. Es un adaptador personal de un chat/usuario por despliegue; el modelo multiusuario necesita una vinculación de chats por usuario antes de ampliarlo. No acepta audio aún. Registra el webhook usando Bot API y el mismo `secret_token`; no pongas secretos en la URL de tu aplicación.

`GET /api/cron/alerts` solo acepta `Authorization: Bearer CRON_SECRET`. Vercel llama una vez al día a las 13:00 UTC (08:00 de Bogotá). Genera notificaciones internas, sin enviar email ni push. La entrega externa y la suscripción a webhooks salientes quedan pendientes.

## Roles y administración

GET /api/v1/me devuelve identidad y rol calculado en servidor. GET /api/v1/admin/users?page=1 lista hasta 50 usuarios. Ambos exigen JWT; el directorio exige además correo confirmado coincidente con SUPERADMIN_EMAIL. El usuario normal recibe 403 y una API Key no da acceso. No se exponen movimientos financieros de otros usuarios.
