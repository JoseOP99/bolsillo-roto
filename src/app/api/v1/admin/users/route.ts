import { identity, admin, ApiError, failure, json } from "@/lib/server";
import { resolveRole } from "@/lib/roles";
export async function GET(request: Request) {
  try {
    const auth = await identity(request, true);
    if (resolveRole(auth.user!, process.env.SUPERADMIN_EMAIL) !== "superadmin")
      throw new ApiError(
        403,
        "Solo el superadministrador puede consultar usuarios.",
      );
    const page = Math.max(
      1,
      Math.min(
        10000,
        Math.floor(Number(new URL(request.url).searchParams.get("page")) || 1),
      ),
    );
    const { data, error } = await admin().auth.admin.listUsers({
      page,
      perPage: 50,
    });
    if (error) throw error;
    return json({
      data: data.users.map((user) => ({
        id: user.id,
        email: user.email,
        role: resolveRole(user, process.env.SUPERADMIN_EMAIL),
        confirmed: Boolean(user.email_confirmed_at),
        created_at: user.created_at,
      })),
      page,
      page_size: 50,
    });
  } catch (error) {
    return failure(error);
  }
}
