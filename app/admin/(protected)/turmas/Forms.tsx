"use client";
import { useState, useTransition } from "react";
import { createTurmaAction, createDisciplinaAction } from "./actions";

export function NovaTurmaForm() {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const res = await createTurmaAction({
        id: nome.toLowerCase().replace(/\s+/g, "-").slice(0, 20) || "nova",
        nome,
        ano: ano ? Number(ano) : null,
        descricao: desc,
      });
      if (res.ok) {
        setMsg("✓ Turma criada" + (res.demo ? " (demo — não persistido)" : ""));
        setNome(""); setAno(""); setDesc("");
      } else setMsg("✗ " + res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Nome da turma</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none" placeholder="ex.: Turma Z" />
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Ano (opcional)</label>
        <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none" placeholder="ex.: 2024" />
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Descrição</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none" placeholder="ex.: Turma do semestre 2024/1" />
      </div>
      {msg && <p className="text-sm text-muted bg-bg rounded-md px-3 py-2">{msg}</p>}
      <button type="submit" disabled={pending} className="w-full bg-primary text-white py-2.5 rounded-md text-sm font-semibold hover:bg-primary-2 transition-colors disabled:opacity-50">
        {pending ? "Criando..." : "Criar turma"}
      </button>
    </form>
  );
}

export function NovaDisciplinaForm({ turmas }: { turmas: { id: string; nome: string }[] }) {
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("Cálculo I");
  const [cor, setCor] = useState("#ff6b3d");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const res = await createDisciplinaAction({
        id: `${turmaId}-${codigo.toLowerCase().replace(/\s+/g, "-")}`,
        turma_id: turmaId,
        nome,
        codigo,
        cor,
      });
      if (res.ok) {
        setMsg("✓ Disciplina criada" + (res.demo ? " (demo — não persistido)" : ""));
        setNome("");
      } else setMsg("✗ " + res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Turma</label>
        <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none bg-white">
          {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none" placeholder="ex.: Cálculo I" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Código</label>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required className="w-full px-3 py-2 border border-line-2 rounded-md text-sm focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-wide uppercase text-muted mb-1.5">Cor</label>
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="w-full h-[42px] border border-line-2 rounded-md cursor-pointer" />
        </div>
      </div>
      {msg && <p className="text-sm text-muted bg-bg rounded-md px-3 py-2">{msg}</p>}
      <button type="submit" disabled={pending} className="w-full bg-primary text-white py-2.5 rounded-md text-sm font-semibold hover:bg-primary-2 transition-colors disabled:opacity-50">
        {pending ? "Criando..." : "Criar disciplina"}
      </button>
    </form>
  );
}
