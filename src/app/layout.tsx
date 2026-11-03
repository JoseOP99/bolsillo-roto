import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./experience.css";
import { ThemeProvider } from "@/components/theme";
const themeBootstrap =
  "try{var t=localStorage.getItem('bolsillo-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}";
export const metadata: Metadata = {
  title: "Bolsillo Roto · Tu dinero, bajo control",
  description: "Tus cuentas, gastos y cuotas en un solo lugar.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: { url: "/logo.png", sizes: "any", type: "image/png" },
    apple: "/apple-touch-icon.png",
  },
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
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
