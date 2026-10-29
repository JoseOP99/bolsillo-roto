export const money = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
export function monthlyRate(ea: number) {
  if (!Number.isFinite(ea) || ea < 0 || ea > 200)
    throw new Error("La tasa EA debe estar entre 0 y 200%.");
  return Math.expm1(Math.log1p(ea / 100) / 12);
}
export function amortize(
  principal: number,
  ea: number,
  months: number,
  firstDue = "2026-11-15",
) {
  if (
    !Number.isFinite(principal) ||
    principal <= 0 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 120
  )
    throw new Error("Monto o plazo inválido.");
  const base = new Date(firstDue + "T12:00:00Z");
  if (Number.isNaN(base.getTime())) throw new Error("Fecha inválida.");
  const rate = monthlyRate(ea);
  const payment = Math.round(
    (rate === 0
      ? principal / months
      : (principal * rate) / -Math.expm1(-months * Math.log1p(rate))) * 100,
  );
  let balance = Math.round(principal * 100);
  return Array.from({ length: months }, (_, i) => {
    const interest = Math.round(balance * rate);
    const capital =
      i === months - 1 ? balance : Math.min(balance, payment - interest);
    balance -= capital;
    const year = base.getUTCFullYear();
    const month = base.getUTCMonth() + i;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const due = new Date(
      Date.UTC(year, month, Math.min(base.getUTCDate(), lastDay)),
    );
    return {
      installment: i + 1,
      due_date: due.toISOString().slice(0, 10),
      principal: capital / 100,
      interest: interest / 100,
      payment: (capital + interest) / 100,
      balance: balance / 100,
    };
  });
}
