"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
    const sync = (e: StorageEvent) => {
      if (e.key === "bolsillo-theme") {
        const value = e.newValue === "dark" ? "dark" : "light";
        document.documentElement.dataset.theme = value;
        setTheme(value);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle() {
    const value = theme === "light" ? "dark" : "light";
    setTheme(value);
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem("bolsillo-theme", value);
    } catch {
      /* Theme still works if storage is unavailable. */
    }
  }
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
      }
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  );
}
