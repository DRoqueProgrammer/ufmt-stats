import type { Metadata } from "next";
import "./globals.css";
import { isDemoMode } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {isDemoMode() && <DemoBanner />}
        {children}
        <Analytics />
      </body>
    </html>
  );
}

function DemoBanner() {
  return (
    <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-xs text-center py-1.5 px-4">
      <strong>Modo demo:</strong> lendo dados de <code className="font-mono">data/seed.json</code>.
      Configure <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> para usar o banco real.
    </div>
  );
}
