import { timingSafeEqual } from "node:crypto";
import { parseExpense } from "@/lib/telegram";
import { ApiError, failure, json, readBody } from "@/lib/server";
export async function POST(request: Request) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET,
      provided = request.headers.get("x-telegram-bot-api-secret-token");
    if (
      !secret ||
      !process.env.TELEGRAM_CHAT_ID ||
      !process.env.TELEGRAM_API_KEY ||
      !process.env.TELEGRAM_ACCOUNT_ID ||
      !process.env.APP_URL
    )
      throw new ApiError(503, "Telegram pendiente de configurar.");
    if (
      !provided ||
      Buffer.byteLength(provided) !== Buffer.byteLength(secret) ||
      !timingSafeEqual(Buffer.from(provided), Buffer.from(secret))
    )
      throw new ApiError(401, "Webhook inválido.");
    const update = await readBody(request),
      message = update.message;
    if (String(message?.chat?.id) !== process.env.TELEGRAM_CHAT_ID)
      throw new ApiError(403, "Chat no autorizado.");
    if (message.voice)
      throw new ApiError(
        422,
        "La transcripción de audio requiere un proveedor adicional. Usa texto.",
      );
    let data;
    try {
      data = parseExpense(String(message.text || ""));
    } catch (e) {
      throw new ApiError(422, (e as Error).message);
    }
    const result = await fetch(new URL("/api/v1/gastos", process.env.APP_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TELEGRAM_API_KEY}`,
        "Idempotency-Key": `telegram-${update.update_id}`,
      },
      body: JSON.stringify({
        ...data,
        account_id: process.env.TELEGRAM_ACCOUNT_ID,
        occurred_on: new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Bogota",
        }).format(new Date()),
      }),
    });
    if (!result.ok) throw new ApiError(502, "No se pudo registrar el gasto.");
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
