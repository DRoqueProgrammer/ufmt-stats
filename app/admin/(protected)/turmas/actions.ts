"use server";
import { revalidatePath } from "next/cache";
import { isSupabaseEnabled } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";

type TurmaInput = { id: string; nome: string; ano: number | null; descricao: string };
type DisciplinaInput = { id: string; turma_id: string; nome: string; codigo: string; cor: string };

export async function createTurmaAction(input: TurmaInput) {
  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const { error } = await supabase.from("turmas").insert(input);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/turmas");
  return { ok: true };
}

export async function createDisciplinaAction(input: DisciplinaInput) {
  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const { error } = await supabase.from("disciplinas").insert(input);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/turmas");
  return { ok: true };
}
