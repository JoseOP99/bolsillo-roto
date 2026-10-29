import { identity, failure, json, readBody, ApiError } from "@/lib/server";
import { transactionSchema } from "@/lib/schemas";
export async function GET(request: Request) {
  try {
    const { db, userId } = await identity(request);
    const url = new URL(request.url);
    const page = Math.max(0, Number(url.searchParams.get("page")) || 0);
    const { data, error } = await db
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("occurred_on", { ascending: false })
      .range(page * 50, page * 50 + 49);
    if (error) throw error;
    return json({ data, page, page_size: 50 });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    const { db, userId } = await identity(request);
    const body = transactionSchema.safeParse(await readBody(request));
    if (!body.success)
      throw new ApiError(
        422,
        body.error.issues
          .map((i) => i.path.join(".") + ": " + i.message)
          .join("; "),
      );
    const idempotency = request.headers.get("idempotency-key");
    if (idempotency && idempotency.length > 100)
      throw new ApiError(422, "Idempotency-Key demasiado larga.");
    const { data, error } = await db.rpc("record_transaction", {
      p_user_id: userId,
      p_data: body.data,
      p_idempotency: idempotency,
    });
    if (error) {
      if (
        error.code === "22023" ||
        error.code === "23514" ||
        error.code === "23503"
      )
        throw new ApiError(422, error.message);
      throw error;
    }
    return json({ data }, 201);
  } catch (e) {
    return failure(e);
  }
}
