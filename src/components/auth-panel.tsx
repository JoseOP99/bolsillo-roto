"use client";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
export default function AuthPanel({ onComplete }: { onComplete?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login"),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setError(
        "El acceso no está disponible en este momento. Puedes explorar la demo.",
      );
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    const fd = new FormData(e.currentTarget),
      credentials = {
        email: String(fd.get("email")).trim(),
        password: String(fd.get("password")),
      };
    try {
      const { data, error } =
        mode === "signup"
          ? await supabase.auth.signUp({
              ...credentials,
              options: { emailRedirectTo: window.location.origin + "/" },
            })
          : await supabase.auth.signInWithPassword(credentials);
      if (error) {
        const messages: Record<string, string> = {
          invalid_credentials:
            "El correo o la contraseña no coinciden. Revisa los datos e intenta otra vez.",
          email_not_confirmed:
            "Confirma tu correo antes de iniciar sesión. Revisa también la carpeta de spam.",
          over_email_send_rate_limit:
            "Se alcanzó el límite de correos. Espera unos minutos e intenta de nuevo.",
          email_address_not_authorized:
            "El servicio de correo del proyecto todavía no permite enviar a esta dirección. Hace falta configurar SMTP.",
        };
        setError(messages[error.code || ""] || error.message);
        return;
      }
      if (mode === "signup" && !data.session)
        setSuccess(
          "Tu cuenta está casi lista. Te enviamos un enlace para confirmar tu correo.",
        );
      else onComplete?.();
    } catch {
      setError("No pudimos conectar. Revisa tu conexión y vuelve a intentar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-panel" data-ui>
      <div className="auth-tabs" aria-label="Acceso a tu cuenta">
        {(["login", "signup"] as const).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={mode === value}
            className={mode === value ? "selected" : ""}
            onClick={() => {
              setMode(value);
              setError("");
              setSuccess("");
            }}
          >
            {value === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <div className="auth-heading">
        <h2>
          {mode === "login" ? "Qué bueno verte." : "Un comienzo más claro."}
        </h2>
        <p>
          {mode === "login"
            ? "Entra a tu espacio y retoma el control."
            : "Crea tu cuenta para organizar tu dinero a tu manera."}
        </p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="auth-email">Correo electrónico</label>
        <div className="auth-input">
          <Mail size={19} />
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            required
            disabled={busy}
          />
        </div>
        <label htmlFor="auth-password">Contraseña</label>
        <div className="auth-input">
          <LockKeyhole size={19} />
          <input
            id="auth-password"
            name="password"
            type={show ? "text" : "password"}
            placeholder={
              mode === "signup" ? "Mínimo 8 caracteres" : "Tu contraseña"
            }
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={mode === "signup" ? 8 : undefined}
            required
            disabled={busy}
          />
          <button
            type="button"
            className="icon-button"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
        {error && (
          <div className="auth-feedback error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="auth-feedback success" role="status">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}
        <button className="button primary auth-submit" disabled={busy}>
          {busy ? (
            <>
              <LoaderCircle className="spin" size={19} />
              Conectando…
            </>
          ) : (
            <>
              {mode === "login" ? "Entrar a mi bolsillo" : "Crear mi cuenta"}
              <ArrowRight size={19} />
            </>
          )}
        </button>
      </form>
      <p className="auth-note">
        Tus cuentas y movimientos se guardan en tu espacio personal.
      </p>
    </div>
  );
}
