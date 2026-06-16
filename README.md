# UFMT Stats — Análise de Desempenho Acadêmico

Site institucional da pesquisa *"Análise de Desempenho Acadêmico em Cálculo I e VGA — UFMT"*,
construído com **Next.js 15 (App Router)**, **Supabase** (Postgres + Auth) e pronto pra deploy
na **Vercel**.

## ✨ Features

- 📊 Visualizações interativas (Chart.js) com **dados reais** carregados do banco
- 🏫 Painel admin protegido por senha (Supabase Auth em produção, senha demo local)
- 📝 CRUD de notas (adicionar, editar, excluir, filtrar aprovados/reprovados)
- 📥 Importador de CSV/TSV com pré-visualização
- 🌓 Modo demo — funciona sem Supabase, lendo `data/seed.json`
- 🔒 Row Level Security (RLS) — leitura pública, escrita só pra autenticados
- 📱 Responsivo (mobile-first)
- ⚡ SSG/SSR híbrido, deploy direto na Vercel

## 🚀 Quick start (modo demo, sem Supabase)

```bash
npm install
npm run dev
# http://localhost:3001
```

Acesse `/admin/login` e use a senha **`ufmt2024`** (ou o valor de `ADMIN_DEMO_PASSWORD`).

## 🗄️ Setup com Supabase (produção)

### 1. Crie um projeto no [supabase.com](https://supabase.com)

### 2. Rode o schema SQL

No SQL Editor do dashboard, execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
Isso cria as tabelas, índices, view materializada e policies de RLS.

### 3. Popule o banco

Você tem duas opções:

**(a) Via interface web (recomendado)**
- Acesse `/admin` → faça login → use a aba "Importar CSV" para subir o arquivo
  `data/seed.csv` (gerado a partir da planilha original).

**(b) Via SQL direto**

```sql
-- Insere as notas da planilha (execute após rodar schema.sql)
insert into public.notas (disciplina_id, aluno_id, nota_final) values
  ('x-calculo1', 'aluno_1', 0.74),
  ('x-calculo1', 'aluno_2', 0.00),
  -- ... etc
  ;
```

### 4. Crie um usuário admin

No Supabase Auth → Users → "Add user" → email/senha. Esse será o login do painel.

### 5. Configure as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_DEMO_PASSWORD=              # vazio em produção (não usado se Supabase ativo)
```

### 6. Build e rode

```bash
npm run build
npm start
```

## 🌐 Deploy na Vercel

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

Ou via dashboard: [vercel.com/new](https://vercel.com/new) → importe o repo →
configure as 2 env vars acima → Deploy.

## 📁 Estrutura

```
app/
  page.tsx              # Página pública (home com hero, gráficos, etc.)
  layout.tsx            # Layout raiz com banner de modo demo
  admin/
    layout.tsx          # Layout admin com guard de auth
    page.tsx            # Dashboard com KPIs
    login/              # Tela de login (Supabase Auth ou senha demo)
    notas/              # CRUD de notas
    turmas/             # Cadastro de turmas e disciplinas
    importar/           # Importador de CSV
  globals.css
components/
  Navbar.tsx            # Nav pública sticky
  charts/
    Charts.tsx          # Boxplot, Histograma, Barras (Chart.js)
data/
  seed.json             # Dados da planilha (fallback demo)
lib/
  data.ts               # Camada de dados (lê seed.json ou Supabase)
  stats.ts              # Cálculos estatísticos (describe, approval, bin)
  supabase.ts           # Cliente Supabase (server + browser)
  admin-auth.ts         # Guard de rotas /admin/*
  types.ts              # Tipos compartilhados
supabase/
  schema.sql            # Schema + RLS + view materializada
middleware.ts           # Matcher para /admin/*
```

## 🧪 Stack

- **Next.js 15** — App Router, Server Components, Server Actions
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first, com tokens customizados
- **Supabase** — Postgres + Auth + RLS
- **Chart.js 4** — visualizações client-side
- **@supabase/ssr** — auth cookies em RSC/Route Handlers

## 📜 Licença

MIT — pesquisa acadêmica, dados anônimos.
