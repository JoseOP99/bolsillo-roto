import test from "node:test";
import assert from "node:assert/strict";
import { amortize, monthlyRate } from "../src/lib/finance";
test("EA to TEM compounds back to original rate", () =>
  assert.ok(Math.abs((1 + monthlyRate(28.5)) ** 12 - 1.285) < 1e-10));
test("schedule conserves principal and finishes at zero", () => {
  for (const ea of [0, 28.5, 200]) {
    const rows = amortize(3000000, ea, 36, "2027-01-31");
    assert.equal(rows.at(-1)!.balance, 0);
    assert.ok(
      Math.abs(rows.reduce((s, r) => s + r.principal, 0) - 3000000) < 0.01,
    );
    assert.equal(rows[1].due_date, "2027-02-28");
  }
});
test("rejects invalid financial input", () => {
  assert.throws(() => amortize(-1, 20, 12));
  assert.throws(() => amortize(100, 20, 0));
  assert.throws(() => monthlyRate(NaN));
});
