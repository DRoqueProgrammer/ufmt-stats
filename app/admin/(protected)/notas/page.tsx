import { getGrupos } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";
import { NotasTable } from "./NotasTable";

type SearchParams = { [k: string]: string | string[] | undefined };

export default async function NotasPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const grupos = getGrupos(5);
  const discId = typeof params.disc === "string" ? params.disc : grupos[0]?.id;
  const selected = grupos.find((g) => g.id === discId) ?? grupos[0];

  if (!selected) {
    return <div className="container mx-auto px-6 max-w-[1200px] py-10 text-muted-2">Nenhuma turma cadastrada.</div>;
  }

  return (
    <div className="container mx-auto px-6 max-w-[1200px] py-10">
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-semibold mb-1.5">Gerenciar notas</h1>
        <p className="text-muted-2 m-0">Visualize, edite ou remova as notas de cada aluno. As alterações refletem em tempo real na página pública.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {grupos.map((g) => (
          <a
            key={g.id}
            href={`/admin/notas?disc=${encodeURIComponent(g.id)}`}
            className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors no-underline ${
              g.id === selected.id
                ? "bg-ink-2 text-bg border-ink-2"
                : "bg-bg-alt text-ink-2 border-line-2 hover:border-accent hover:text-accent"
            }`}
          >
            {g.short}
          </a>
        ))}
      </div>

      <NotasTable
        disciplinaId={selected.id}
        disciplinaLabel={selected.label}
        notasRaw={selected.notasRaw}
        stats={selected.stats}
        approval={selected.approval}
      />
    </div>
  );
}
