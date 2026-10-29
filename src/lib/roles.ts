export type AppRole = "superadmin" | "user";
export function resolveRole(
  user: { email?: string; email_confirmed_at?: string },
  configuredEmail: string | undefined,
): AppRole {
  const admin = configuredEmail?.trim().toLowerCase();
  return admin &&
    user.email_confirmed_at &&
    user.email?.trim().toLowerCase() === admin
    ? "superadmin"
    : "user";
}
