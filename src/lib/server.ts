import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function admin() {
  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  )
    throw new ApiError(503, "Servidor pendiente de configurar.");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export const digest = (key: string) =>
  createHash("sha256").update(key).digest("hex");
export async function identity(request: Request, sessionOnly = false) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) throw new ApiError(401, "Se requiere Bearer Token.");
  if (token.startsWith("br_")) {
    if (sessionOnly)
      throw new ApiError(403, "Esta acción requiere una sesión de usuario.");
    const db = admin();
    const { data, error } = await db
      .from("api_keys")
      .select("id,user_id,revoked_at,expires_at")
      .eq("key_hash", digest(token))
      .maybeSingle();
    if (error) throw new ApiError(503, "No se pudo validar la llave.");
    if (
      !data ||
      data.revoked_at ||
      (data.expires_at && Date.parse(data.expires_at) < Date.now())
    )
      throw new ApiError(401, "Llave inválida o revocada.");
    const { data: allowed, error: limitError } = await db.rpc(
      "consume_api_quota",
      { p_key_id: data.id },
    );
    if (limitError)
      throw new ApiError(503, "No se pudo verificar el límite de uso.");
    if (!allowed)
      throw new ApiError(429, "Límite de 60 peticiones por minuto alcanzado.");
    return {
      db,
      userId: data.user_id as string,
      apiKey: true,
      sessionId: null,
    };
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
    throw new ApiError(503, "Supabase pendiente de configurar.");
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);
  if (error || !user) throw new ApiError(401, "Sesión inválida.");
  let sid: string;
  try {
    sid = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    ).session_id;
    if (!sid) throw new Error();
  } catch {
    throw new ApiError(401, "Sesión inválida.");
  }
  const { data: device, error: deviceError } = await db
    .from("devices")
    .select("revoked_at")
    .eq("session_id", sid)
    .eq("user_id", user.id)
    .maybeSingle();
  if (deviceError)
    throw new ApiError(503, "No se pudo comprobar el dispositivo.");
  if (device?.revoked_at)
    throw new ApiError(401, "Dispositivo revocado. Cierra e inicia sesión.");
  if (!device) {
    const { error: e } = await db.from("devices").upsert(
      {
        session_id: sid,
        user_id: user.id,
        label: (request.headers.get("user-agent") || "Dispositivo").slice(
          0,
          180,
        ),
      },
      { onConflict: "session_id", ignoreDuplicates: true },
    );
    if (e) throw new ApiError(503, "No se pudo registrar el dispositivo.");
  }
  return { db, userId: user.id, apiKey: false, sessionId: sid };
}
export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function failure(error: unknown) {
  if (error instanceof ApiError)
    return json({ error: error.message }, error.status);
  console.error(
    "API error",
    error instanceof Error ? error.message : "unknown",
  );
  return json({ error: "No se pudo completar la operación." }, 500);
}
export async function readBody(request: Request) {
  const text = await request.text();
  if (Buffer.byteLength(text) > 16384)
    throw new ApiError(413, "Solicitud demasiado grande.");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "JSON inválido.");
  }
}
