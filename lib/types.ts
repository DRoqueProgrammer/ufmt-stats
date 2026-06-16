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
  /** Rótulo curto p/ gráficos: "X · Cálc. I" */
  short: string;
  /** Rótulo completo: "Turma X · Cálculo I" */
  label: string;
  /** Cor da turma */
  turmaColor: string;
  /** Cor da disciplina (Cálculo I = laranja, VGA = teal) */
  disciplinaColor: string;
  notas: number[];
  stats: StatsResult;
  approval: number;
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
