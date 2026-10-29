import { z } from "zod";
import { identity, failure, json, readBody, ApiError } from "@/lib/server";
export async function GET(request: Request) {
  try {
    const { db, userId } = await identity(request, true);
    const { data, error } = await db
      .from("devices")
      .select("session_id,label,last_seen,created_at")
      .eq("user_id", userId)
      .is("revoked_at", null);
    if (error) throw error;
    return json({ data });
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
      .from("devices")
      .update({ revoked_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("session_id", parsed.data.id);
    if (error) throw error;
    return json({ revoked: true });
  } catch (e) {
    return failure(e);
  }
}
