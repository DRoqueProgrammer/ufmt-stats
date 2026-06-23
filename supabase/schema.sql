-- =====================================================================
--  Schema do Supabase para Análise de Desempenho Acadêmico — UFMT
--  Rodar uma vez no SQL Editor do Supabase.
-- =====================================================================

-- Tabela de turmas
create table if not exists public.turmas (
  id          text primary key,
  nome        text not null,
  ano         int,
  descricao   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Tabela de disciplinas
create table if not exists public.disciplinas (
  id          text primary key,
  turma_id    text not null references public.turmas(id) on delete cascade,
  nome        text not null,
  codigo      text not null,
  cor         text not null default '#ff6b3d',
  created_at  timestamptz not null default now()
);
create index if not exists idx_disciplinas_turma on public.disciplinas(turma_id);

-- Tabela de notas finais (uma linha por aluno/disciplina)
-- Mantemos cada nota em sua própria linha para permitir análises
-- SQL diretas (percentis, histogramas, comparações).
create table if not exists public.notas (
  id            bigserial primary key,
  disciplina_id text not null references public.disciplinas(id) on delete cascade,
  aluno_id      text not null,         -- identificador anônimo (uuid gerado no admin)
  nota_final    numeric(4,2) not null check (nota_final >= 0 and nota_final <= 10),
  created_at    timestamptz not null default now(),
  unique (disciplina_id, aluno_id)
);
create index if not exists idx_notas_disc on public.notas(disciplina_id);

-- View materializada (atualizada manualmente) com estatísticas por disciplina
create or replace view public.v_stats_disciplina as
select
  d.id              as disciplina_id,
  d.nome            as disciplina_nome,
  d.codigo          as disciplina_codigo,
  d.turma_id        as turma_id,
  t.nome            as turma_nome,
  t.ano             as turma_ano,
  count(n.id)       as n,
  min(n.nota_final) as minimo,
  max(n.nota_final) as maximo,
  avg(n.nota_final) as media,
  stddev_samp(n.nota_final) as desvio,
  percentile_cont(0.25) within group (order by n.nota_final) as q1,
  percentile_cont(0.5)  within group (order by n.nota_final) as mediana,
  percentile_cont(0.75) within group (order by n.nota_final) as q3,
  100.0 * count(*) filter (where n.nota_final >= 5.0) / count(*) as aprovacao_pct
from public.disciplinas d
join public.turmas t on t.id = d.turma_id
left join public.notas n on n.disciplina_id = d.id
group by d.id, d.nome, d.codigo, d.turma_id, t.nome, t.ano;

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.turmas      enable row level security;
alter table public.disciplinas enable row level security;
alter table public.notas       enable row level security;

-- Política padrão: leitura pública (qualquer pessoa pode ver as análises)
drop policy if exists "public read turmas"      on public.turmas;
drop policy if exists "public read disciplinas" on public.disciplinas;
drop policy if exists "public read notas"       on public.notas;

create policy "public read turmas"
  on public.turmas for select
  using (true);

create policy "public read disciplinas"
  on public.disciplinas for select
  using (true);

create policy "public read notas"
  on public.notas for select
  using (true);

-- Apenas usuários autenticados (admins) podem escrever
drop policy if exists "auth write turmas"      on public.turmas;
drop policy if exists "auth write disciplinas" on public.disciplinas;
drop policy if exists "auth write notas"       on public.notas;

create policy "auth write turmas"
  on public.turmas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write disciplinas"
  on public.disciplinas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "auth write notas"
  on public.notas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =====================================================================
--  DADOS INICIAIS (seed) — opcional, rode só se quiser popular agora
-- =====================================================================
insert into public.turmas (id, nome, ano, descricao) values
  ('x', 'Turma A', null, 'Turma A (período letivo não informado, dados anônimos)'),
  ('y', 'Turma B', null, 'Turma B (período letivo não informado, dados anônimos)')
on conflict (id) do nothing;

insert into public.disciplinas (id, turma_id, nome, codigo, cor) values
  ('x-calculo1', 'x', 'Cálculo I',                  'Cálculo I', '#ff6b3d'),
  ('x-vga',      'x', 'Vetores e Geometria Analítica', 'VGA',     '#14b8a6'),
  ('y-calculo1', 'y', 'Cálculo I',                  'Cálculo I', '#ff6b3d'),
  ('y-vga',      'y', 'Vetores e Geometria Analítica', 'VGA',     '#14b8a6')
on conflict (id) do nothing;

-- As notas podem ser importadas via /admin/import ou via SQL.
