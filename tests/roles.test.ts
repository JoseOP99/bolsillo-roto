import test from "node:test";
import assert from "node:assert/strict";
import { resolveRole } from "../src/lib/roles";
test("client metadata cannot grant administrator access", () => {
  const user = {
    email: "user@example.com",
    email_confirmed_at: "2026-10-29",
    user_metadata: { role: "superadmin" },
  };
  assert.equal(resolveRole(user, "admin@example.com"), "user");
});
test("only configured verified email becomes superadmin", () => {
  assert.equal(
    resolveRole(
      { email: " Admin@example.com ", email_confirmed_at: "2026-10-29" },
      "admin@example.com",
    ),
    "superadmin",
  );
  assert.equal(
    resolveRole(
      { email: "user@example.com", email_confirmed_at: "2026-10-29" },
      "admin@example.com",
    ),
    "user",
  );
});
test("unverified email and missing configuration fail closed", () => {
  assert.equal(
    resolveRole({ email: "admin@example.com" }, "admin@example.com"),
    "user",
  );
  assert.equal(
    resolveRole(
      { email: "admin@example.com", email_confirmed_at: "2026-10-29" },
      undefined,
    ),
    "user",
  );
  assert.equal(
    resolveRole(
      { email: "admin@example.com", email_confirmed_at: "2026-10-29" },
      " ",
    ),
    "user",
  );
});
