"use client";

import { ArrowLeft } from "lucide-react";
import AuthPanel from "@/components/auth-panel";
import { ProductBrand, ZenubitSignature } from "@/components/brand";
import { ThemeToggle } from "@/components/theme";

export default function AccessPage() {
  return (
    <div className="access-page">
      <header className="access-header">
        <ProductBrand />
        <ThemeToggle />
      </header>
      <main className="access-layout">
        <div className="access-copy">
          <a className="text-link" href="/"><ArrowLeft size={18} /> Volver al inicio</a>
          <h1>Tu bolsillo, a mano.</h1>
          <p>Entra para consultar tus movimientos y organizar tus cuentas.</p>
        </div>
        <AuthPanel onComplete={() => window.location.replace("/")} />
      </main>
      <footer><ZenubitSignature /></footer>
    </div>
  );
}
