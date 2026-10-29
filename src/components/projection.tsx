"use client";
import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { money } from "@/lib/finance";
type Recurring = {
  id: string;
  name: string;
  kind: string;
  amount: number;
  day: number;
};
export default function Projection({
  db,
  userId,
  liquid,
  notify,
}: {
  db: SupabaseClient | null;
  userId?: string;
  liquid: number;
  notify: (s: string) => void;
}) {
  const [items, setItems] = useState<Recurring[]>([]),
    [quotas, setQuotas] = useState(0);
  const today = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Bogota",
      day: "numeric",
    }).format(new Date()),
  );
  async function load() {
    if (db && userId) {
      const now = new Date(),
        start = new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Bogota",
        }).format(now),
        end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
          .toISOString()
          .slice(0, 10);
      const [a, b] = await Promise.all([
        db.from("recurring_entries").select("*"),
        db
          .from("amortizations")
          .select("payment")
          .is("paid_at", null)
          .gte("due_date", start)
          .lte("due_date", end),
      ]);
      if (a.error || b.error) notify(a.error?.message || b.error!.message);
      else {
        setItems(a.data || []);
        setQuotas((b.data || []).reduce((s, r) => s + Number(r.payment), 0));
      }
    } else if (!db) {
      try {
        setItems(JSON.parse(localStorage.getItem("br-recurring") || "[]"));
      } catch {
        setItems([]);
      }
    }
  }
  useEffect(() => {
    void load();
  }, [userId]);
  const remaining = items.filter((i) => i.day > today),
    income = remaining
      .filter((i) => i.kind === "income")
      .reduce((s, i) => s + Number(i.amount), 0),
    expense = remaining
      .filter((i) => i.kind === "expense")
      .reduce((s, i) => s + Number(i.amount), 0);
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget,
      fd = new FormData(el),
      body = {
        name: String(fd.get("name")),
        kind: String(fd.get("kind")),
        amount: Number(fd.get("amount")),
        day: Number(fd.get("day")),
      };
    if (db) {
      if (!userId) return notify("Inicia sesión primero.");
      const { error } = await db
        .from("recurring_entries")
        .insert({ ...body, user_id: userId });
      if (error) return notify(error.message);
      await load();
    } else {
      const data = [...items, { ...body, id: crypto.randomUUID() }];
      setItems(data);
      localStorage.setItem("br-recurring", JSON.stringify(data));
    }
    el.reset();
    notify("Compromiso mensual creado.");
  }
  async function remove(id: string) {
    if (db) {
      const { error } = await db
        .from("recurring_entries")
        .delete()
        .eq("id", id);
      if (error) return notify(error.message);
      await load();
    } else {
      const data = items.filter((i) => i.id !== id);
      setItems(data);
      localStorage.setItem("br-recurring", JSON.stringify(data));
    }
  }
  return (
    <>
      <div className="stats">
        <section className="stat hero-stat">
          <div className="stat-label">Saldo estimado a fin de mes</div>
          <strong>{money(liquid + income - expense - quotas)}</strong>
          <p className="hint">
            Saldo actual + ingresos futuros − gastos fijos − cuotas pendientes
          </p>
        </section>
        <section className="stat">
          <div className="stat-label">Ingresos futuros</div>
          <strong className="positive">{money(income)}</strong>
          <p className="hint">Compromisos con día posterior a hoy</p>
        </section>
        <section className="stat">
          <div className="stat-label">Gastos y cuotas por venir</div>
          <strong>{money(expense + quotas)}</strong>
          <p className="hint">Una estimación, no un saldo bancario</p>
        </section>
      </div>
      <section className="panel">
        <h2>Lo que viene cada mes</h2>
        <p>
          Agrega tu nómina futura y tus gastos fijos. No genera transacciones
          automáticamente.
        </p>
        {items.map((i) => (
          <div className="key-row" key={i.id}>
            <span>
              <b>{i.name}</b>
              <small>
                Día {i.day} · {i.kind === "income" ? "Ingreso" : "Gasto"}
              </small>
            </span>
            <strong>{money(Number(i.amount))}</strong>
            <button className="button subtle" onClick={() => void remove(i.id)}>
              Eliminar
            </button>
          </div>
        ))}
        <form className="account-form" onSubmit={create}>
          <label>
            Nombre
            <input name="name" required maxLength={100} />
          </label>
          <label>
            Tipo
            <select name="kind">
              <option value="expense">Gasto fijo</option>
              <option value="income">Ingreso fijo</option>
            </select>
          </label>
          <label>
            Monto
            <input
              name="amount"
              type="number"
              min=".01"
              max="1000000000000"
              step=".01"
              required
            />
          </label>
          <label>
            Día del mes
            <input
              name="day"
              type="number"
              min="1"
              max="28"
              defaultValue="15"
              required
            />
          </label>
          <button className="button primary">Agregar compromiso</button>
        </form>
        <p className="hint">
          Los compromisos del día de hoy se excluyen para evitar duplicarlos con
          movimientos ya registrados. Verifica los pagos adelantados
          manualmente.
        </p>
      </section>
    </>
  );
}
