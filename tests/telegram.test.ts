import test from "node:test";
import assert from "node:assert/strict";
import { parseExpense } from "../src/lib/telegram";
test("Telegram recognizes Colombian shorthand without guessing account", () => {
  assert.equal(parseExpense("Gasté 20k en comida").amount, 20000);
  assert.equal(parseExpense("20,5 mil en mercado").amount, 20500);
  assert.equal(parseExpense("20000 comida").category, "Necesidades");
});
test("ambiguous or invalid messages fail instead of creating wrong amounts", () => {
  assert.throws(() => parseExpense("20.000 comida"));
  assert.throws(() => parseExpense("comida"));
  assert.throws(() => parseExpense("0 en comida"));
});
