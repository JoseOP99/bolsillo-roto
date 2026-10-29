import { POST as transaction } from "../transactions/route";
import { failure, readBody } from "@/lib/server";
export async function POST(request: Request) {
  try {
    const data = await readBody(request);
    return transaction(
      new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({ ...data, kind: "income" }),
      }),
    );
  } catch (e) {
    return failure(e);
  }
}
