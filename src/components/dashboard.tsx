"use client";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Wallet,
  ChartNoAxesCombined,
  KeyRound,
  Bell,
  Plus,
  Search,
  ChevronRight,
  X,
  LogOut,
  Menu,
  Download,
  CircleHelp,
  Smartphone,
  Check,
  Trash2,
  Copy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { amortize, money, monthlyRate } from "@/lib/finance";
import { supabase as liveSupabase } from "@/lib/supabase";
import Loans from "./loans";
import Projection from "./projection";
import { transactionSchema, type TransactionInput } from "@/lib/schemas";
type Account = {
  id: string;
  name: string;
  kind: string;
  opening_balance: number;
  annual_rate: number;
  payment_day: number;
  cutoff_day: number;
  credit_limit: number;
};
type Tx = TransactionInput & { id: string };
const demoAccounts: Account[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Cuenta principal",
    kind: "bank",
    opening_balance: 4850000,
    annual_rate: 0,
    payment_day: 15,
    cutoff_day: 1,
    credit_limit: 0,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Visa · Mi tarjeta",
    kind: "credit",
    opening_balance: 0,
    annual_rate: 28.5,
    payment_day: 15,
    cutoff_day: 28,
    credit_limit: 6000000,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Efectivo",
    kind: "cash",
    opening_balance: 180000,
    annual_rate: 0,
    payment_day: 15,
    cutoff_day: 1,
    credit_limit: 0,
  },
];
const seed: Tx[] = [
  {
    id: "demo-1",
    description: "Nómina de octubre",
    amount: 5200000,
    kind: "income",
    category: "Ahorro",
    account_id: demoAccounts[0].id,
    occurred_on: "2026-10-15",
    installments: 1,
  },
  {
    id: "demo-2",
    description: "Mercado de la semana",
    amount: 186400,
    kind: "expense",
    category: "Necesidades",
    account_id: demoAccounts[0].id,
    occurred_on: "2026-10-27",
    installments: 1,
  },
  {
    id: "demo-3",
    description: "Un café y una buena charla",
    amount: 18500,
    kind: "expense",
    category: "Deseos",
    account_id: demoAccounts[2].id,
    occurred_on: "2026-10-28",
    installments: 1,
  },
  {
    id: "demo-4",
    description: "Spotify Premium",
    amount: 16900,
    kind: "expense",
    category: "Deseos",
    account_id: demoAccounts[1].id,
    occurred_on: "2026-10-26",
    installments: 1,
  },
  {
    id: "demo-5",
    description: "Internet de casa",
    amount: 89900,
    kind: "expense",
    category: "Necesidades",
    account_id: demoAccounts[0].id,
    occurred_on: "2026-10-25",
    installments: 1,
  },
];
const navigation = [
  { label: "Resumen", icon: LayoutDashboard },
  { label: "Movimientos", icon: ArrowDownLeft },
  { label: "Mis cuentas", icon: Wallet },
  { label: "Tarjetas y cuotas", icon: CreditCard },
  { label: "Presupuesto", icon: ChartNoAxesCombined },
  { label: "Préstamos", icon: Wallet },
  { label: "Proyección", icon: ChartNoAxesCombined },
  { label: "Integraciones", icon: KeyRound },
  { label: "Dispositivos", icon: Smartphone },
];
function Line({ coral = false }: { coral?: boolean }) {
  return (
    <svg viewBox="0 0 400 95" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={coral ? "coral" : "mint"}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop stopColor={coral ? "#fa9e8f" : "#65efb0"} stopOpacity=".2" />
          <stop
            offset="1"
            stopColor={coral ? "#fa9e8f" : "#65efb0"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d="M0 76 C35 79 45 48 80 55 S130 85 165 52 S210 58 240 34 S290 51 320 24 S360 30 400 5 L400 95 L0 95Z"
        fill={`url(#${coral ? "coral" : "mint"})`}
      />
      <path
        d="M0 76 C35 79 45 48 80 55 S130 85 165 52 S210 58 240 34 S290 51 320 24 S360 30 400 5"
        fill="none"
        stroke={coral ? "#fa9e8f" : "#65efb0"}
        strokeWidth="3"
      />
    </svg>
  );
}
export default function Dashboard({ demo = false }: { demo?: boolean }) {
  const supabase = demo ? null : liveSupabase;
  const pendingSave = useRef<{ body: string; key: string } | null>(null);
  const [alerts, setAlerts] = useState<
    { id: string; message: string; due_date: string }[]
  >([]);
  const [page, setPage] = useState("Resumen"),
    [mobile, setMobile] = useState(false),
    [txs, setTxs] = useState<Tx[]>([]),
    [accounts, setAccounts] = useState<Account[]>([]),
    [user, setUser] = useState<{ id: string; email?: string } | null>(null),
    [ready, setReady] = useState(false),
    [modal, setModal] = useState(false),
    [toast, setToast] = useState(""),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [amount, setAmount] = useState(1200000),
    [ea, setEa] = useState(28.5),
    [months, setMonths] = useState(12),
    [authOpen, setAuthOpen] = useState(false),
    [keys, setKeys] = useState<{ id: string; name: string; prefix: string }[]>(
      [],
    ),
    [newKey, setNewKey] = useState(""),
    [sessions, setSessions] = useState<
      { session_id: string; label: string; last_seen: string }[]
    >([]);
  const form = useForm<
    z.input<typeof transactionSchema>,
    unknown,
    TransactionInput
  >({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      kind: "expense",
      category: "Necesidades",
      installments: 1,
      occurred_on: new Date().toLocaleDateString("en-CA"),
    },
  });
  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 5000);
  };
  async function load() {
    if (!supabase) return;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);
    if (u) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const deviceResponse = await fetch("/api/v1/devices", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (deviceResponse.status === 401) {
          await supabase.auth.signOut({ scope: "local" });
          notify("La sesión de este dispositivo fue revocada.");
          return;
        }
        if (deviceResponse.ok) setSessions((await deviceResponse.json()).data);
      }
      const allTransactions = async () => {
        const data: Tx[] = [];
        for (let offset = 0; ; offset += 1000) {
          const page = await supabase
            .from("transactions")
            .select("*")
            .order("occurred_on", { ascending: false })
            .order("id")
            .range(offset, offset + 999);
          if (page.error) return { data: null, error: page.error };
          data.push(...(page.data as Tx[]));
          if (page.data.length < 1000) return { data, error: null };
        }
      };
      const [a, t] = await Promise.all([
        supabase.from("accounts").select("*").order("created_at"),
        allTransactions(),
      ]);
      if (a.error || t.error) notify(a.error?.message || t.error!.message);
      else {
        setAccounts(a.data || []);
        setTxs(t.data || []);
      }
    } else {
      setAccounts([]);
      setTxs([]);
    }
  }
  useEffect(() => {
    if (supabase) {
      void load();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        setTimeout(() => void load(), 0);
      });
      setReady(true);
      return () => subscription.unsubscribe();
    } else {
      try {
        const saved = localStorage.getItem("br-demo-v1");
        const data = saved ? JSON.parse(saved) : null;
        setTxs(data?.txs || seed);
        setAccounts(data?.accounts || demoAccounts);
      } catch {
        setTxs(seed);
        setAccounts(demoAccounts);
      }
      setReady(true);
    }
  }, []);
  useEffect(() => {
    if (ready && !supabase)
      localStorage.setItem("br-demo-v1", JSON.stringify({ txs, accounts }));
  }, [txs, accounts, ready]);
  useEffect(() => {
    if (!modal && !authOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    dialog?.querySelector<HTMLInputElement>("input")?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,select,a[href]",
        ),
      );
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [modal, authOpen]);
  useEffect(() => {
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker.register("/sw.js");
    const quick = new URLSearchParams(location.search).get("quick");
    if (quick) {
      form.setValue("kind", quick === "income" ? "income" : "expense");
      setModal(true);
    }
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setModal(true);
      }
      if (e.key === "Escape") {
        setModal(false);
        setAuthOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  const income = txs
      .filter((t) => t.kind === "income")
      .reduce((s, t) => s + Number(t.amount), 0),
    expenses = txs
      .filter((t) => t.kind === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
  const liquid =
    accounts
      .filter((a) => a.kind !== "credit")
      .reduce((s, a) => s + Number(a.opening_balance), 0) +
    txs
      .filter(
        (t) => accounts.find((a) => a.id === t.account_id)?.kind !== "credit",
      )
      .reduce(
        (s, t) => s + (t.kind === "income" ? 1 : -1) * Number(t.amount),
        0,
      );
  const rows = amortize(amount > 0 ? amount : 1, ea, months),
    interest = rows.reduce((s, r) => s + r.interest, 0);
  const visible = txs.filter(
    (t) =>
      (filter === "all" || t.kind === filter) &&
      t.description.toLowerCase().includes(query.toLowerCase()),
  );
  async function save(data: TransactionInput) {
    const account = accounts.find((a) => a.id === data.account_id);
    if (!account) return notify("Selecciona una cuenta válida.");
    if (
      data.installments > 1 &&
      (account.kind !== "credit" || data.kind !== "expense")
    )
      return notify("Las cuotas requieren un gasto con tarjeta de crédito.");
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return notify("Inicia sesión para guardar.");
      const body = JSON.stringify(data);
      if (pendingSave.current?.body !== body)
        pendingSave.current = { body, key: crypto.randomUUID() };
      const res = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          "Idempotency-Key": pendingSave.current.key,
        },
        body,
      });
      const json = await res.json();
      if (!res.ok) return notify(json.error || "No pudimos guardar.");
      await load();
      pendingSave.current = null;
    } else {
      setTxs((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
    }
    setModal(false);
    form.reset();
    notify("Movimiento registrado. Tu bolsillo está al día.");
  }
  async function addAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const fd = new FormData(element);
    const a = {
      name: String(fd.get("name")).trim(),
      kind: String(fd.get("kind")),
      opening_balance: Number(fd.get("balance")),
      annual_rate: Number(fd.get("rate")),
      cutoff_day: Number(fd.get("cutoff")),
      payment_day: Number(fd.get("payment")),
      credit_limit: Number(fd.get("limit")),
    };
    if (
      !a.name ||
      !Number.isFinite(a.opening_balance) ||
      a.annual_rate < 0 ||
      a.annual_rate > 200
    )
      return notify("Revisa los datos de la cuenta.");
    if (supabase) {
      if (!user) return notify("Inicia sesión primero.");
      const { error } = await supabase
        .from("accounts")
        .insert({ ...a, user_id: user.id });
      if (error) return notify(error.message);
      await load();
    } else setAccounts((prev) => [...prev, { ...a, id: crypto.randomUUID() }]);
    notify("Cuenta creada. Ya puedes elegirla al registrar.");
    element.reset();
  }
  async function apiRequest(path: string, method = "GET", body?: unknown) {
    const {
      data: { session },
    } = await supabase!.auth.getSession();
    const res = await fetch(path, {
      method,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error de conexión");
    return json;
  }
  async function refreshKeys() {
    try {
      setKeys((await apiRequest("/api/v1/keys")).data);
    } catch (e) {
      notify((e as Error).message);
    }
  }
  async function createKey() {
    if (!supabase || !user)
      return notify("Las llaves requieren una sesión real de Supabase.");
    try {
      const json = await apiRequest("/api/v1/keys", "POST", {
        name: "Mi integración",
      });
      setNewKey(json.key);
      await refreshKeys();
    } catch (e) {
      notify((e as Error).message);
    }
  }
  async function exportCsv() {
    const content =
      "Fecha,Descripción,Tipo,Categoría,Monto\n" +
      visible
        .map((t) =>
          [
            t.occurred_on,
            '"' +
              t.description.replaceAll('"', '""').replace(/^[=+@-]/, "'$&") +
              '"',
            t.kind,
            t.category,
            t.amount,
          ].join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "bolsillo-roto.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  function go(label: string) {
    setPage(label);
    setMobile(false);
    window.scrollTo({ top: 0 });
    if (label === "Notificaciones" && supabase && user)
      void supabase
        .from("notifications")
        .select("id,message,due_date")
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data, error }) => {
          if (error) notify(error.message);
          else setAlerts(data || []);
        });
    if (label === "Integraciones" && user) void refreshKeys();
    if (label === "Dispositivos" && user)
      void apiRequest("/api/v1/devices")
        .then((j) => setSessions(j.data))
        .catch((e) => notify(e.message));
  }
  const transactionList = (
    <section className="panel transactions">
      <div className="section-head">
        <div>
          <h2>Tu dinero en movimiento</h2>
          <p>Cada movimiento cuenta. Aquí están los tuyos.</p>
        </div>
        <button className="button subtle" onClick={exportCsv}>
          <Download size={16} /> Exportar
        </button>
      </div>
      <div className="table-tools">
        <div className="tabs">
          {[
            ["all", "Todos"],
            ["income", "Ingresos"],
            ["expense", "Gastos"],
          ].map(([v, l]) => (
            <button
              key={v}
              className={filter === v ? "selected" : ""}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Buscar movimientos"
            placeholder="Buscar movimiento…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Movimiento</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {visible.slice(0, page === "Resumen" ? 5 : 500).map((t) => (
              <tr key={t.id}>
                <td>
                  <span
                    className={
                      "tx-icon " +
                      (t.kind === "income" ? "positive" : "negative")
                    }
                  >
                    {t.kind === "income" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </span>
                  <span>
                    <b>{t.description}</b>
                    <small>
                      {accounts.find((a) => a.id === t.account_id)?.name ||
                        "Cuenta"}
                      {t.installments > 1 ? ` · ${t.installments} cuotas` : ""}
                    </small>
                  </span>
                </td>
                <td>
                  <span className="category">{t.category}</span>
                </td>
                <td>
                  {new Date(t.occurred_on + "T12:00:00").toLocaleDateString(
                    "es-CO",
                    { day: "numeric", month: "short" },
                  )}
                </td>
                <td className={t.kind === "income" ? "positive" : ""}>
                  {t.kind === "income" ? "+" : "−"}
                  {money(Number(t.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <div className="empty">
            <Wallet />
            <h3>Aquí empieza tu tranquilidad</h3>
            <p>Crea una cuenta y registra tu primer movimiento.</p>
            <button className="button" onClick={() => go("Mis cuentas")}>
              Crear una cuenta
            </button>
          </div>
        )}
      </div>
    </section>
  );
  const budget = (
    <section className="panel budget">
      <div className="section-head">
        <div>
          <span className="eyebrow">UN LUGAR PARA CADA PESO</span>
          <h2>Tu regla 50 / 30 / 20</h2>
        </div>
        <span className="pill">Este período</span>
      </div>
      {(["Necesidades", "Deseos", "Ahorro"] as const).map((cat, i) => {
        const spent = txs
          .filter((t) => t.kind === "expense" && t.category === cat)
          .reduce((s, t) => s + Number(t.amount), 0);
        const target = income * [0.5, 0.3, 0.2][i];
        return (
          <div className="budget-row" key={cat}>
            <div>
              <span>
                <i
                  style={{ background: ["#6befb1", "#acb8ff", "#f4ba80"][i] }}
                />
                {cat} <small>{[50, 30, 20][i]}%</small>
              </span>
              <b>
                {money(spent)} <small>/ {money(target)}</small>
              </b>
            </div>
            <div className="track">
              <span
                style={{
                  width:
                    Math.min(100, target ? (spent / target) * 100 : 0) + "%",
                  background: ["#6befb1", "#acb8ff", "#f4ba80"][i],
                }}
              />
            </div>
          </div>
        );
      })}
      <p className="hint">
        <CircleHelp size={14} /> La distribución se calcula sobre los ingresos
        registrados.
      </p>
    </section>
  );
  const simulator = (
    <section className="panel simulator">
      <div className="section-head">
        <div>
          <span className="eyebrow">COMPRA CON LOS OJOS ABIERTOS</span>
          <h2>¿Y si lo pago a cuotas?</h2>
        </div>
        <CreditCard className="positive" size={23} />
      </div>
      <label>
        Valor de la compra
        <div className="currency-input">
          <span>$</span>
          <input
            type="number"
            min="1"
            max="1000000000"
            value={amount}
            onChange={(e) =>
              setAmount(Math.max(1, Math.min(1e9, Number(e.target.value))))
            }
          />
          <small>COP</small>
        </div>
      </label>
      <div className="two-fields">
        <label>
          Tasa efectiva anual
          <input
            type="number"
            min="0"
            max="200"
            step="0.1"
            value={ea}
            onChange={(e) =>
              setEa(Math.max(0, Math.min(200, Number(e.target.value))))
            }
          />
        </label>
        <label>
          Cuotas
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          >
            {[1, 3, 6, 12, 18, 24, 36, 48].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "mes" : "meses"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="sim-result">
        <span>Cuota mensual estimada</span>
        <strong>{money(rows[0].payment)}</strong>
        <div>
          <span>Intereses totales</span>
          <b>{money(interest)}</b>
        </div>
        <div>
          <span>Tasa mensual</span>
          <b>{(monthlyRate(ea) * 100).toFixed(2)}%</b>
        </div>
      </div>
      <p className="hint">
        Cuota fija estimada. No incluye seguros, comisiones ni condiciones
        particulares de tu banco.
      </p>
      {page === "Tarjetas y cuotas" && (
        <div className="schedule">
          <table>
            <thead>
              <tr>
                <th>Cuota</th>
                <th>Capital</th>
                <th>Interés</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.installment}>
                  <td>{r.installment}</td>
                  <td>{money(r.principal)}</td>
                  <td>{money(r.interest)}</td>
                  <td>{money(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobile ? "open" : "")}>
        <a href="/" className="brand">
          <img
            src="/logo.png"
            alt=""
            onError={(e) => {
              e.currentTarget.src = "/icon.svg";
            }}
          />
          <span>
            Bolsillo
            <span>
              Roto<span className="brand-dot">.</span>
            </span>
          </span>
        </a>
        <div className="workspace">
          <span className="workspace-icon">
            <Wallet size={18} />
          </span>
          <div>
            Mi espacio personal<small>Un bolsillo, más posibilidades</small>
          </div>
        </div>
        <span className="nav-label">TU DÍA A DÍA</span>
        <nav>
          {navigation.map(({ label, icon: Icon }, i) => (
            <div key={label}>
              {label === "Integraciones" && (
                <span className="nav-label integrations-label">
                  CONECTA TU BOLSILLO
                </span>
              )}
              <button
                className={page === label ? "active" : ""}
                aria-current={page === label ? "page" : undefined}
                onClick={() => go(label)}
              >
                <Icon size={19} />
                {label}
                {page === label && <span className="nav-dot" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={18} />
            <b>
              Pequeños pasos.
              <br />
              Grandes bolsillos.
            </b>
            <p>Conocer tu dinero es el primer paso para cuidarlo.</p>
          </div>
          <button
            className="profile"
            onClick={() =>
              !supabase
                ? notify(
                    "La demo guarda datos locales. Abre la aplicación principal para iniciar sesión.",
                  )
                : user
                  ? void supabase?.auth.signOut({ scope: "local" })
                  : setAuthOpen(true)
            }
          >
            <span className="avatar">
              {user?.email?.slice(0, 2).toUpperCase() || "BR"}
            </span>
            <span>
              {user?.email?.split("@")[0] || "Tu espacio"}
              <small>
                {user
                  ? "Cerrar sesión"
                  : supabase
                    ? "Iniciar sesión"
                    : "Modo demostración"}
              </small>
            </span>
            {user ? <LogOut size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>
      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}
      <div className="main-wrap">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMobile(!mobile)}
            >
              <Menu />
            </button>
            <span>Mi espacio</span>
            <ChevronRight size={14} />
            <b>{page}</b>
          </div>
          <div className="topbar-right">
            <span className="connection">
              <i />
              {user
                ? "Conectado a Supabase"
                : supabase
                  ? "Inicia sesión para comenzar"
                  : "Demostración local"}
            </span>
            <button
              className="icon-button"
              aria-label="Ver notificaciones"
              onClick={() => go("Notificaciones")}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <span className="avatar small">BR</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">TU DINERO, BAJO CONTROL</div>
              <h1>
                {page === "Resumen" ? "Dale un respiro a tu bolsillo." : page}
              </h1>
              <p>
                {page === "Resumen"
                  ? "Menos cuentas en la cabeza. Más claridad para lo que viene."
                  : "Un paso más hacia tu tranquilidad financiera."}
              </p>
            </div>
            <button
              className="button primary"
              onClick={() => {
                form.setValue("account_id", accounts[0]?.id || "");
                setModal(true);
              }}
            >
              <Plus size={19} /> Nuevo movimiento <kbd>⌘ K</kbd>
            </button>
          </div>
          {!user && (
            <div className="demo-banner">
              <span>
                <i />
                {supabase
                  ? "Tu base está conectada. Inicia sesión para usar tus datos."
                  : "Estás explorando con datos de ejemplo. Se guardan solo en este navegador."}
              </span>
              {supabase && (
                <>
                  <a href="/demo" style={{ marginRight: 16 }}>
                    Ver demostración
                  </a>
                  <button onClick={() => setAuthOpen(true)}>
                    Iniciar sesión <ArrowRight size={14} />
                  </button>
                </>
              )}
            </div>
          )}
          {page === "Resumen" && (
            <>
              <div className="stats">
                <section className="stat hero-stat">
                  <div className="stat-label">
                    Saldo disponible <Wallet size={18} />
                  </div>
                  <strong>{money(liquid)}</strong>
                  <div className="stat-foot">
                    <span className="positive">Tu dinero disponible</span>
                    <span>en cuentas y efectivo</span>
                  </div>
                  <Line />
                </section>
                <section className="stat">
                  <div className="stat-label">
                    Ingresos registrados{" "}
                    <span className="metric-icon positive">
                      <ArrowDownLeft size={19} />
                    </span>
                  </div>
                  <strong>{money(income)}</strong>
                  <div className="stat-foot">
                    <span className="positive">Entradas de dinero</span>
                    <span>
                      {txs.filter((t) => t.kind === "income").length}{" "}
                      movimientos
                    </span>
                  </div>
                  <div className="mini-bars">
                    {[24, 42, 32, 56, 41, 67, 50, 80, 68, 90, 72, 100].map(
                      (v, i) => (
                        <i key={i} style={{ height: v + "%" }} />
                      ),
                    )}
                  </div>
                </section>
                <section className="stat">
                  <div className="stat-label">
                    Gastos registrados{" "}
                    <span className="metric-icon negative">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                  <strong>{money(expenses)}</strong>
                  <div className="stat-foot">
                    <span className="negative">Cada peso tiene historia</span>
                    <span>
                      {txs.filter((t) => t.kind === "expense").length}{" "}
                      movimientos
                    </span>
                  </div>
                  <Line coral />
                </section>
              </div>
              <div className="dashboard-grid">
                <div className="left-column">
                  <section className="panel cashflow">
                    <div className="section-head">
                      <div>
                        <h2>El panorama de tu dinero</h2>
                        <p>Lo que entra, lo que sale y lo que puedes cuidar.</p>
                      </div>
                      <span className="pill">
                        <i /> Acumulado
                      </span>
                    </div>
                    <div className="flow-overview">
                      <div>
                        <span>Ingresos menos gastos</span>
                        <strong>{money(income - expenses)}</strong>
                        <small className="positive">
                          {income
                            ? Math.round(((income - expenses) / income) * 100)
                            : 0}
                          % de tus ingresos se quedan contigo
                        </small>
                      </div>
                      <div className="flow-legend">
                        <span>
                          <i /> Ingresos
                        </span>
                        <span>
                          <i /> Gastos
                        </span>
                      </div>
                    </div>
                    <div
                      className="bar-chart"
                      role="img"
                      aria-label={`Ingresos ${money(income)}, gastos ${money(expenses)}. Gráfica por categoría.`}
                    >
                      {["Necesidades", "Deseos", "Ahorro"].map((c, i) => {
                        const v = txs
                          .filter(
                            (t) => t.category === c && t.kind === "expense",
                          )
                          .reduce((s, t) => s + Number(t.amount), 0);
                        return (
                          <div className="bar-group" key={c}>
                            <div className="bars">
                              <div
                                className="bar income"
                                style={{
                                  height: income
                                    ? Math.max(4, [50, 30, 20][i]) + "%"
                                    : "2%",
                                }}
                              />
                              <div
                                className="bar expense"
                                style={{
                                  height: income
                                    ? Math.min(
                                        100,
                                        Math.max(2, (v / income) * 100),
                                      ) + "%"
                                    : "2%",
                                }}
                              />
                            </div>
                            <span>{c}</span>
                          </div>
                        );
                      })}
                      <div className="chart-lines">
                        <span>{money(income)}</span>
                        <span>{money(income / 2)}</span>
                        <span>$0</span>
                      </div>
                    </div>
                  </section>
                  {budget}
                </div>
                <div className="right-column">
                  <section className="brand-card">
                    <div>
                      <span className="eyebrow">UN HÁBITO A LA VEZ</span>
                      <h2>
                        Que tu dinero
                        <br />
                        deje de escaparse.
                      </h2>
                      <p>
                        Registra ese gasto de hoy.
                        <br />
                        Tu yo del futuro te lo agradece.
                      </p>
                      <button onClick={() => setModal(true)}>
                        Registrar un gasto <ArrowRight size={16} />
                      </button>
                    </div>
                    <img
                      src="/logo.png"
                      alt="Bolsillo con monedas y una gráfica de crecimiento"
                      onError={(e) => {
                        e.currentTarget.src = "/icon.svg";
                      }}
                    />
                  </section>
                  {simulator}
                </div>
              </div>
              {transactionList}
            </>
          )}
          {page === "Movimientos" && transactionList}
          {page === "Presupuesto" && budget}
          {page === "Tarjetas y cuotas" && simulator}
          {page === "Préstamos" && (
            <Loans db={supabase} userId={user?.id} notify={notify} />
          )}
          {page === "Proyección" && (
            <Projection
              db={supabase}
              userId={user?.id}
              liquid={liquid}
              notify={notify}
            />
          )}
          {page === "Mis cuentas" && (
            <>
              <div className="account-grid">
                {accounts.map((a) => (
                  <section
                    className={"panel account-card " + a.kind}
                    key={a.id}
                  >
                    <CreditCard size={28} />
                    <h2>{a.name}</h2>
                    <p>
                      {a.kind === "credit"
                        ? "Tarjeta de crédito"
                        : a.kind === "cash"
                          ? "Efectivo"
                          : "Cuenta bancaria"}
                    </p>
                    <strong>
                      {money(
                        Number(a.opening_balance) +
                          txs
                            .filter((t) => t.account_id === a.id)
                            .reduce(
                              (s, t) =>
                                s +
                                (t.kind === "income" ? 1 : -1) *
                                  Number(t.amount),
                              0,
                            ),
                      )}
                    </strong>
                    {a.kind === "credit" && (
                      <small>
                        EA {a.annual_rate}% · Corte {a.cutoff_day} · Pago{" "}
                        {a.payment_day}
                      </small>
                    )}
                  </section>
                ))}
              </div>
              <section className="panel">
                <h2>Una nueva cuenta, todo en un lugar</h2>
                <form className="account-form" onSubmit={addAccount}>
                  <label>
                    Nombre
                    <input
                      name="name"
                      required
                      maxLength={60}
                      placeholder="Ej. Mi cuenta de ahorros"
                    />
                  </label>
                  <label>
                    Tipo
                    <select name="kind">
                      <option value="bank">Cuenta bancaria</option>
                      <option value="cash">Efectivo</option>
                      <option value="credit">Tarjeta de crédito</option>
                    </select>
                  </label>
                  <label>
                    Saldo inicial
                    <input
                      name="balance"
                      type="number"
                      step=".01"
                      defaultValue="0"
                      required
                    />
                  </label>
                  <label>
                    Tasa EA (%)
                    <input
                      name="rate"
                      type="number"
                      min="0"
                      max="200"
                      step=".01"
                      defaultValue="0"
                    />
                  </label>
                  <label>
                    Día de corte
                    <input
                      name="cutoff"
                      type="number"
                      min="1"
                      max="31"
                      defaultValue="28"
                    />
                  </label>
                  <label>
                    Día de pago
                    <input
                      name="payment"
                      type="number"
                      min="1"
                      max="31"
                      defaultValue="15"
                    />
                  </label>
                  <label>
                    Cupo de crédito
                    <input
                      name="limit"
                      type="number"
                      min="0"
                      defaultValue="0"
                    />
                  </label>
                  <button className="button primary">Crear cuenta</button>
                </form>
                <p className="hint">
                  Solo guardamos el alias y las condiciones. Nunca el número de
                  tarjeta ni el CVV.
                </p>
              </section>
            </>
          )}
          {page === "Integraciones" && (
            <section className="panel integrations">
              <span className="eyebrow">TU BOLSILLO, CONECTADO</span>
              <h2>Una API para tus propias ideas</h2>
              <p>
                Conecta AppSheet, Make o tus scripts mediante una llave privada.
              </p>
              <div className="code-block">
                <code>
                  POST /api/v1/gastos
                  <br />
                  Authorization: Bearer br_…
                  <br />
                  Content-Type: application/json
                </code>
              </div>
              <button className="button primary" onClick={createKey}>
                <KeyRound size={17} /> Generar API Key
              </button>
              {newKey && (
                <div className="key-reveal">
                  <strong>Copia esta llave. Solo se muestra ahora.</strong>
                  <code>{newKey}</code>
                  <button
                    className="button"
                    onClick={() =>
                      void navigator.clipboard
                        .writeText(newKey)
                        .then(() => notify("Llave copiada"))
                    }
                  >
                    <Copy size={16} /> Copiar
                  </button>
                  <button className="button" onClick={() => setNewKey("")}>
                    Ocultar
                  </button>
                </div>
              )}
              {keys.map((k) => (
                <div className="key-row" key={k.id}>
                  <span>
                    {k.name} <code>{k.prefix}…</code>
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Revocar llave"
                    onClick={() =>
                      void apiRequest("/api/v1/keys", "DELETE", { id: k.id })
                        .then(() => refreshKeys())
                        .catch((e) => notify(e.message))
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <p className="hint">
                Las llaves se almacenan como hash SHA-256. Puedes revocarlas en
                cualquier momento.
              </p>
            </section>
          )}
          {page === "Dispositivos" && (
            <section className="panel">
              <h2>Tú decides dónde está tu sesión</h2>
              <p>
                Sesiones verificadas por el servidor. Revocar bloquea las
                próximas peticiones a la API de la app.
              </p>
              {sessions.map((s) => (
                <div className="key-row" key={s.session_id}>
                  <Smartphone />
                  <span>
                    {s.label}
                    <small>
                      {new Date(s.last_seen).toLocaleString("es-CO")}
                    </small>
                  </span>
                  <button
                    className="button"
                    onClick={() =>
                      void apiRequest("/api/v1/devices", "DELETE", {
                        id: s.session_id,
                      })
                        .then(() =>
                          setSessions((prev) =>
                            prev.filter((x) => x.session_id !== s.session_id),
                          ),
                        )
                        .catch((e) => notify(e.message))
                    }
                  >
                    Revocar
                  </button>
                </div>
              ))}
              {!sessions.length && (
                <p className="empty">
                  Inicia sesión y registra un movimiento para ver tu
                  dispositivo.
                </p>
              )}
            </section>
          )}
          {page === "Notificaciones" && (
            <section className="panel">
              <h2>Fechas que vale la pena recordar</h2>
              {alerts.map((alert) => (
                <div className="key-row" key={alert.id}>
                  <Bell size={19} />
                  <span>
                    <b>{alert.message}</b>
                    <small>{alert.due_date}</small>
                  </span>
                </div>
              ))}
              {accounts
                .filter((a) => a.kind === "credit")
                .map((a) => (
                  <div className="key-row" key={a.id}>
                    <Bell size={19} />
                    <span>
                      <b>{a.name}</b>
                      <small>
                        Corte: día {a.cutoff_day} · Pago: día {a.payment_day} de
                        cada mes
                      </small>
                    </span>
                  </div>
                ))}
              <p className="hint">
                Las alertas externas por email, Telegram y push requieren
                configurar los proveedores. No están activadas.
              </p>
            </section>
          )}
          <footer>
            <span>
              Bolsillo Roto © {new Date().getFullYear()} · Un peso a la vez.
            </span>
            <a href="https://zenubit.com" target="_blank" rel="noreferrer">
              Creado por <b>Zenubit</b> <ArrowUpRight size={13} />
            </a>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-head">
              <div>
                <span className="eyebrow">UNOS SEGUNDOS, MÁS CLARIDAD</span>
                <h2 id="modal-title">Nuevo movimiento</h2>
              </div>
              <button
                className="icon-button"
                aria-label="Cerrar"
                onClick={() => setModal(false)}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={form.handleSubmit((data) =>
                save(data).catch(() =>
                  notify(
                    "No se pudo guardar. Revisa la conexión y vuelve a intentar.",
                  ),
                ),
              )}
            >
              <label>
                Tipo
                <select {...form.register("kind")}>
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </label>
              <label>
                ¿En qué se movió tu dinero?
                <input
                  autoFocus
                  placeholder="Ej. Almuerzo con amigos"
                  {...form.register("description")}
                />
              </label>
              <label>
                Monto en pesos
                <input
                  type="number"
                  min=".01"
                  step=".01"
                  {...form.register("amount", { valueAsNumber: true })}
                />
              </label>
              <label>
                Cuenta o tarjeta
                <select {...form.register("account_id")}>
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setModal(false);
                  go("Mis cuentas");
                }}
              >
                + Crear una cuenta o tarjeta
              </button>
              <div className="two-fields">
                <label>
                  Categoría
                  <select {...form.register("category")}>
                    <option>Necesidades</option>
                    <option>Deseos</option>
                    <option>Ahorro</option>
                  </select>
                </label>
                <label>
                  Fecha
                  <input type="date" {...form.register("occurred_on")} />
                </label>
              </div>
              <label>
                Número de cuotas
                <input
                  type="number"
                  min="1"
                  max="120"
                  {...form.register("installments", { valueAsNumber: true })}
                />
              </label>
              {Object.entries(form.formState.errors).map(([k, e]) => (
                <p className="error" role="alert" key={k}>
                  {k}: {e.message}
                </p>
              ))}
              <button
                disabled={form.formState.isSubmitting}
                className="button primary full"
              >
                {form.formState.isSubmitting
                  ? "Guardando…"
                  : "Guardar movimiento"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>
          </section>
        </div>
      )}
      {authOpen && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <div className="section-head">
              <h2 id="auth-title">Bienvenido a tu bolsillo</h2>
              <button
                className="icon-button"
                aria-label="Cerrar"
                onClick={() => setAuthOpen(false)}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const method =
                  (e.nativeEvent as SubmitEvent).submitter?.getAttribute(
                    "value",
                  ) === "signup"
                    ? "signUp"
                    : "signInWithPassword";
                const { error } = await supabase!.auth[method]({
                  email: String(fd.get("email")),
                  password: String(fd.get("password")),
                });
                if (error) notify(error.message);
                else {
                  notify(
                    method === "signUp"
                      ? "Revisa tu correo para confirmar tu cuenta."
                      : "Sesión iniciada.",
                  );
                  setAuthOpen(false);
                }
              }}
            >
              <label>
                Correo
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                />
              </label>
              <button
                name="action"
                value="login"
                className="button primary full"
              >
                Iniciar sesión
              </button>
              <button name="action" value="signup" className="button full">
                Crear cuenta
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
