"use client";

import { useEffect, useState } from "react";

/** Theme toggle. Renders a sun (light active) or moon (dark active) button.
 *  - On mount, syncs state with the class on <html> (set by the inline
 *    bootstrap script in layout.tsx).
 *  - On click, toggles the `.dark` class, persists to localStorage, and
 *    updates the `color-scheme` so native UI (scrollbars, form controls)
 *    matches.
 *  - Listens to system preference changes ONLY if the user has not made a
 *    manual choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Mount: read current state from <html>
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  // Listen to system preference changes when the user hasn't picked manually.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return; // user override — don't change
      const next = e.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private mode / quota — ignore
    }
  };

  // Avoid SSR/hydration mismatch: render placeholder until mounted.
  if (theme === null) {
    return (
      <span
        aria-hidden="true"
        className="min-h-[36px] min-w-[36px] inline-block"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Tema escuro ativo" : "Tema claro ativo"}
      className="min-h-[36px] min-w-[36px] grid place-items-center rounded-md text-ink-2 hover:text-accent hover:bg-bg-subtle transition-colors"
    >
      {theme === "dark" ? (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
