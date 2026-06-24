"use server";
import { revalidatePath } from "next/cache";
import { isSupabaseEnabled } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

/* Em modo demo, as mutações são no-op no servidor (o estado fica
 * no client via state local). Quando Supabase estiver configurado,
 * cada action grava de verdade no banco. */

/** Valida `nota` no server-side (cliente pode mentir). Retorna string de erro ou null. */
function validateNota(nota: unknown): string | null {
  if (typeof nota !== "number" || Number.isNaN(nota)) return "Nota inválida";
  if (nota < 0 || nota > 10) return "Nota deve estar entre 0 e 10";
  return null;
}

function validateId(id: unknown): string | null {
  if (typeof id !== "string" || id.length === 0 || id.length > 100) return "id inválido";
  if (!/^[a-zA-Z0-9_\-:.]+$/.test(id)) return "id com caracteres inválidos";
  return null;
}

function validateAlunoId(alunoId: unknown): string | null {
  if (typeof alunoId !== "string" || alunoId.length === 0 || alunoId.length > 100) return "aluno_id inválido";
  if (!/^[a-zA-Z0-9_\-:.]+$/.test(alunoId)) return "aluno_id com caracteres inválidos";
  return null;
}

export async function addNotaAction(disciplinaId: string, alunoId: string, nota: number) {
  await requireAdmin();
  const notaErr = validateNota(nota);
  if (notaErr) return { ok: false, error: notaErr };
  const alunoErr = validateAlunoId(alunoId);
  if (alunoErr) return { ok: false, error: alunoErr };
  const discErr = validateId(disciplinaId);
  if (discErr) return { ok: false, error: discErr };

  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const { error } = await supabase.from("notas").insert({ disciplina_id: disciplinaId, aluno_id: alunoId, nota_final: nota });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  return { ok: true };
}

export async function updateNotaAction(id: string, nota: number) {
  await requireAdmin();
  const idErr = validateId(id);
  if (idErr) return { ok: false, error: idErr };
  const notaErr = validateNota(nota);
  if (notaErr) return { ok: false, error: notaErr };

  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  // Schema usa bigserial → id é number. Se veio string sintética (demo),
  // o `if (!isSupabaseEnabled)` acima já fez no-op, então aqui o id é sempre number.
  const numId = Number(id);
  if (Number.isNaN(numId)) return { ok: false, error: "id deve ser numérico em produção" };
  const { error } = await supabase.from("notas").update({ nota_final: nota }).eq("id", numId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  return { ok: true };
}

export async function deleteNotaAction(id: string) {
  await requireAdmin();
  const idErr = validateId(id);
  if (idErr) return { ok: false, error: idErr };

  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const numId = Number(id);
  if (Number.isNaN(numId)) return { ok: false, error: "id deve ser numérico em produção" };
  const { error } = await supabase.from("notas").delete().eq("id", numId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  return { ok: true };
}

export type ImportRecord = { aluno_id: string; nota: number };

/** Importa (upsert) um lote de notas. Dedup via `unique (disciplina_id, aluno_id)` do schema. */
export async function importNotasAction(
  disciplinaId: string,
  records: ImportRecord[]
): Promise<{ ok: boolean; demo?: boolean; imported?: number; error?: string }> {
  await requireAdmin();
  const discErr = validateId(disciplinaId);
  if (discErr) return { ok: false, error: discErr };
  if (!Array.isArray(records) || records.length === 0) {
    return { ok: false, error: "Nenhum registro para importar" };
  }
  if (records.length > 5000) {
    return { ok: false, error: "Lote muito grande (máx 5000 registros por chamada)" };
  }
  // Valida cada record server-side — cliente pode mandar lixo
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const ae = validateAlunoId(r.aluno_id);
    if (ae) return { ok: false, error: `linha ${i + 1}: ${ae}` };
    const ne = validateNota(r.nota);
    if (ne) return { ok: false, error: `linha ${i + 1}: ${ne}` };
  }

  if (!isSupabaseEnabled) {
    // Em demo: simula OK pra UX não quebrar
    return { ok: true, demo: true, imported: records.length };
  }
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const rows = records.map((r) => ({
    disciplina_id: disciplinaId,
    aluno_id: r.aluno_id,
    nota_final: r.nota,
  }));
  // Dedup via unique constraint + upsert (atualiza nota_final se já existir)
  const { error, count } = await supabase
    .from("notas")
    .upsert(rows, { onConflict: "disciplina_id,aluno_id", count: "exact" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  revalidatePath("/admin/importar");
  return { ok: true, imported: count ?? rows.length };
}
