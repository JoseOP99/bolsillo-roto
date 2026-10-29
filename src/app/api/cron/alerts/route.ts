import { timingSafeEqual } from "node:crypto";
import { admin, json, failure, ApiError } from "@/lib/server";
export async function GET(request: Request) {
  try {
    const expected = process.env.CRON_SECRET,
      token = request.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!expected) throw new ApiError(503, "Cron pendiente de configurar.");
    if (
      !token ||
      Buffer.byteLength(token) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    )
      throw new ApiError(401, "No autorizado.");
    const { data, error } = await admin().rpc("generate_payment_alerts");
    if (error) throw error;
    return json({ created: data });
  } catch (e) {
    return failure(e);
  }
}
