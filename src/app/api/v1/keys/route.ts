import { randomBytes } from "node:crypto";
import { z } from "zod";
import {
  identity,
  failure,
  json,
  readBody,
  digest,
  ApiError,
} from "@/lib/server";
export async function GET(request: Request) {
  try {
    const { db, userId } = await identity(request, true);
    const { data, error } = await db
      .from("api_keys")
      .select("id,name,prefix,created_at,expires_at")
      .eq("user_id", userId)
      .is("revoked_at", null);
    if (error) throw error;
    return json({ data });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    const { db, userId } = await identity(request, true);
    const parsed = z
      .object({ name: z.string().trim().min(1).max(60) })
      .safeParse(await readBody(request));
    if (!parsed.success) throw new ApiError(422, "Nombre de llave inválido.");
    const key = "br_" + randomBytes(32).toString("hex");
    const { error } = await db.from("api_keys").insert({
      user_id: userId,
      name: parsed.data.name,
      prefix: key.slice(0, 11),
      key_hash: digest(key),
    });
    if (error) throw error;
    return json({ key }, 201);
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: Request) {
  try {
    const { db, userId } = await identity(request, true);
    const parsed = z
      .object({ id: z.uuid() })
      .safeParse(await readBody(request));
    if (!parsed.success) throw new ApiError(422, "ID inválido.");
    const { error } = await db
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", parsed.data.id)
      .eq("user_id", userId);
    if (error) throw error;
    return json({ revoked: true });
  } catch (e) {
    return failure(e);
  }
}
