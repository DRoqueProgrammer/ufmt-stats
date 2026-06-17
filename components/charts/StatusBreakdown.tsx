"use client";
import type { Grupo } from "@/lib/types";

/** Visualização focada no status de cada turma.
 *  Separa em 3 grupos: aprovados (≥ cutoff), reprovados (0 < nota < cutoff), zeros.
 *  Mostra a % de aprovados em destaque e um stacked bar embaixo. */
export function StatusBreakdown({ grupos, cutoff = 5 }: { grupos: Grupo[]; cutoff?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {grupos.map((g) => {
        const n = g.notas.length;
        const zeros = g.notas.filter((v) => v === 0).length;
        const reprov = g.notas.filter((v) => v > 0 && v < cutoff).length;
        const aprov = g.notas.filter((v) => v >= cutoff).length;
        const aprovPct = (aprov / n) * 100;
        const reprovPct = (reprov / n) * 100;
        const zerosPct = (zeros / n) * 100;

        return (
          <article
            key={g.id}
            className="bg-white border border-line rounded-[14px] p-4 shadow-sm"
            style={{ borderTop: `4px solid ${g.disciplinaColor}` }}
          >
            <h3
              className="font-serif font-semibold mb-2 text-ink-2"
              style={{ fontSize: "0.95rem", lineHeight: 1.25 }}
            >
              {g.label}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-serif font-semibold"
                style={{ fontSize: "1.7rem", lineHeight: 1, color: "#065f46" }}
              >
                {aprovPct.toFixed(0)}%
              </span>
              <span className="text-xs text-muted">aprovados</span>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                {aprov} aprov
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
                {reprov} reprov
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                {zeros} zeros
              </span>
            </div>

            {/* Stacked bar */}
            <div
              className="h-2 rounded-full overflow-hidden flex"
              style={{ background: "#fee2e2" }}
              title={`${aprov} aprovados · ${reprov} reprovados · ${zeros} zeros`}
            >
              <div
                className="h-full transition-all"
                style={{ width: `${aprovPct}%`, background: "#10b981" }}
              />
              <div
                className="h-full transition-all"
                style={{ width: `${reprovPct}%`, background: "#ef4444" }}
              />
              <div
                className="h-full transition-all"
                style={{ width: `${zerosPct}%`, background: "#f59e0b" }}
              />
            </div>

            <p className="text-[11px] text-muted-2 mt-2 m-0">
              n = {n} alunos · {cutoff.toFixed(1)} = mínimo de aprovação
            </p>
          </article>
        );
      })}
    </div>
  );
}
