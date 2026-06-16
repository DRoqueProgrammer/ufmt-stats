"use server";
import { revalidatePath } from "next/cache";
import { isSupabaseEnabled } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/data";

/* Em modo demo, as mutações são no-op no servidor (o estado fica
 * no client via state local). Quando Supabase estiver configurado,
 * cada action grava de verdade no banco. */

export async function addNotaAction(disciplinaId: string, alunoId: string, nota: number) {
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
  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const numId = Number(id);
  const { error } = await supabase.from("notas").update({ nota_final: nota }).eq("id", Number.isNaN(numId) ? id : numId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  return { ok: true };
}

export async function deleteNotaAction(id: string) {
  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const numId = Number(id);
  const { error } = await supabase.from("notas").delete().eq("id", Number.isNaN(numId) ? id : numId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/notas");
  return { ok: true };
}
