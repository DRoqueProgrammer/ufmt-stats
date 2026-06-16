import { getTurmas, getGrupos } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";
import { NovaTurmaForm, NovaDisciplinaForm } from "./Forms";

export default async function TurmasPage() {
  await requireAdmin();
  const turmas = getTurmas();
  const grupos = getGrupos(5);

  return (
    <div className="container mx-auto px-6 max-w-[1200px] py-10">
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-semibold mb-1.5">Turmas &amp; disciplinas</h1>
        <p className="text-muted m-0">Cadastre novas turmas ou disciplinas para ampliar a base de dados. Em modo demo, os formulários apenas validam o payload (sem persistir).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-7">
        {turmas.map((t) => {
          const tgrupos = grupos.filter((g) => g.id.startsWith(t.id + "__"));
          return (
            <div key={t.id} className="bg-white border border-line rounded-[14px] p-5 shadow-sm">
              <header className="mb-3">
                <strong className="block text-lg font-semibold text-ink-2">{t.nome}</strong>
                <small className="text-muted text-xs">{t.ano ? `Ano: ${t.ano}` : "Ano não informado"} · {tgrupos.length} disciplinas</small>
                <p className="text-muted text-sm mt-2 m-0">{t.descricao}</p>
              </header>
              <ul className="space-y-1.5">
                {tgrupos.map((g) => (
                  <li key={g.id} className="flex items-center justify-between bg-bg rounded-md px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.disciplinaColor }} />
                      <strong className="font-semibold text-ink-2">{g.label.replace(t.nome + " · ", "")}</strong>
                      <span className="text-muted text-xs">({g.notas.length} alunos)</span>
                    </span>
                    <span className="tabular-nums font-semibold" style={{ color: g.disciplinaColor }}>{g.approval.toFixed(1).replace(".", ",")}%</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white border border-line rounded-[14px] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink-2 mb-3">+ Nova turma</h2>
          <NovaTurmaForm />
        </section>
        <section className="bg-white border border-line rounded-[14px] p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink-2 mb-3">+ Nova disciplina</h2>
          <NovaDisciplinaForm turmas={turmas} />
        </section>
      </div>
    </div>
  );
}
