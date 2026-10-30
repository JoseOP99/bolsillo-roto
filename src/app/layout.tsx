import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Bolsillo Roto · Tu dinero, bajo control",
  description: "Tus cuentas, gastos y cuotas en un solo lugar.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Bolsillo Roto" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090e17",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
