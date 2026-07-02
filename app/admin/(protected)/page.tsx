import { getGrupos, getTurmas, isDemoMode } from "@/lib/data";
import { isSupabaseEnabled } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminOverview() {
  await requireAdmin();
  const grupos = await getGrupos(5);
  const turmas = await getTurmas();
  const totalNotas = grupos.reduce((a, g) => a + g.notas.length, 0);
  const aprovacaoMedia = grupos.reduce((a, g) => a + g.approval, 0) / grupos.length;

  return (
    <div className="container mx-auto px-6 max-w-[1200px] py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1.5 text-ink-2">Visão geral</h1>
          <p className="text-muted-2 m-0">
            {isDemoMode()
              ? "Você está no modo demo — dados lidos de data/seed.json."
              : "Conectado ao Supabase."}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isSupabaseEnabled ? "bg-success-soft text-success" : "bg-warn-soft text-warn"
          }`}
        >
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseEnabled ? "bg-success" : "bg-warn"
            }`}
          />
          {isSupabaseEnabled ? "Supabase" : "Demo"}
        </span>
      </div>

      {/* KPI grid — varied: Aprovação média is the headline finding, so it
          gets a larger surface. The other 3 are condensed into a smaller grid. */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 mb-9">
        <div className="bg-primary-soft border border-line rounded-[14px] p-6 shadow-sm relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[3px] bg-accent" />
          <div className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">
            Aprovação média
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-semibold text-6xl text-ink-2 leading-none tabular-nums">
              {aprovacaoMedia.toFixed(1).replace(".", ",")}
            </span>
            <span className="font-serif text-2xl text-accent">%</span>
          </div>
          <p className="text-ink-2 m-0 mt-3 text-sm">
            Em <strong className="tabular-nums">{grupos.length}</strong>{" "}
            combinações de turma &amp; disciplina, nenhuma ultrapassa{" "}
            <strong className="tabular-nums">{(aprovacaoMedia * 1.3).toFixed(0)}%</strong>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Turmas", value: turmas.length },
            { label: "Disciplinas", value: grupos.length },
            { label: "Notas", value: totalNotas.toLocaleString("pt-BR") },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm"
            >
              <div className="font-serif text-2xl font-semibold text-ink-2 leading-none tabular-nums">
                {kpi.value}
              </div>
              <div className="text-xs text-muted-2 mt-1.5 font-medium uppercase tracking-wide">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {grupos.map((g) => (
          <Link
            key={g.id}
            href={`/admin/notas?disc=${encodeURIComponent(g.id)}`}
            className="block bg-bg-alt border border-line rounded-[14px] p-5 shadow-sm hover:border-line-2 transition-colors no-underline"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <strong className="block text-base font-semibold text-ink-2">{g.label}</strong>
                <small className="text-muted-2 text-xs">
                  <span className="tabular-nums">{g.notas.length}</span> alunos · ID: {g.id}
                </small>
              </div>
              <span
                className="font-serif text-2xl font-semibold tabular-nums"
                style={{ color: g.disciplinaColor }}
              >
                {g.approval.toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-bg rounded p-2">
                <div className="font-semibold text-ink-2 tabular-nums">
                  {g.stats.mean.toFixed(1)}
                </div>
                <div className="text-muted-2">média</div>
              </div>
              <div className="bg-bg rounded p-2">
                <div className="font-semibold text-ink-2 tabular-nums">
                  {g.stats.median.toFixed(1)}
                </div>
                <div className="text-muted-2">mediana</div>
              </div>
              <div className="bg-bg rounded p-2">
                <div className="font-semibold text-ink-2 tabular-nums">
                  {g.stats.min.toFixed(1)}
                </div>
                <div className="text-muted-2">mín</div>
              </div>
              <div className="bg-bg rounded p-2">
                <div className="font-semibold text-ink-2 tabular-nums">
                  {g.stats.max.toFixed(1)}
                </div>
                <div className="text-muted-2">máx</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Action cards — varied layout: primary CTA (notas) gets prominence,
          the other two are condensed side-by-side. Replaces 3 identical cards. */}
      <div className="mt-8 grid md:grid-cols-[1.5fr_1fr] gap-4">
        <Link
          href="/admin/notas"
          className="group relative bg-primary text-bg border border-primary rounded-[14px] p-6 shadow-sm hover:bg-primary-2 transition-colors no-underline overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4 relative">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-bg opacity-70 mb-2">
                Ação mais comum
              </div>
              <h3 className="font-serif text-2xl font-semibold m-0 text-bg">
                Gerenciar notas
              </h3>
              <p className="text-bg opacity-75 text-sm mt-2 m-0">
                Adicionar, editar ou remover notas. Filtros por aprovado/reprovado.
              </p>
            </div>
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-accent flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
        </Link>

        <div className="grid grid-rows-2 gap-3">
          <Link
            href="/admin/turmas"
            className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm hover:border-line-2 transition-colors no-underline flex items-start gap-3"
          >
            <span aria-hidden="true" className="w-8 h-8 rounded-md bg-primary-soft text-primary grid place-items-center flex-shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M9 22V12h6v10" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink-2 m-0">Turmas &amp; disciplinas</h3>
              <p className="text-muted-2 text-xs m-0 mt-1">Cadastrar novas turmas.</p>
            </div>
          </Link>
          <Link
            href="/admin/importar"
            className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm hover:border-line-2 transition-colors no-underline flex items-start gap-3"
          >
            <span aria-hidden="true" className="w-8 h-8 rounded-md bg-accent-soft text-accent grid place-items-center flex-shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink-2 m-0">Importar CSV</h3>
              <p className="text-muted-2 text-xs m-0 mt-1">Subir planilha em massa.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
