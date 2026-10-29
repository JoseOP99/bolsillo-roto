"use client";
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { money } from "@/lib/finance";
type Loan = {
  id: string;
  counterparty: string;
  kind: string;
  principal: number;
  due_date: string | null;
  loan_payments: { amount: number }[];
};
export default function Loans({
  db,
  userId,
  notify,
}: {
  db: SupabaseClient | null;
  userId?: string;
  notify: (s: string) => void;
}) {
  const [loans, setLoans] = useState<Loan[]>([]);
  async function load() {
    if (db && userId) {
      const { data, error } = await db
        .from("loans")
        .select("*,loan_payments(amount)")
        .order("created_at", { ascending: false });
      if (error) notify(error.message);
      else setLoans(data || []);
    } else if (!db) {
      try {
        setLoans(JSON.parse(localStorage.getItem("br-loans") || "[]"));
      } catch {
        setLoans([]);
      }
    }
  }
  useEffect(() => {
    void load();
  }, [userId]);
  function local(data: Loan[]) {
    setLoans(data);
    localStorage.setItem("br-loans", JSON.stringify(data));
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget,
      fd = new FormData(el);
    const body = {
      counterparty: String(fd.get("counterparty")).trim(),
      kind: String(fd.get("kind")),
      principal: Number(fd.get("principal")),
      due_date: String(fd.get("due_date")) || null,
    };
    if (
      !body.counterparty ||
      body.principal <= 0 ||
      !Number.isFinite(body.principal)
    )
      return notify("Revisa el nombre y el monto.");
    if (db) {
      if (!userId) return notify("Inicia sesión primero.");
      const { error } = await db
        .from("loans")
        .insert({ ...body, user_id: userId });
      if (error) return notify(error.message);
      await load();
    } else
      local([
        ...loans,
        { ...body, id: crypto.randomUUID(), loan_payments: [] },
      ]);
    el.reset();
    notify("Préstamo registrado.");
  }
  async function pay(e: React.FormEvent<HTMLFormElement>, loan: Loan) {
    e.preventDefault();
    const el = e.currentTarget,
      value = Number(new FormData(el).get("amount"));
    const outstanding =
      Number(loan.principal) -
      loan.loan_payments.reduce((s, p) => s + Number(p.amount), 0);
    if (!Number.isFinite(value) || value <= 0 || value > outstanding)
      return notify("El abono debe ser mayor a cero y no superar el saldo.");
    if (db) {
      const { error } = await db.rpc("pay_loan", {
        p_loan_id: loan.id,
        p_amount: value,
      });
      if (error) return notify(error.message);
      await load();
    } else
      local(
        loans.map((l) =>
          l.id === loan.id
            ? { ...l, loan_payments: [...l.loan_payments, { amount: value }] }
            : l,
        ),
      );
    el.reset();
    notify(
      "Abono registrado. Este registro no mueve dinero entre tus cuentas.",
    );
  }
  return (
    <>
      <div className="account-grid">
        {loans.map((l) => {
          const paid = l.loan_payments.reduce(
              (s, p) => s + Number(p.amount),
              0,
            ),
            remaining = Number(l.principal) - paid;
          return (
            <section className="panel account-card" key={l.id}>
              <span className="eyebrow">
                {l.kind === "receivable" ? "ME DEBEN" : "DEBO"}
              </span>
              <h2>{l.counterparty}</h2>
              <strong>{money(remaining)}</strong>
              <p>Abonado: {money(paid)}</p>
              <small>
                {l.due_date
                  ? `Vence: ${l.due_date}`
                  : "Sin fecha de vencimiento"}
              </small>
              {remaining > 0 && (
                <form
                  onSubmit={(e) => void pay(e, l)}
                  style={{ marginTop: 18 }}
                >
                  <label>
                    Registrar abono
                    <input
                      name="amount"
                      type="number"
                      min=".01"
                      step=".01"
                      max={remaining}
                      required
                    />
                  </label>
                  <button className="button">Guardar abono</button>
                </form>
              )}
            </section>
          );
        })}
      </div>
      <section className="panel">
        <h2>Las cuentas claras, también entre personas</h2>
        <p>
          Registra lo que debes o te deben. Los abonos reducen el saldo del
          préstamo.
        </p>
        <form className="account-form" onSubmit={create}>
          <label>
            Persona o entidad
            <input name="counterparty" maxLength={100} required />
          </label>
          <label>
            Tipo
            <select name="kind">
              <option value="receivable">Me deben</option>
              <option value="payable">Debo</option>
            </select>
          </label>
          <label>
            Monto inicial
            <input
              name="principal"
              type="number"
              min=".01"
              max="1000000000000"
              step=".01"
              required
            />
          </label>
          <label>
            Fecha de vencimiento
            <input name="due_date" type="date" />
          </label>
          <button className="button primary">Registrar préstamo</button>
        </form>
        <p className="hint">
          Registro de capital y abonos. Los intereses de préstamos entre
          personas se acuerdan y registran por separado.
        </p>
      </section>
    </>
  );
}
