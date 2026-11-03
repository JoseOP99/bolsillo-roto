"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Wallet,
  CreditCard,
  Banknote,
  Plus,
  Check,
} from "lucide-react";
import { ProductBrand, ZenubitSignature } from "./brand";
import { ThemeToggle } from "./theme";
import { useScrollHeader } from "./use-scroll-header";
import SectionReveal from "./section-reveal";
import { amortize, money, monthlyRate } from "@/lib/finance";
export default function Welcome() {
  const [menuOpen, setMenuOpen] = useState(false),
    [principal, setPrincipal] = useState(1200000),
    [rate, setRate] = useState(28.5),
    [months, setMonths] = useState(12);
  const { ref, hidden } = useScrollHeader(menuOpen),
    menu = useRef<HTMLElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const rows = amortize(principal, rate, months),
    interest = rows.reduce((sum, row) => sum + row.interest, 0);
  useEffect(() => {
    if (!menuOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab") {
        const controls = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            "a[href],button:not(:disabled)",
          ) || [],
        ).filter((el) => el.getClientRects().length);
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", keys);
    };
  }, [menuOpen, ref]);
  const links = [
    ["Tu bolsillo", "#tu-bolsillo"],
    ["Cómo funciona", "#como-funciona"],
    ["Cuotas claras", "#cuotas"],
  ];
  return (
    <div className="public-site">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header
        ref={ref}
        className={
          "site-header " +
          (hidden ? "is-hidden " : "") +
          (menuOpen ? "menu-open" : "")
        }
      >
        <div className="site-header-inner">
          <ProductBrand />
          <nav
            ref={menu}
            id="site-menu"
            aria-label="Navegación principal"
            className={menuOpen ? "is-open" : ""}
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a
              className="mobile-login"
              href="/acceso"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión <ArrowRight size={18} />
            </a>
          </nav>
          <div className="site-header-actions">
            <ThemeToggle />
            <a className="button header-login" href="/acceso">
              Iniciar sesión <ArrowUpRight size={17} />
            </a>
            <button
              ref={trigger}
              className="icon-button site-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="contenido" className="public-main" inert={menuOpen}>
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              Organiza tu dinero <em>en un solo lugar.</em>
            </h1>
            <p>
              Registra lo que ganas y gastas, reúne tus cuentas y calcula tus
              cuotas antes de comprar.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="/acceso">
                Iniciar sesión <ArrowRight size={20} />
              </a>
              <a className="text-link" href="/demo">
                Probar la demo <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="hero-product">
            <svg className="hero-trend" viewBox="0 0 240 72" aria-hidden="true">
              <path pathLength="1" d="M2 64 C35 64 38 42 70 46 S111 63 142 29 S189 49 238 4" />
            </svg>
            <div className="hero-preview" data-ui>
              <div className="preview-top">
                <Wallet size={21} />
                <strong>Mi bolsillo</strong>
                <span>Vista de ejemplo</span>
              </div>
              <div className="preview-balance">
                <span>Ingresos registrados</span>
                <strong>{money(5200000)}</strong>
              </div>
              <div className="preview-row">
                <Banknote size={20} />
                <span>
                  Mercado de la semana<small>Necesidades</small>
                </span>
                <b>−{money(186400)}</b>
              </div>
              <div className="preview-row">
                <CreditCard size={20} />
                <span>
                  Spotify Premium<small>Deseos</small>
                </span>
                <b>−{money(16900)}</b>
              </div>
              <a href="/demo" className="preview-link">
                Explorar movimientos <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <SectionReveal
          className="product-overview section-wrap"
          id="tu-bolsillo"
        >
          <div className="section-intro">
            <h2>
              Tu dinero.
              <br />
              <span>Todo junto.</span>
            </h2>
            <p>
              De la cuenta bancaria al efectivo del bolsillo. Registra de dónde
              viene y a dónde va tu dinero sin perder de vista tus tarjetas.
            </p>
          </div>
          <div className="account-showcase" data-ui>
            <div className="account-showcase-header">
              <span>Un espacio para tus cuentas</span>
              <Wallet size={24} />
            </div>
            {[
              {
                Icon: Banknote,
                title: "Efectivo",
                detail: "Lo que llevas contigo",
              },
              {
                Icon: Wallet,
                title: "Cuenta bancaria",
                detail: "Ingresos y gastos del día a día",
              },
              {
                Icon: CreditCard,
                title: "Tarjetas de crédito",
                detail: "Tasas, corte y fechas de pago",
              },
            ].map(({ Icon, title, detail }) => (
              <div className="account-showcase-row" key={title}>
                <Icon size={23} />
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
                <Check size={18} />
              </div>
            ))}
            <a className="showcase-link" href="/acceso">
              <Plus size={18} /> Empieza con tu primera cuenta{" "}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </SectionReveal>
        <SectionReveal className="how-section section-wrap" id="como-funciona">
          <div className="how-heading">
            <h2>
              Pequeños hábitos.
              <br />
              Más claridad.
            </h2>
            <p>
              No necesitas llevar toda tu vida en una hoja de cálculo. Empieza
              por el movimiento de hoy.
            </p>
          </div>
          <div className="how-steps">
            {[
              {
                title: "Registra lo que se mueve.",
                copy: "Anota un ingreso o gasto. Elige el monto, la categoría y la cuenta que usaste.",
              },
              {
                title: "Entiende tus decisiones.",
                copy: "Consulta tus movimientos y revisa cómo se distribuyen entre necesidades, deseos y ahorro.",
              },
              {
                title: "Mira lo que viene.",
                copy: "Organiza compromisos mensuales, préstamos y cuotas para estimar tu saldo al final del mes.",
              },
            ].map((step, i) => (
              <article className="how-step" key={step.title}>
                <span className="step-number">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <a href="/demo" className="text-link">
            Ver cómo se siente en la demo <ArrowRight size={18} />
          </a>
        </SectionReveal>
        <SectionReveal className="installment-section section-wrap" id="cuotas">
          <div className="installment-story">
            <CreditCard size={32} />
            <h2>
              Tus cuotas,
              <br />
              <span>sin enredos.</span>
            </h2>
            <p>
              Una cuota pequeña no siempre significa una compra pequeña. Prueba
              el monto, la tasa y el plazo para ver cuánto pagarías.
            </p>
            <p className="installment-footnote">
              El simulador convierte la tasa efectiva anual a mensual y calcula
              una tabla de amortización. No incluye seguros, comisiones ni
              condiciones particulares del banco.
            </p>
          </div>
          <div className="landing-simulator" data-ui>
            <div className="simulator-top">
              <h3>Simula una compra</h3>
              <span>Ejemplo editable</span>
            </div>
            <label htmlFor="preview-amount">Valor de la compra (COP)</label>
            <input
              id="preview-amount"
              type="number"
              min="1"
              max="1000000000"
              value={principal}
              onChange={(e) =>
                setPrincipal(
                  Math.max(1, Math.min(1e9, Number(e.target.value) || 1)),
                )
              }
            />
            <div className="simulator-fields">
              <label>
                Tasa EA (%)
                <input
                  type="number"
                  min="0"
                  max="200"
                  step=".1"
                  value={rate}
                  onChange={(e) =>
                    setRate(
                      Math.max(0, Math.min(200, Number(e.target.value) || 0)),
                    )
                  }
                />
              </label>
              <label>
                Cuotas
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                >
                  {[1, 3, 6, 12, 18, 24, 36].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "mes" : "meses"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="landing-sim-result">
              <span>Tu cuota mensual estimada</span>
              <strong>{money(rows[0].payment)}</strong>
              <div>
                <span>Intereses totales</span>
                <b>{money(interest)}</b>
              </div>
              <div>
                <span>Tasa mensual</span>
                <b>{(monthlyRate(rate) * 100).toFixed(2)}%</b>
              </div>
            </div>
            <p>No guarda movimientos ni modifica tus cuentas.</p>
          </div>
        </SectionReveal>
        <SectionReveal
          className="questions-section section-wrap"
          id="preguntas"
        >
          <h2>Con las cuentas claras.</h2>
          <div>
            {[
              {
                q: "¿Tengo que conectar mi banco?",
                a: "No. Registras tus cuentas y movimientos manualmente. Bolsillo Roto no realiza pagos ni mueve dinero en tu banco.",
              },
              {
                q: "¿Puedo usarla desde el celular?",
                a: "Sí. La interfaz se adapta al celular y la PWA se puede añadir a la pantalla de inicio en navegadores compatibles. Para guardar o consultar datos reales necesitas conexión.",
              },
              {
                q: "¿Qué hay dentro de la demo?",
                a: "Un espacio con datos ficticios que se guardan solo en ese navegador. Puedes explorar y registrar ejemplos sin escribir en la base real.",
              },
            ].map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <Plus size={20} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </SectionReveal>
        <div className="landing-close section-wrap"><a className="button primary" href="/acceso">Abrir mi cuenta <ArrowRight size={18} /></a></div>
      </main>
      <footer className="public-footer">
        <ProductBrand />
        <span>Un peso a la vez.</span>
        <ZenubitSignature />
      </footer>
      <noscript>
        <p className="no-script-note">
          Puedes leer esta página sin JavaScript. Para iniciar sesión, guardar
          movimientos y usar el simulador, actívalo en tu navegador.
        </p>
      </noscript>
    </div>
  );
}
