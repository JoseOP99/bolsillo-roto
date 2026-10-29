import { identity, json, failure } from "@/lib/server";
export async function GET(request: Request) {
  try {
    const { db, userId } = await identity(request);
    const { data, error } = await db
      .from("accounts")
      .select("id,name,kind,annual_rate,cutoff_day,payment_day")
      .eq("user_id", userId);
    if (error) throw error;
    return json({ data });
  } catch (e) {
    return failure(e);
  }
}
