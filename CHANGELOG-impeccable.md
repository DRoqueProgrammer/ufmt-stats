# CHANGELOG — Impeccable pass

Data: 2026-06-23
Skill: [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v3.8.0
Instalado em: `.opencode/skills/impeccable/` (compatível com Mavis, Claude Code, Cursor, etc)
Detector: `node .opencode/skills/impeccable/scripts/detect.mjs app components` → **0 violações**

## Correções aplicadas

### `app/page.tsx` (página pública)

- **Hero:** removidos 2 `radial-gradient` decorativos (depth gradients são anti-pattern).
- **Hero card:** `rounded-[22px]` → `rounded-[14px]`; régua de 1px trocada de
  `bg-gradient-to-r from-accent to-accent-2` para `bg-accent` (cor sólida).
- **Strip escuro:** `bg-gradient-to-br from-primary to-primary-2` → `bg-primary`.
- **Metodologia (item de lista):** `hover:shadow-md hover:-translate-y-0.5 transition-all`
  → `hover:border-line-2 transition-colors` (lift-on-hover é tell de IA).
- **Status (3 finding cards idênticos):** quebrado em `aside` maior
  (Achado central) + parágrafo inline (Leitura) + nota com `border-t`
  (Recomendação). Variação de hierarquia visual em vez de 3 caixas iguais.
- **Conclusão (2 cards Diagnóstico/Ação):**
  - Removidos `border-l-4 border-primary` / `border-l-4 border-accent` (side-tab é absolute ban).
  - Removidos emojis 🔍 🎯 (decoração emoji é tell).
  - Layout mudou de `grid-cols-2` para `grid-cols-[1fr_2fr_1fr]` com
    numeração 01/02/03, pesos visuais diferentes (recomendação é o bloco central maior).
- **Autores (avatar):** `linear-gradient(135deg, var(--accent), var(--accent-2))`
  → `var(--accent)` sólido (gradient 135deg é o tell mais óbvio de UI de IA).
  Adicionado `border-2 border-line-2` para definição.
- **Autores (card):** `hover:-translate-y-0.5 transition-all` removido.

### `components/charts/StatusBreakdown.tsx`

- **`border-l-4` removido** (absolute ban do Impeccable).
- Substituído por faixa superior de 3px com a `disciplinaColor` da turma
  (mesma informação semântica, sem o tell).

### `components/charts/Charts.tsx`

- **4 ocorrências de `Inter, sans-serif` → `'IBM Plex Sans', system-ui, sans-serif`** (Inter é overused font, regra explícita).
- Sombra do tooltip reduzida de `0 8px 24px rgba(0,0,0,0.18)` para `0 4px 12px rgba(0,0,0,0.12)`.
- Border radius do tooltip `8px` → `6px`.

### `components/Navbar.tsx`

- Logo Σ: `linear-gradient(135deg, var(--primary), var(--primary-2))` → `bg-primary border border-line-2`.
- Hamburger: emojis `☰` / `✕` → SVG inline com `stroke-width="1.8"`.

### `app/admin/(auth)/login/page.tsx`

- Logo Σ: mesmo tratamento do Navbar (sem gradient).

### `app/admin/(protected)/layout.tsx`

- Logo Σ: `linear-gradient(135deg, var(--accent), var(--accent-2))` → `bg-accent` sólido.

### `app/admin/(protected)/page.tsx` (overview)

- **Card de turma:** `hover:shadow-md hover:-translate-y-0.5 transition-all` → `hover:border-line-2 transition-colors`.
- **Card "Gerenciar notas":**
  - `hover:shadow-md transition-all` → `hover:bg-primary-2 transition-colors`.
  - Removido círculo decorativo `bg-accent opacity-15` que era decoration sem propósito.
- **Cards "Turmas" e "Importar":** lift-on-hover removido, trocado por border hover.

### `app/admin/(protected)/notas/NotasTable.tsx`

- Placeholder da busca: `"🔍 Buscar aluno ou nota..."` → `"Buscar aluno ou nota..."`
  (emojis decorativos são tell).

### `tailwind.config.ts`

- **`boxShadow`** suavizado: `sm` (1px → 1px mais sutil), `md` (de 4+2 para 2px só),
  `lg` (de 16+4 para 4px só). Acadêmico = sombras contidas, não "elevated SaaS card".
- **`borderRadius.lg`:** `22px` → `18px` (ninguém estava usando 22px mesmo; o card do
  hero foi consertado pra 14px).

### `package.json`

- `lint` script removido (Next 16 não tem mais `next lint` nativo e não havia
  config ESLint no projeto). Substituído por:
  - `typecheck`: `tsc --noEmit` (mais útil que lint desatualizado)
  - `lint:design`: chama o detector do Impeccable

## Arquivos novos

- **`.opencode/skills/impeccable/`** — skill instalada com 23 commands,
  44 detector rules, scripts `context.mjs`, `detect.mjs`, `palette.mjs`,
  `pin.mjs`, etc. (compatível com Mavis, Claude Code, Cursor, Gemini CLI, Codex, OpenCode).
- **`.impeccable/config.json`** — config do detector (ignore rules do site de demos).
- **`AGENTS.md`** — guia condensado das regras do Impeccable aplicadas a
  este projeto. Ler antes de mexer em UI.

## Arquivos NÃO modificados intencionalmente

- `app/layout.tsx` — já estava OK.
- `components/ThemeToggle.tsx` — já estava OK.
- `components/PrintHeader.tsx` — print-only, sem risco de AI tells.
- `components/Seo/AcademicArticleJsonLd.tsx` — JSON-LD semântico.
- `app/admin/(protected)/importar/page.tsx` + `ImportClient.tsx` —
  sem violações detectadas.
- `app/admin/(protected)/turmas/page.tsx` + `Forms.tsx` — sem violações.
- `app/admin/(protected)/notas/page.tsx` — sem violações.
- `globals.css` — tokens já estavam alinhados (OKLCH navy + orange sóbrio,
  dark mode cuidadoso, `prefers-reduced-motion`, `tabular-nums`).

## O que NÃO foi tocado (deliberadamente)

- **`eyebrow` em todas as seções:** apesar de o Impeccable alertar que
  "tiny uppercase tracked eyebrow above every section" pode virar tell,
  neste projeto ele funciona como **sistema de marca deliberado** —
  "Introdução / Metodologia / Resultados / Visualizações / Indicador
  crítico / Análise de status / Conclusão / Créditos" é a sequência
  narrativa do paper. É voz, não reflexo. O AGENTS.md documenta isso.
- **Dark mode com chroma baixa nos tokens** — pode parecer "tinted
  neutrals" mas está no hue da marca (250° navy), não em cream/sand genérico.
  Mantido.
- **Cantos arredondados de 14px em todo card** — pode parecer repetitivo,
  mas é a única escala de radius do design system (8 / 14 / 18). Variação
  aleatória quebra a coesão.

## Como continuar

- Antes de qualquer mudança em UI: leia `AGENTS.md`.
- Antes de commitar: rode `npm run typecheck && npm run lint:design`.
- Pra rodar uma auditoria visual completa via LLM:
  `node .opencode/skills/impeccable/scripts/context.mjs` e peça `/impeccable audit`.
