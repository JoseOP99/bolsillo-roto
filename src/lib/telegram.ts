export function parseExpense(text: string) {
  const match = text
    .trim()
    .match(
      /^(?:gast[eé]\s+)?(\d+(?:[.,]\d{1,2})?)\s*(k|mil)?\s+(?:en\s+)?(.{2,160})$/i,
    );
  if (!match)
    throw new Error(
      "Escribe: gasté 20k en comida. Para pesos completos usa 20000, sin separador de miles.",
    );
  const amount = Number(match[1].replace(",", ".")) * (match[2] ? 1000 : 1);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e12)
    throw new Error("Monto inválido.");
  const description = match[3];
  const category = /comida|mercado|arriendo|bus|salud|internet/i.test(
    description,
  )
    ? "Necesidades"
    : /ahorro|inversi[oó]n/i.test(description)
      ? "Ahorro"
      : "Deseos";
  return {
    amount,
    description,
    category,
    kind: "expense" as const,
    installments: 1,
  };
}
