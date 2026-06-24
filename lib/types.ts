export type Disciplina = {
  id: string;
  turma_id: string;
  nome: string;
  codigo: string;
  cor: string;
  notas: number[];
};

export type Turma = {
  id: string;
  nome: string;
  ano: number | null;
  descricao: string;
  disciplinas: Disciplina[];
};

export type Grupo = {
  /** Identificador único: `${turmaId}__${disciplinaId}` */
  id: string;
  /** Rótulo curto p/ gráficos: "A · Cálc. I" */
  short: string;
  /** Rótulo completo: "Turma A · Cálculo I" */
  label: string;
  /** Cor da turma */
  turmaColor: string;
  /** Cor da disciplina (Cálculo I = laranja, VGA = teal) */
  disciplinaColor: string;
  /** Notas brutas (apenas números) — usado por gráficos e stats. */
  notas: number[];
  /** Notas com id e aluno_id — usado pelo admin. Em demo, ids são determinísticos
   *  (`seed-{turmaId}-{discId}-{i}`); em prod, são os ids reais do Supabase. */
  notasRaw: NotaRow[];
  stats: StatsResult;
  approval: number;
};

/** Linha de nota com id (PK do banco) e aluno_id (anônimo). */
export type NotaRow = {
  /** PK da nota. Em demo: string determinística. Em prod: stringified bigserial. */
  id: string;
  aluno_id: string;
  nota_final: number;
};

export type StatsResult = {
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  sd: number;
};

export type SeedData = {
  turmas: Turma[];
  autores: { nome: string; papel: string; iniciais: string; orientador?: boolean }[];
  metadata: {
    titulo: string;
    universidade: string;
    orientador: string;
    referencia: string;
    criterio_aprovacao: number;
  };
};

export type AdminUser = {
  id: string;
  email: string;
};
