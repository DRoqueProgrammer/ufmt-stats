# UFMT Stats — Análise de Desempenho Acadêmico

Site institucional da pesquisa *"Análise de Desempenho Acadêmico em Cálculo I e VGA — UFMT"*,
construído com **Next.js 16 (App Router)**, **Supabase** (Postgres + Auth) e pronto pra deploy
na **Vercel**.

## ✨ Features

- 📊 Visualizações interativas (Chart.js) com **dados reais** carregados do banco
- 🏫 Painel admin protegido por senha (Supabase Auth em produção, senha demo local)
- 📝 CRUD de notas (adicionar, editar, excluir, filtrar aprovados/reprovados)
- 📥 Importador de CSV/TSV com pré-visualização e batch upsert com dedup
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

> **Modo demo é o estado padrão.** Sem `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> setadas, o site lê de `data/seed.json` (committed, ~3KB) e roda sem Supabase. O painel admin
> aceita mutações em memória (UI otimista) mas não persiste nada no banco — é pra navegar e
> demonstrar, não pra uso sério.
>
> Para dados reprodutíveis fim-a-fim: `git clone + npm i + npm run dev` reproduz **toda** a
> análise sem credenciais. Isso é feature, não bug — é o que o `PRODUCT.md` pede
> ("reprodutibilidade científica").

## 🗄️ Setup com Supabase (produção)

### 1. Crie um projeto no [supabase.com](https://supabase.com)

### 2. Rode o schema SQL

No SQL Editor do dashboard, execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
Isso cria as tabelas, índices, view e policies de RLS.

### 3. Popule o banco

Você tem duas opções:

**(a) Via interface web (recomendado)**
- Acesse `/admin` → faça login → use a aba "Importar CSV/TSV" para subir o arquivo
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

Copie `.env.example` para `.env.local` e preencha (veja [`./.env.example`](./.env.example)):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_DEMO_PASSWORD=              # vazio em produção (não usado se Supabase ativo)
```

Em produção (Vercel), defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
em **Environment Variables**. Deixe `ADMIN_DEMO_PASSWORD` vazio — o caminho demo não executa
quando Supabase está ativo.

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

## 🧪 Verificação de integridade dos dados

```bash
npm run hash-data    # gera data/seed.json.sha256
```

O hash do `data/seed.json` é commitado em `data/seed.json.sha256` para permitir que revisores
verifiquem que os bytes exatos produzem os números exatos da análise. Para um paper com claims
publicáveis, isso é parte da reprodutibilidade científica.

## 📁 Estrutura

```
app/
  page.tsx              # Página pública (home com hero, gráficos, etc.)
  layout.tsx            # Layout raiz com banner de modo demo
  admin/
    (auth)/
      login/            # Tela de login (Supabase Auth ou senha demo)
    (protected)/
      page.tsx          # Dashboard com KPIs
      notas/            # CRUD de notas
      turmas/           # Cadastro de turmas e disciplinas
      importar/         # Importador de CSV/TSV com batch upsert
  globals.css           # Tokens OKLCH, brand, print, motion
components/
  Navbar.tsx            # Nav pública sticky
  PrintHeader.tsx       # Cabeçalho print-only
  charts/
    Charts.tsx          # Boxplot, Histograma, Barras (Chart.js)
    StatusBreakdown.tsx
  Seo/
    AcademicArticleJsonLd.tsx
data/
  seed.json             # Dados da planilha (fallback demo)
  seed.json.sha256      # Hash SHA-256 do seed (reprodutibilidade)
lib/
  data.ts               # Camada de dados (lê seed.json ou Supabase)
  stats.ts              # Cálculos estatísticos (describe, approval, bin)
  supabase.ts           # Flag e env Supabase (server + client)
  supabase-server.ts    # Cliente Supabase server
  supabase-browser.ts   # Cliente Supabase browser
  admin-auth.ts         # Guard de rotas /admin/*
  types.ts              # Tipos compartilhados
scripts/
  print-css-tweak.py    # Script de ajuste de print (debug histórico)
docs/
  CHANGELOG-impeccable.md  # Histórico de polish de design
supabase/
  schema.sql            # Schema + RLS + view de stats
  seed-notas.sql        # Seed SQL opcional
proxy.ts                # Matcher Next 16 para /admin/*
```

## 🧪 Stack

- **Next.js 16.2.9** — App Router, Server Components, Server Actions
- **React 19** + **TypeScript strict**
- **Tailwind CSS 3.4** — utility-first, com tokens OKLCH customizados
- **Supabase** — Postgres + Auth + RLS (`@supabase/ssr`)
- **Chart.js 4** — visualizações client-side com tokens OKLCH via `color-mix()`

## 📜 Licença

MIT — pesquisa acadêmica, dados anônimos.
