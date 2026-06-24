import seed from "@/data/seed.json";
import type { Grupo, NotaRow, SeedData, Turma, Disciplina } from "./types";
import { approvalRate, describe } from "./stats";

const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

// Brand chart palette — matches the OKLCH tokens in globals.css
// Cálculo I → accent (orange) · VGA → teal · X → primary navy · Y → purple
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

export function getTurmas(): Turma[] {
  return typedSeed.turmas;
}

export function getTurma(id: string): Turma | undefined {
  return typedSeed.turmas.find((t) => t.id === id);
}

export function getGrupos(cutoff = 5.0): Grupo[] {
  const grupos: Grupo[] = [];
  typedSeed.turmas.forEach((turma) => {
    turma.disciplinas.forEach((disc) => {
      const stats = describe(disc.notas);
      const notasRaw: NotaRow[] = disc.notas.map((n, i) => ({
        // ID determinístico: estável entre reloads, suficiente para o admin
        // operar no client. Em prod, este campo é sobrescrito pelo `id`
        // real do Supabase quando `getGruposFromSupabase()` for implementado.
        id: `seed-${turma.id}-${disc.id}-${i}`,
        aluno_id: `aluno_${i + 1}`,
        nota_final: n,
      }));
      grupos.push({
        id: `${turma.id}__${disc.id}`,
        short: `${turma.nome.replace("Turma ", "")} · ${disc.codigo === "VGA" ? "VGA" : "Cálc. I"}`,
        label: `${turma.nome} · ${disc.nome}`,
        turmaColor: TURMA_COLORS[turma.id] ?? "oklch(35% 0.08 250)",
        disciplinaColor: DISCIPLINA_COLORS[disc.codigo] ?? "oklch(70% 0.18 35)",
        notas: disc.notas,
        notasRaw,
        stats,
        approval: approvalRate(disc.notas, cutoff),
      });
    });
  });
  return grupos;
}

export function getGrupoById(id: string, cutoff = 5.0): Grupo | undefined {
  return getGrupos(cutoff).find((g) => g.id === id);
}

export type { Turma, Disciplina, NotaRow };
