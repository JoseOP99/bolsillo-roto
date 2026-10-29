import { identity, json, failure } from "@/lib/server";
export async function GET(request: Request) {
  try {
    const { db, userId } = await identity(request);
    const { data, error } = await db.rpc("financial_summary", {
      p_user_id: userId,
    });
    if (error) throw error;
    return json({ data });
  } catch (e) {
    return failure(e);
  }
}
