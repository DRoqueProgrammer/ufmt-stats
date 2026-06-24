"use server";
import { revalidatePath } from "next/cache";
import { isSupabaseEnabled } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

type TurmaInput = { id: string; nome: string; ano: number | null; descricao: string };
type DisciplinaInput = { id: string; turma_id: string; nome: string; codigo: string; cor: string };

function validateText(v: unknown, max: number): string | null {
  if (typeof v !== "string" || v.length === 0 || v.length > max) return "campo inválido";
  return null;
}

export async function createTurmaAction(input: TurmaInput) {
  await requireAdmin();
  if (validateText(input.id, 50) || validateText(input.nome, 200)) {
    return { ok: false, error: "id/nome inválidos" };
  }
  if (input.ano != null && (typeof input.ano !== "number" || input.ano < 1900 || input.ano > 2100)) {
    return { ok: false, error: "ano inválido" };
  }

  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const { error } = await supabase.from("turmas").insert(input);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/turmas");
  return { ok: true };
}

export async function createDisciplinaAction(input: DisciplinaInput) {
  await requireAdmin();
  if (validateText(input.id, 50) || validateText(input.turma_id, 50) ||
      validateText(input.nome, 200) || validateText(input.codigo, 50) ||
      validateText(input.cor, 30)) {
    return { ok: false, error: "campos inválidos" };
  }

  if (!isSupabaseEnabled) return { ok: true, demo: true };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "Sem cliente Supabase" };
  const { error } = await supabase.from("disciplinas").insert(input);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/turmas");
  return { ok: true };
}
