import { ImportClient } from "./ImportClient";
import { getGrupos } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function ImportarPage() {
  await requireAdmin();
  const grupos = await getGrupos(5);
  return (
    <div className="container mx-auto px-6 max-w-[1100px] py-10">
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-semibold mb-1.5">Importar CSV / XLSX</h1>
        <p className="text-muted-2 m-0">
          Suba a planilha com as notas no mesmo formato do arquivo original. O parser detecta automaticamente as colunas.
        </p>
      </div>
      <ImportClient grupos={grupos.map((g) => ({ id: g.id, label: g.label }))} />
    </div>
  );
}
