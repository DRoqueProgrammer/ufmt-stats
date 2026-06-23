"use client";
import { useState, useTransition, useMemo } from "react";
import { addNotaAction, deleteNotaAction, updateNotaAction } from "./actions";
import type { StatsResult } from "@/lib/types";

type Props = {
  disciplinaId: string;
  disciplinaLabel: string;
  notas: number[];
  stats: StatsResult;
  approval: number;
};

export function NotasTable({ disciplinaId, disciplinaLabel, notas: initialNotas, stats, approval }: Props) {
  const [notas, setNotas] = useState<{ id: string; aluno_id: string; nota: number }[]>(() =>
    initialNotas.map((n, i) => ({ id: `seed-${i}`, aluno_id: `aluno_${i + 1}`, nota: n }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [newNota, setNewNota] = useState("");
  const [newAluno, setNewAluno] = useState("");
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "aprovado" | "reprovado">("all");
  const [search, setSearch] = useState("");

  const liveStats = useMemo(() => {
    const arr = notas.map((n) => n.nota);
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    if (n === 0) return { mean: 0, median: 0, approval: 0 };
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const approval = (arr.filter((v) => v >= 5).length / n) * 100;
    return { mean, median, approval };
  }, [notas]);

  const visible = useMemo(() => {
    let list = notas;
    if (filter === "aprovado") list = list.filter((n) => n.nota >= 5);
    if (filter === "reprovado") list = list.filter((n) => n.nota < 5);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.aluno_id.toLowerCase().includes(q) || String(n.nota).includes(q));
    }
    return list;
  }, [notas, filter, search]);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const v = Number(newNota.replace(",", "."));
    if (Number.isNaN(v) || v < 0 || v > 10) return;
    const aluno = newAluno.trim() || `aluno_${Date.now()}`;
    startTransition(async () => {
      const res = await addNotaAction(disciplinaId, aluno, v);
      if (res.ok) {
        setNotas((prev) => [...prev, { id: `new-${Date.now()}`, aluno_id: aluno, nota: v }]);
        setNewNota(""); setNewAluno("");
      }
    });
  };

  const onSave = (id: string) => {
    const v = Number(editValue.replace(",", "."));
    if (Number.isNaN(v) || v < 0 || v > 10) return;
    startTransition(async () => {
      await updateNotaAction(id, v);
      setNotas((prev) => prev.map((n) => (n.id === id ? { ...n, nota: v } : n)));
      setEditingId(null);
    });
  };

  const onDelete = (id: string) => {
    if (!confirm("Excluir esta nota?")) return;
    startTransition(async () => {
      await deleteNotaAction(id);
      setNotas((prev) => prev.filter((n) => n.id !== id));
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Alunos", value: notas.length },
          { label: "Média", value: liveStats.mean.toFixed(2).replace(".", ",") },
          { label: "Mediana", value: liveStats.median.toFixed(2).replace(".", ",") },
          { label: "Aprovação (live)", value: liveStats.approval.toFixed(1).replace(".", ",") + "%" },
        ].map((k) => (
          <div key={k.label} className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm">
            <div className="font-serif text-2xl font-semibold text-ink-2 tabular-nums">{k.value}</div>
            <div className="text-xs text-muted-2 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={onAdd} className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm mb-4 grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-muted-2 mb-1.5">Aluno (anônimo)</label>
          <input
            value={newAluno}
            onChange={(e) => setNewAluno(e.target.value)}
            placeholder="ex.: aluno_42 (vazio = automático)"
            className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-muted-2 mb-1.5">Nota (0 a 10)</label>
          <input
            type="text"
            inputMode="decimal"
            required
            value={newNota}
            onChange={(e) => setNewNota(e.target.value)}
            placeholder="ex.: 7,5"
            className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none tabular-nums"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-bg px-5 py-2 rounded-md text-sm font-semibold hover:bg-accent-2 transition-colors disabled:opacity-50"
        >
          {pending ? "..." : "Adicionar"}
        </button>
      </form>

      <div className="bg-bg-alt border border-line rounded-[14px] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-3 border-b border-line bg-bg/50">
          <div className="flex gap-1.5 text-xs">
            {(["all", "aprovado", "reprovado"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  filter === f ? "bg-ink-2 text-bg" : "bg-bg-alt border border-line-2 text-ink-2 hover:border-accent"
                }`}
              >
                {f === "all" ? "Todos" : f === "aprovado" ? "Aprovados" : "Reprovados"}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar aluno ou nota..."
            className="ml-auto px-3 py-1.5 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-bg-alt">
              <tr className="border-b border-line">
                <th className="text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-muted-2 font-semibold">Aluno</th>
                <th className="text-center px-4 py-2.5 text-[11px] tracking-wider uppercase text-muted-2 font-semibold w-32">Nota</th>
                <th className="text-center px-4 py-2.5 text-[11px] tracking-wider uppercase text-muted-2 font-semibold w-28">Status</th>
                <th className="text-right px-4 py-2.5 text-[11px] tracking-wider uppercase text-muted-2 font-semibold w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((n) => {
                const aprovado = n.nota >= 5;
                return (
                  <tr key={n.id} className="border-b border-line/50 hover:bg-bg/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-ink-2">{n.aluno_id}</td>
                    <td className="px-4 py-2.5 text-center">
                      {editingId === n.id ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") onSave(n.id); if (e.key === "Escape") setEditingId(null); }}
                          className="w-20 px-2 py-1 border border-accent rounded text-sm text-center tabular-nums"
                        />
                      ) : (
                        <span className={`font-semibold tabular-nums ${aprovado ? "text-success" : "text-danger"}`}>
                          {n.nota.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        aprovado ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                      }`}>
                        {aprovado ? "Aprovado" : "Reprovado"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {editingId === n.id ? (
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => onSave(n.id)} className="text-xs px-2.5 py-1 rounded bg-success text-bg hover:bg-success/90">Salvar</button>
                          <button onClick={() => setEditingId(null)} className="text-xs px-2.5 py-1 rounded bg-bg-alt border border-line-2 hover:border-ink-2">Cancelar</button>
                        </div>
                      ) : (
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => { setEditingId(n.id); setEditValue(String(n.nota)); }} className="text-xs px-2.5 py-1 rounded bg-bg-alt border border-line-2 hover:border-accent hover:text-accent">Editar</button>
                          <button onClick={() => onDelete(n.id)} className="text-xs px-2.5 py-1 rounded bg-bg-alt border border-line-2 hover:border-danger hover:text-danger">Excluir</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted-2 py-8 text-sm">Nenhum resultado para os filtros atuais.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
