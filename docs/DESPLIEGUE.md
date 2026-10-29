# Desplegar y probar en Vercel

## 1. Importar el repositorio

Importa `JoseOP99/bolsillo-roto`, rama de producción `main`. Framework Next.js, raíz `./`, instalación `npm ci`, build `npm run build`, salida automática. Usa Node.js 24.x. No hace falta configurar DATABASE_URL, contraseñas de PostgreSQL ni un servidor separado.

## 2. Variables de entorno

En Vercel → proyecto → Settings → Environment Variables. Configura Production y Preview si vas a probar ambos con la misma base. Development solo si necesitas descargarlas para trabajar localmente. Los dos entornos comparten la misma base y cualquier movimiento real afecta esa base; `/demo` sigue siendo local al navegador.

| Variable                             | Valor / dónde obtenerlo                                                                                     | Tipo                               |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL             | `https://kgergeimnxcyptffvmnp.supabase.co`                                                                  | Público                            |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Supabase → Settings → API Keys → Publishable key                                                            | Público                            |
| SUPABASE_SERVICE_ROLE_KEY            | Supabase → Settings → API Keys → legacy service_role; también admite una secret key moderna con supabase-js | Secreto, solo servidor             |
| SUPERADMIN_EMAIL                     | `jockrlos210@gmail.com`                                                                                     | Configuración privada del servidor |
| CRON_SECRET                          | Secreto aleatorio de 32 bytes generado por ti                                                               | Secreto                            |
| APP_URL                              | `https://TU_DOMINIO_REAL.vercel.app`, después de conocer la URL                                             | Público, usado solo en servidor    |

Generar tu CRON_SECRET localmente:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

El token impreso es privado: cópialo a Vercel, no a Git ni al chat. No agregues `NEXT_PUBLIC_` a service_role, SUPERADMIN_EMAIL, CRON_SECRET ni credenciales del bot. Telegram puede dejarse sin configurar en esta etapa; APP_URL se necesita al conectar ese bot, no para el registro/login básico.

Tras cambiar variables, ejecuta Redeploy: las variables públicas quedan incorporadas al build y los despliegues anteriores no se actualizan automáticamente. No agregues comillas alrededor de los valores en el dashboard.

## 3. Configurar las URLs de Supabase

En Authentication → URL Configuration:

- Site URL: la URL de producción exacta, por ejemplo `https://TU_DOMINIO_REAL.vercel.app`.
- Redirect URLs: añade `https://TU_DOMINIO_REAL.vercel.app/**` y `http://localhost:3000/**`.
- Si pruebas un preview, añade también su URL exacta seguida de `/**`. Es preferible una URL específica a permitir todos los dominios vercel.app.
- Cuando agregues un dominio propio, cambia Site URL y añade ese dominio a Redirect URLs. Conserva solo los orígenes que realmente uses.

El registro envía emailRedirectTo al origen desde el que estás usando la app. El cliente Supabase actual consume el retorno en `/`; no necesitas inventar una ruta `/auth/callback` para este flujo de correo/contraseña. No hay Google OAuth implementado ni Client ID/Secret de Google que configurar.

## 4. Registrar las dos cuentas

Los dos correos aún no existían al revisar Auth durante este ajuste. Crear una variable no crea usuarios ni contraseñas.

1. Mantén habilitado el proveedor Email, el registro y **Confirm email**.
2. Registra `jockrlos210@gmail.com` desde la aplicación, con una contraseña que elijas tú. Confirma el correo e inicia sesión. Con SUPERADMIN_EMAIL configurado, aparecerá Administración.
3. Registra y confirma `padilla99j@gmail.com`. Será usuario normal. Cualquier otra cuenta también será usuario normal por defecto.
4. Usa perfiles separados del navegador para probar los dos usuarios simultáneamente. Cada uno crea sus propias cuentas y movimientos.

El rol superadmin se verifica en cada petición usando el usuario validado por Supabase, su correo confirmado y la configuración privada del servidor. No se toma de user_metadata, localStorage ni del cuerpo de la petición. Las API Keys no dan acceso a administración. Sin SUPERADMIN_EMAIL válido, todos son usuarios normales.

La administración inicial permite consultar el directorio de usuarios y su confirmación. No incluye editar roles, borrar cuentas ni leer movimientos financieros ajenos. RLS sigue separando las finanzas por propietario. Cambiar el correo del administrador o SUPERADMIN_EMAIL cambia la asignación: revisar este comportamiento antes de ampliar el sistema de roles.

**Correo de confirmación:** el envío SMTP predeterminado de Supabase tiene límites y solo entrega a correos de integrantes del equipo de la organización. Para permitir que ambos correos se registren sin darles acceso al proyecto Supabase, configura un SMTP propio en Authentication → Email/SMTP Settings. No desactives la confirmación para sortear ese bloqueo, porque la asignación administrativa depende de que el correo esté verificado. Un rol de la app no requiere ser miembro del equipo de Supabase ni de Vercel.

## 5. Probar

- `/demo`: revisar el diseño sin escribir en la base.
- Login: correo confirmado, retorno al dominio correcto y rol mostrado.
- Usuario normal: no aparece Administración y la API administrativa responde 403 con su JWT.
- Cada usuario: crear una cuenta propia y registrar un movimiento propio; comprobar que el otro no lo vea.
- Integraciones: crear API Key y consumir GET /api/v1/accounts; luego una escritura controlada con Idempotency-Key si quieres verificar integración real.
- Cron: con CRON_SECRET y credencial servidor, Vercel lo ejecuta diariamente. Solo genera avisos internos; no manda emails, push ni Telegram.

No se han creado cuentas ni contraseñas ni se ha desplegado a Vercel durante este ajuste. El dominio final y los secretos deben configurarse antes de probar autenticación real.

Referencias oficiales: [Vercel variables](https://vercel.com/docs/environment-variables), [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp).
