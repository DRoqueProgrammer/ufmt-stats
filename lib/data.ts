import { cache } from "react";
import seed from "@/data/seed.json";
import type { Grupo, NotaRow, SeedData, Turma } from "./types";
import { approvalRate, describe } from "./stats";
import { isSupabaseEnabled } from "./supabase";
import { createSupabaseServer } from "./supabase-server";

const isDemo = !isSupabaseEnabled;

// Brand chart palette — matches the OKLCH tokens in globals.css
// VGA → teal · X → primary navy · Y → purple
const DISCIPLINA_COLORS: Record<string, string> = {
  "Cálculo I": "oklch(70% 0.18 35)",
  VGA: "oklch(64% 0.13 185)",
};

const TURMA_COLORS: Record<string, string> = {
  x: "oklch(35% 0.08 250)",
  y: "oklch(48% 0.16 295)",
};

const typedSeed = seed as SeedData;

export function isDemoMode() {
  return isDemo;
}

export function getMetadata() {
  return typedSeed.metadata;
}

export function getAutores() {
  return typedSeed.autores;
}

/* ---------------- Shared builder ---------------- */

/** Monta um Grupo a partir de metadados de turma/disciplina + notas brutas.
 *  `notasRaw` carrega o id real da linha (Supabase) ou um id determinístico
 *  (seed) para o admin operar. */
function buildGrupo(
  turmaId: string,
  turmaNome: string,
  discId: string,
  discNome: string,
  discCodigo: string,
  notasRaw: NotaRow[],
  cutoff: number,
): Grupo {
  const notas = notasRaw.map((r) => r.nota_final);
  return {
    id: `${turmaId}__${discId}`,
    short: `${turmaNome.replace("Turma ", "")} · ${discCodigo === "VGA" ? "VGA" : "Cálc. I"}`,
    label: `${turmaNome} · ${discNome}`,
    turmaColor: TURMA_COLORS[turmaId] ?? "oklch(35% 0.08 250)",
    disciplinaColor: DISCIPLINA_COLORS[discCodigo] ?? "oklch(70% 0.18 35)",
    notas,
    notasRaw,
    stats: describe(notas),
    approval: approvalRate(notas, cutoff),
  };
}

/* ---------------- Seed (demo) source ---------------- */

function getGruposFromSeed(cutoff: number): Grupo[] {
  const grupos: Grupo[] = [];
  typedSeed.turmas.forEach((turma) => {
    turma.disciplinas.forEach((disc) => {
      const notasRaw: NotaRow[] = disc.notas.map((n, i) => ({
        // ID determinístico: estável entre reloads, suficiente para o admin
        // operar no client em modo demo (mutações são no-op no servidor).
        id: `seed-${turma.id}-${disc.id}-${i}`,
        aluno_id: `aluno_${i + 1}`,
        nota_final: n,
      }));
      grupos.push(
        buildGrupo(turma.id, turma.nome, disc.id, disc.codigo, disc.nome, notasRaw, cutoff),
      );
    });
  });
  return grupos;
}

function getTurmasFromSeed(): Turma[] {
  return typedSeed.turmas;
}

/* ---------------- Supabase (produção) source ---------------- */

/** Formato retornado pelo nested select do Supabase. */
type DiscRow = {
  id: string;
  nome: string;
  codigo: string;
  turma_id: string;
  notas: { id: number; aluno_id: string; nota_final: number }[];
};
type TurmaRow = {
  id: string;
  nome: string;
  ano: number | null;
  descricao: string | null;
  disciplinas: DiscRow[];
};

/** Busca turmas → disciplinas → notas em uma única query aninhada.
 *  `cache()` deduplica a chamada dentro do mesmo render (várias
 *  páginas/componentes podem pedir os grupos sem refetch). */
const fetchTurmasRows = cache(async (): Promise<TurmaRow[] | null> => {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("turmas")
    .select(
      `id, nome, ano, descricao,
       disciplinas ( id, nome, codigo, turma_id,
         notas ( id, aluno_id, nota_final ) )`,
    )
    .order("id", { ascending: true });
  if (error) {
    console.error("[data] Supabase fetch falhou, caindo pro seed:", error.message);
    return null;
  }
  return (data as TurmaRow[]) ?? null;
});

function rowsToGrupos(rows: TurmaRow[], cutoff: number): Grupo[] {
  const grupos: Grupo[] = [];
  rows.forEach((turma) => {
    (turma.disciplinas ?? []).forEach((disc) => {
      const notasRaw: NotaRow[] = (disc.notas ?? []).map((n) => ({
        id: String(n.id), // bigserial → string (o admin sempre lida com string)
        aluno_id: n.aluno_id,
        nota_final: Number(n.nota_final),
      }));
      grupos.push(
        buildGrupo(turma.id, turma.nome, disc.id, disc.nome, disc.codigo, notasRaw, cutoff),
      );
    });
  });
  return grupos;
}

function rowsToTurmas(rows: TurmaRow[]): Turma[] {
  return rows.map((t) => ({
    id: t.id,
    nome: t.nome,
    ano: t.ano,
    descricao: t.descricao ?? "",
    disciplinas: (t.disciplinas ?? []).map((d) => ({
      id: d.id,
      turma_id: d.turma_id,
      nome: d.nome,
      codigo: d.codigo,
      cor: DISCIPLINA_COLORS[d.codigo] ?? "#ff6b3d",
      notas: (d.notas ?? []).map((n) => Number(n.nota_final)),
    })),
  }));
}

/* ---------------- API pública (async) ----------------
 * Em produção lê do Supabase; em demo (ou se a query falhar/vier vazia)
 * cai no seed.json. Isso fecha o circuito admin → banco → site público:
 * as mutações do admin passam a refletir na home após revalidatePath("/"). */

export async function getGrupos(cutoff = 5.0): Promise<Grupo[]> {
  if (isSupabaseEnabled) {
    const rows = await fetchTurmasRows();
    if (rows && rows.length > 0) return rowsToGrupos(rows, cutoff);
    // rows null (erro) ou vazio → fallback seed pra página nunca quebrar.
  }
  return getGruposFromSeed(cutoff);
}

export async function getGrupoById(id: string, cutoff = 5.0): Promise<Grupo | undefined> {
  return (await getGrupos(cutoff)).find((g) => g.id === id);
}

export async function getTurmas(): Promise<Turma[]> {
  if (isSupabaseEnabled) {
    const rows = await fetchTurmasRows();
    if (rows && rows.length > 0) return rowsToTurmas(rows);
  }
  return getTurmasFromSeed();
}

export async function getTurma(id: string): Promise<Turma | undefined> {
  return (await getTurmas()).find((t) => t.id === id);
}

export type { Turma, Disciplina, NotaRow } from "./types";
