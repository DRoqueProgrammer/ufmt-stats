import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // Manual class-based dark mode (we apply `.dark` on <html> via the
  // theme script in layout.tsx, not prefers-color-scheme directly, so
  // users can override the system preference via the toggle).
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ===== Brand surface tokens (CSS-var driven) =====
        // Each color is `var(--xxx)` so the .dark override in globals.css
        // propagates automatically. No `oklch(...)` literal in Tailwind —
        // the actual values live in :root and .dark.
        bg: "var(--bg)",
        "bg-alt": "var(--bg-alt)",
        "bg-subtle": "var(--bg-subtle)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        // ===== Brand =====
        primary: {
          DEFAULT: "var(--primary)",
          2: "var(--primary-2)",
          soft: "var(--primary-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
          soft: "var(--accent-soft)",
          "soft-border": "var(--accent-soft-border)",
        },
        // ===== Chart palette (semantic) =====
        x: "var(--x)",
        y: "var(--y)",
        calc: "var(--calc)",
        vga: "var(--vga)",
        // ===== Semantic states (success/error/warn/info) =====
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          soft: "var(--danger-soft)",
        },
        warn: {
          DEFAULT: "var(--warn)",
          soft: "var(--warn-soft)",
        },
        info: {
          DEFAULT: "var(--info)",
          soft: "var(--info-soft)",
        },
        // ===== Footer / dark surface =====
        "on-dark": "var(--on-dark)",
        "on-dark-muted": "var(--on-dark-muted)",
      },
      fontFamily: {
        // Body: IBM Plex Sans — has more character than Inter (open apertures,
        // humanist proportions). Free, ships in 4 weights, pairs cleanly with
        // Lora. Loaded via Google Fonts; weight range trimmed to 400/500/600/700
        // (no 800 — unused, costs bandwidth).
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        // Mono: IBM Plex Mono for code blocks and aluno_id (NotasTable)
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // 5-size scale covers the page; ratio ~1.25 (major third).
        xs: ['0.75rem', { lineHeight: '1.4' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.25rem', { lineHeight: '1.5' }],
        xl: ['1.5625rem', { lineHeight: '1.3' }],
        '2xl': ['1.953rem', { lineHeight: '1.25' }],
        '3xl': ['2.441rem', { lineHeight: '1.15' }],
        display: ['3.052rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        // Academic feel: prefer single soft shadows over stacked heavy ones.
        // Avoids the "elevated SaaS card" look.
        sm: "0 1px 2px oklch(20% 0.04 250 / 0.04)",
        md: "0 2px 8px oklch(20% 0.04 250 / 0.05)",
        lg: "0 4px 16px oklch(20% 0.04 250 / 0.06)",
        // Brand-tinted focus ring for accessibility
        focus: "0 0 0 3px oklch(70% 0.18 35 / 0.35)",
      },
      borderRadius: { sm: "8px", DEFAULT: "14px", lg: "18px" },
    },
  },
  plugins: [],
};
export default config;
