import seed from "@/data/seed.json";
import type { Grupo, SeedData, Turma, Disciplina } from "./types";
import { approvalRate, describe } from "./stats";

const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

const DISCIPLINA_COLORS: Record<string, string> = {
  "Cálculo I": "#ff6b3d",
  VGA: "#14b8a6",
};

const TURMA_COLORS: Record<string, string> = {
  x: "#1a3a5c",
  y: "#6b46c1",
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
      grupos.push({
        id: `${turma.id}__${disc.id}`,
        short: `${turma.nome.replace("Turma ", "")} · ${disc.codigo === "VGA" ? "VGA" : "Cálc. I"}`,
        label: `${turma.nome} · ${disc.nome}`,
        turmaColor: TURMA_COLORS[turma.id] ?? "#1a3a5c",
        disciplinaColor: DISCIPLINA_COLORS[disc.codigo] ?? "#ff6b3d",
        notas: disc.notas,
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

export type { Turma, Disciplina };
