import { getGrupos, getTurmas, isDemoMode } from "@/lib/data";
import { isSupabaseEnabled } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";

export default async function AdminOverview() {
  await requireAdmin();
  const grupos = getGrupos(5);
  const turmas = getTurmas();
  const totalNotas = grupos.reduce((a, g) => a + g.notas.length, 0);
  const aprovacaoMedia = grupos.reduce((a, g) => a + g.approval, 0) / grupos.length;

  return (
    <div className="container mx-auto px-6 max-w-[1200px] py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1.5">Visão geral</h1>
          <p className="text-muted m-0">
            {isDemoMode()
              ? "Você está no modo demo — dados lidos de data/seed.json."
              : "Conectado ao Supabase."}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isSupabaseEnabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseEnabled ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isSupabaseEnabled ? "Supabase" : "Demo"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-9">
        {[
          { label: "Turmas", value: turmas.length },
          { label: "Disciplinas", value: grupos.length },
          { label: "Notas armazenadas", value: totalNotas },
          { label: "Aprovação média", value: aprovacaoMedia.toFixed(1).replace(".", ",") + "%" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-line rounded-[14px] p-5 shadow-sm">
            <div className="font-serif text-3xl font-semibold text-ink-2">{kpi.value}</div>
            <div className="text-xs text-muted mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {grupos.map((g) => (
          <Link
            key={g.id}
            href={`/admin/notas?disc=${encodeURIComponent(g.id)}`}
            className="block bg-white border border-line rounded-[14px] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <strong className="block text-base font-semibold text-ink-2">{g.label}</strong>
                <small className="text-muted text-xs">{g.notas.length} alunos · ID: {g.id}</small>
              </div>
              <span className="font-serif text-2xl font-semibold" style={{ color: g.disciplinaColor }}>
                {g.approval.toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-bg rounded p-2"><div className="font-semibold text-ink-2 tabular-nums">{g.stats.mean.toFixed(1)}</div><div className="text-muted">média</div></div>
              <div className="bg-bg rounded p-2"><div className="font-semibold text-ink-2 tabular-nums">{g.stats.median.toFixed(1)}</div><div className="text-muted">mediana</div></div>
              <div className="bg-bg rounded p-2"><div className="font-semibold text-ink-2 tabular-nums">{g.stats.min.toFixed(1)}</div><div className="text-muted">mín</div></div>
              <div className="bg-bg rounded p-2"><div className="font-semibold text-ink-2 tabular-nums">{g.stats.max.toFixed(1)}</div><div className="text-muted">máx</div></div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link href="/admin/notas" className="bg-white border border-line rounded-[14px] p-5 shadow-sm hover:shadow-md transition-all no-underline">
          <h3 className="text-base font-semibold text-ink-2 mb-1">📝 Gerenciar notas</h3>
          <p className="text-muted text-sm m-0">Adicionar, editar ou remover notas dos alunos.</p>
        </Link>
        <Link href="/admin/turmas" className="bg-white border border-line rounded-[14px] p-5 shadow-sm hover:shadow-md transition-all no-underline">
          <h3 className="text-base font-semibold text-ink-2 mb-1">🏫 Turmas &amp; disciplinas</h3>
          <p className="text-muted text-sm m-0">Cadastrar novas turmas ou disciplinas para ampliar a base.</p>
        </Link>
        <Link href="/admin/importar" className="bg-white border border-line rounded-[14px] p-5 shadow-sm hover:shadow-md transition-all no-underline">
          <h3 className="text-base font-semibold text-ink-2 mb-1">📥 Importar CSV</h3>
          <p className="text-muted text-sm m-0">Suba o arquivo Excel/CSV com as notas em massa.</p>
        </Link>
      </div>
    </div>
  );
}
