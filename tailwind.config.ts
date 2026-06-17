import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Brand surface tokens (OKLCH, brand-tinted neutrals) =====
        // Neutrals lean toward navy (hue 250) so the bg feels
        // academic/cool without going monochrome. Accent (hue 30) is for
        // emphasis only.
        bg: "oklch(98.2% 0.006 250)",          // app body — was #f6f7fb (dead gray)
        "bg-alt": "oklch(100% 0 0)",           // cards / surfaces — keep true white
        "bg-subtle": "oklch(96.8% 0.008 250)", // zebra row in tables
        ink: "oklch(20% 0.04 250)",            // body text — was #0f1f3a
        "ink-2": "oklch(26% 0.05 250)",        // display text — was #1a2a4a
        muted: "oklch(48% 0.022 250)",         // body-secondary — bumped chroma for AA
        "muted-2": "oklch(58% 0.02 250)",      // captions — was #8390a8 (fails AA)
        line: "oklch(91% 0.012 250)",          // hairline borders — was #e6e9f1
        "line-2": "oklch(85% 0.015 250)",     // emphasized borders — was #d8dde8
        // ===== Brand (already committed) =====
        primary: {
          DEFAULT: "oklch(35% 0.08 250)",      // was #1a3a5c
          2: "oklch(42% 0.085 250)",           // was #244a73
          soft: "oklch(94% 0.025 250)",        // was #e6edf6
        },
        accent: {
          DEFAULT: "oklch(70% 0.18 35)",       // was #ff6b3d
          2: "oklch(76% 0.15 35)",             // was #ff8c66
          soft: "oklch(96% 0.04 35)",          // was #fff1ec
          "soft-border": "oklch(89% 0.06 35)", // was #ffd9c8 (arbitrary)
        },
        // ===== Chart palette (semantic) =====
        x: "oklch(35% 0.08 250)",              // turma X = primary
        y: "oklch(48% 0.16 295)",              // turma Y = purple (was #6b46c1)
        calc: "oklch(70% 0.18 35)",            // Cálculo I = accent
        vga: "oklch(64% 0.13 185)",            // VGA = teal (was #14b8a6)
        // ===== Semantic states (success/error/warn/info) =====
        success: {
          DEFAULT: "oklch(58% 0.14 155)",
          soft: "oklch(95% 0.04 155)",
        },
        danger: {
          DEFAULT: "oklch(58% 0.18 25)",
          soft: "oklch(95% 0.05 25)",
        },
        warn: {
          DEFAULT: "oklch(75% 0.15 75)",
          soft: "oklch(96% 0.05 75)",
        },
        info: {
          DEFAULT: "oklch(60% 0.13 230)",
          soft: "oklch(95% 0.03 230)",
        },
        // ===== Footer / dark surface =====
        "on-dark": "oklch(82% 0.02 250)",      // footer body text
        "on-dark-muted": "oklch(65% 0.025 250)",// was arbitrary #8c9bb6
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
        // xs  = 12px  (caption / legal)
        // sm  = 14px  (secondary UI, metadata)
        // base = 16px (body — never below this)
        // lg  = 20px  (subheading / lead)
        // xl  = 25px  (h3)
        // 2xl = 31px  (h2)
        // 3xl = 39px  (h1)
        // display = 49px (hero, fluid via clamp in component)
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
        // Adjusted alpha for OKLCH perception — softer, less "cardstock"
        sm: "0 1px 2px oklch(20% 0.04 250 / 0.05)",
        md: "0 4px 12px oklch(20% 0.04 250 / 0.06), 0 2px 4px oklch(20% 0.04 250 / 0.04)",
        lg: "0 16px 40px oklch(20% 0.04 250 / 0.10), 0 4px 10px oklch(20% 0.04 250 / 0.05)",
        // Brand-tinted focus ring for accessibility
        focus: "0 0 0 3px oklch(70% 0.18 35 / 0.35)",
      },
      borderRadius: { sm: "8px", DEFAULT: "14px", lg: "22px" },
    },
  },
  plugins: [],
};
export default config;
