import { identity, failure, json } from "@/lib/server";
import { resolveRole } from "@/lib/roles";
export async function GET(request: Request) {
  try {
    const auth = await identity(request, true);
    return json({
      data: {
        id: auth.userId,
        email: auth.user?.email,
        role: resolveRole(auth.user!, process.env.SUPERADMIN_EMAIL),
      },
    });
  } catch (error) {
    return failure(error);
  }
}
