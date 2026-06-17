import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { isDemoMode } from "@/lib/data";

export const metadata: Metadata = {
  title: "Análise de Desempenho Acadêmico em Cálculo I e VGA — UFMT",
  description:
    "Estudo comparativo do desempenho acadêmico de duas turmas da UFMT nas disciplinas de Cálculo I e Vetores e Geometria Analítica.",
  openGraph: {
    title: "Análise de Desempenho Acadêmico — UFMT",
    description: "Estudo comparativo de Cálculo I e VGA na Universidade Federal de Mato Grosso.",
    type: "website",
  },
};

// viewport-fit=cover enables env(safe-area-inset-*) on notched phones
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1f3a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Theme bootstrap — runs before React hydrates so there's no
            flash of wrong theme. Reads localStorage first, falls back
            to system preference. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(d?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink-2 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Pular para o conteúdo principal
        </a>
        {isDemoMode() && <DemoBanner />}
        <main id="main">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function DemoBanner() {
  return (
    <div
      role="status"
      className="bg-warn-soft border-b border-warn text-warn text-xs text-center py-1.5 px-4"
      style={{ paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))" }}
    >
      <strong>Modo demo:</strong> lendo dados de <code className="font-mono text-ink-2">data/seed.json</code>.
      Configure <code className="font-mono text-ink-2">NEXT_PUBLIC_SUPABASE_URL</code> para usar o banco real.
    </div>
  );
}
