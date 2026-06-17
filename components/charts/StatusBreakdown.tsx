"use client";
import type { Grupo } from "@/lib/types";

/** Visualização focada no status de cada turma.
 *  Separa em 3 grupos: aprovados (≥ cutoff), reprovados (0 < nota < cutoff), zeros.
 *  Mostra a % de aprovados em destaque e um stacked bar embaixo.
 *  Status colors reference the semantic tokens (success / danger / warn) from globals.css. */
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
            className="relative bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm"
          >
            {/* Top accent rule — full hairline, not a side-stripe.
                Color encodes the subject discipline (Cálculo I vs VGA). */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-[14px]"
              style={{ background: g.disciplinaColor }}
            />

            <h3
              className="font-serif font-semibold mb-2 text-ink-2"
              style={{ fontSize: "0.95rem", lineHeight: 1.25 }}
            >
              {g.label}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-serif font-semibold text-success tabular-nums"
                style={{ fontSize: "1.7rem", lineHeight: 1 }}
              >
                {aprovPct.toFixed(0)}%
              </span>
              <span className="text-xs text-muted-2">aprovados</span>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success">
                {aprov} aprov
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-danger-soft text-danger">
                {reprov} reprov
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warn-soft text-warn">
                {zeros} zeros
              </span>
            </div>

            {/* Stacked bar — semantic colors with explicit text labels (no color-only) */}
            <div
              className="h-2 rounded-full overflow-hidden flex bg-danger-soft"
              role="img"
              aria-label={`Composição: ${aprov} aprovados, ${reprov} reprovados, ${zeros} zeros`}
            >
              <div
                className="h-full transition-[width] duration-500 ease-out-quint bg-success"
                style={{ width: `${aprovPct}%` }}
              />
              <div
                className="h-full transition-[width] duration-500 ease-out-quint bg-danger"
                style={{ width: `${reprovPct}%` }}
              />
              <div
                className="h-full transition-[width] duration-500 ease-out-quint bg-warn"
                style={{ width: `${zerosPct}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-2 mt-2 m-0 tabular-nums">
              n = {n} alunos · {cutoff.toFixed(1)} = mínimo de aprovação
            </p>
          </article>
        );
      })}
    </div>
  );
}
