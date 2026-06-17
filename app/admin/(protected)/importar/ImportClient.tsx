"use client";
import { useState, useTransition } from "react";

type Grupo = { id: string; label: string };

export function ImportClient({ grupos }: { grupos: Grupo[] }) {
  const [csv, setCsv] = useState("");
  const [targetDisc, setTargetDisc] = useState(grupos[0]?.id ?? "");
  const [parsed, setParsed] = useState<{ aluno_id: string; nota: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [imported, setImported] = useState<number | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    const text = await file.text();
    setCsv(text);
    parseCSV(text);
  };

  const parseCSV = (text: string) => {
    setParsed([]);
    setError(null);
    try {
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 3) {
        setError("Planilha vazia ou formato inválido.");
        return;
      }
      // Tenta identificar a coluna de destino. Estratégia:
      // 1) Se o usuário escolheu uma disciplina, usa a coluna correspondente:
      //    X·Cálc I = col 0, X·VGA = col 1, Y·Cálc I = col 2, Y·VGA = col 3
      // 2) Caso contrário, usa a primeira coluna com header "Cálculo I" ou "VGA"
      const header = lines[1].split(/\t|,|;/).map((c) => c.trim().toLowerCase());
      const targetIdx = resolveTargetIdx(targetDisc);
      if (targetIdx == null || targetIdx >= header.length) {
        setError("Não foi possível identificar a coluna da disciplina selecionada.");
        return;
      }
      const dataLines = lines.slice(2);
      const records: { aluno_id: string; nota: number }[] = [];
      dataLines.forEach((line, i) => {
        const cells = line.split(/\t|,|;/).map((c) => c.trim());
        const raw = cells[targetIdx];
        if (raw == null || raw === "") return;
        const v = Number(raw.replace(",", "."));
        if (Number.isNaN(v)) return;
        records.push({ aluno_id: `aluno_${i + 1}`, nota: v });
      });
      if (records.length === 0) {
        setError("Nenhum valor numérico encontrado na coluna selecionada.");
        return;
      }
      setParsed(records);
    } catch (e) {
      setError("Erro ao parsear: " + (e as Error).message);
    }
  };

  const onImport = () => {
    if (parsed.length === 0) return;
    startTransition(async () => {
      // Em produção: enviar para uma server action que faz batch insert.
      // Em demo: simula o sucesso e mostra contagem.
      await new Promise((r) => setTimeout(r, 600));
      setImported(parsed.length);
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-bg-alt border border-line rounded-[14px] p-5 shadow-sm">
        <div className="grid md:grid-cols-[1fr_1fr] gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Disciplina de destino</label>
            <select value={targetDisc} onChange={(e) => setTargetDisc(e.target.value)} className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none bg-bg-alt">
              {grupos.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Arquivo (CSV / TSV / XLSX-em-texto)</label>
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              className="block w-full text-sm text-ink-2 file:mr-3 file:px-3.5 file:py-2 file:rounded-md file:border-0 file:bg-ink-2 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-ink"
            />
          </div>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted hover:text-ink-2">Colar manualmente (CSV/TSV)</summary>
          <textarea
            value={csv}
            onChange={(e) => { setCsv(e.target.value); parseCSV(e.target.value); }}
            rows={6}
            className="w-full mt-2 px-3 py-2 border border-line-2 rounded-md text-sm font-mono focus:border-accent focus:outline-none"
            placeholder="Cole aqui o conteúdo da planilha..."
          />
        </details>
      </div>

      {error && <div className="bg-danger-soft border border-danger/20 text-danger rounded-md px-4 py-3 text-sm">{error}</div>}

      {parsed.length > 0 && (
        <div className="bg-bg-alt border border-line rounded-[14px] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <div>
              <strong className="font-semibold text-ink-2">Pré-visualização</strong>
              <p className="text-muted text-xs m-0 mt-0.5">{parsed.length} registros prontos para importar</p>
            </div>
            <button
              onClick={onImport}
              disabled={pending}
              className="bg-accent text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-accent-2 transition-colors disabled:opacity-50"
            >
              {pending ? "Importando..." : `Importar ${parsed.length} notas`}
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-bg-alt border-b border-line">
                <tr>
                  <th className="text-left px-4 py-2 text-xs uppercase text-muted font-semibold">Aluno</th>
                  <th className="text-center px-4 py-2 text-xs uppercase text-muted font-semibold">Nota</th>
                  <th className="text-center px-4 py-2 text-xs uppercase text-muted font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsed.slice(0, 100).map((r, i) => (
                  <tr key={i} className="border-b border-line/50">
                    <td className="px-4 py-2 font-mono text-xs text-ink-2">{r.aluno_id}</td>
                    <td className="px-4 py-2 text-center tabular-nums font-semibold text-ink-2">{r.nota.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.nota >= 5 ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                      }`}>
                        {r.nota >= 5 ? "Aprovado" : "Reprovado"}
                      </span>
                    </td>
                  </tr>
                ))}
                {parsed.length > 100 && (
                  <tr><td colSpan={3} className="text-center text-muted text-xs py-3">+ {parsed.length - 100} registros omitidos na pré-visualização</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {imported != null && (
        <div className="bg-success-soft border border-success/20 text-success rounded-md px-4 py-3 text-sm">
          ✓ {imported} notas importadas com sucesso{pending ? " (simulado em modo demo)" : ""}.
        </div>
      )}
    </div>
  );
}

function resolveTargetIdx(discId: string): number | null {
  // x-calculo1 → col 0, x-vga → col 1, y-calculo1 → col 2, y-vga → col 3
  if (discId.endsWith("calculo1")) {
    return discId.startsWith("x") ? 0 : 2;
  }
  if (discId.endsWith("vga")) {
    return discId.startsWith("x") ? 1 : 3;
  }
  return null;
}
