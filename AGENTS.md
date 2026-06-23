# AGENTS.md — ufmt-stats

> Guia de design e código para qualquer agente (Mavis, Claude Code, Cursor,
> Gemini CLI, Codex CLI) que for editar este projeto. Complementa o
> [`PRODUCT.md`](./PRODUCT.md) e o [`README.md`](./README.md).
>
> O Impeccable ([pbakaus/impeccable](https://github.com/pbakaus/impeccable))
> está instalado em `.opencode/skills/impeccable/`. Carregue-o sempre que
> for mexer em UI. Para rodar a auditoria estática:
>
> ```bash
> node .opencode/skills/impeccable/scripts/detect.mjs app components
> ```

## Identidade do projeto

- **Register:** brand (divulgação científica institucional, NÃO marketing SaaS).
- **Público-alvo:** docentes/pesquisadores da UFMT lendo em desktop e mobile.
- **Tom:** paper de iniciação científica com cuidado visual. Não é blog post.
- **Anti-referência explícita (ver `PRODUCT.md`):** gradientes vibrantes,
  glassmorphism, hero big-number genérico, kicker uppercase em todo section,
  educação SaaS com CTA "Comece grátis", Gov.br puro, Bootstrap cru.

Se uma mudança te aproximar de qualquer anti-referência, pare.

## Brand tokens (referência rápida)

| Token            | Valor (light)                          | Uso                                  |
| ---------------- | -------------------------------------- | ------------------------------------ |
| `--bg`           | `oklch(98.2% 0.006 250)`               | Body bg (cool off-white)             |
| `--bg-alt`       | `oklch(100% 0 0)`                      | Cards, superfícies elevadas          |
| `--bg-subtle`    | `oklch(96.8% 0.008 250)`               | Zebra rows, hover suave              |
| `--ink`          | `oklch(20% 0.04 250)`                  | Texto principal                      |
| `--ink-2`        | `oklch(26% 0.05 250)`                  | Títulos (h1–h4)                      |
| `--muted`        | `oklch(42% 0.025 250)`                 | Texto secundário                     |
| `--primary`      | `oklch(35% 0.08 250)`                  | Navy — CTAs primários, strip escuro  |
| `--accent`       | `oklch(70% 0.18 35)`                   | Orange — destaque, link ativo, regra |
| `--success`      | `oklch(58% 0.14 155)`                  | Aprovado                             |
| `--danger`       | `oklch(58% 0.18 25)`                   | Reprovado                            |
| `--warn`         | `oklch(75% 0.15 75)`                   | Zero (não compareceu)                |

Todos os tokens têm versão dark (`.dark` em `globals.css`). Não usar
`#000` / `#fff` puro — sempre tinta via tokens.

## Tipografia

- **Sans:** IBM Plex Sans (400/500/600/700) — `font-sans`.
- **Serif:** Lora (400/500/600 + itálico) — `font-serif`, usada em h1–h4.
- **Mono:** IBM Plex Mono — `font-mono`, para `aluno_id`, URLs, código.
- **NUNCA usar Inter, Arial, system-ui como fonte principal.** Chart.js usa
  literal `'IBM Plex Sans', system-ui, sans-serif` (não `Inter`).
- `text-wrap: balance` em h1–h3 (já em `globals.css`).
- `font-variant-numeric: tabular-nums` em todos os números (classe `.tabular`).
- Display heading max `~6rem`; floor de letter-spacing `-0.01em`.

## Regras absolutas (match-and-refuse)

Estas são proibidas neste projeto. Se estiver prestes a escrever uma,
reescreva a estrutura.

1. **Sem gradientes decorativos.**
   - `linear-gradient(...)`, `radial-gradient(...)`, `bg-gradient-to-*` →
     **proibidos** exceto como elemento de dado real (gráfico, faixa de
     cor única, faixa de cor invertida). Para cor única use `bg-primary`,
     `bg-accent`, etc.
   - Réguas decorativas de 1px na borda de card: cor sólida, sem gradient.
2. **Sem side-stripe borders em cards.**
   - `border-l-4 border-primary` etc. → **proibido**. Use background
     tint (`bg-primary-soft`), leading number, top border (`border-t`),
     ou nada.
3. **Sem lift-on-hover.**
   - `hover:-translate-y-*`, `hover:scale-*` → **proibido** em cards e
     links. Use `hover:border-accent`, `hover:text-accent`, ou
     `hover:bg-bg-subtle` (mais sóbrio).
4. **Sem `transition-all`.** Sempre `transition-colors`, `transition-shadow`
   ou `transition-[width]`. `transition-all` muda propriedades que não
   deveriam mudar.
5. **Sem emojis decorativos** (🔍 🎯 ✨ 💡). Emojis só se forem parte do
   dado (não decoração). Para ícones, SVG inline.
6. **Sem 3 cards idênticos seguidos** ("Identical card grids"). Se precisar
   de 3 afirmações: 1 stat-callout maior + 1 parágrafo inline + 1 nota
   com border-top. Varie a hierarquia visual.
7. **Glassmorphism** (`backdrop-blur-*` decorativo, `bg-*/30`) → proibido.
   `Navbar` usa `backdrop-blur` mas só como sticky header funcional com
   `bg-bg-alt/85` real por trás — não glassmorphism decorativo.
8. **Cream/sand body bg** (`OKLCH L 0.84–0.97, C < 0.06, hue 40–100`) →
   proibido. O body bg deve ter chroma 0 ou chroma em direção ao hue da
   marca (250° cool navy). Tokens como `--paper`, `--cream`, `--sand`
   são tells — não criar.

## Padrões de design system

- **Cores semânticas** em dados: `success` (aprovado), `danger` (reprovado),
  `warn` (zero). Acompanhe sempre com texto — sem dependência só de cor.
- **Eyebrow** (`<span className="eyebrow">`): usado em todas as seções como
  sistema de marca deliberado. Não é decoração vaga — é o "Introdução /
  Metodologia / Resultados / Visualizações / Indicador crítico / Análise de
  status / Conclusão / Créditos" do site. **Manter o padrão consistente.**
- **Border radius:** `rounded-[10px]` em logos/badges, `rounded-[14px]` em
  cards e inputs. Nada maior que 18px (`rounded-[18px]` é o novo `lg` no
  Tailwind).
- **Sombras:** `shadow-sm` em cards, `shadow-md` para hover leve.
  `shadow-lg` e `shadow-xl` foram removidos dos tokens — não reintroduzir.
- **Ícones:** SVG inline com `stroke-width="1.5"` ou `1.8`, nunca `<i>` ou
  bibliotecas de ícones externas.
- **Hero:** número real (taxa de aprovação 11,3%) com contexto ("em 4
  combinações, nenhuma ultrapassa 33%"). Nunca big-number sem significado.

## Layout & espaçamento

- Container: `mx-auto px-6 max-w-[1200px]` para seções largas,
  `max-w-[860px]` para texto corrido (largura de leitura confortável).
- Hierarquia de section: cada `<section>` com `py-20` (80px) ou
  `py-12/16` quando o ritmo pede. Section com `bg-bg-alt border-y border-line`
  quando alterna com body — não use `bg-gradient-*` para alternar.
- Grids responsivos: `grid md:grid-cols-[1fr_2fr] gap-4` etc. Use
  `repeat(auto-fit, minmax(280px, 1fr))` quando o conteúdo varia.
- Spacing tokens do Tailwind: `gap-3` (12px), `gap-4` (16px), `gap-6`
  (24px), `gap-12` (48px).

## Motion

- `prefers-reduced-motion: reduce` é obrigatório. Já em `globals.css`.
- Use `ease-out-quint` ou `ease-out-expo` em transições. Nada de bounce,
  elastic, spring.
- Reveal animations devem ter default já visível. Não gatear conteúdo
  visível em class-triggered transition.

## Acessibilidade (já implementado, manter)

- `lang="pt-BR"` no `<html>`.
- `:focus-visible` declarado em `globals.css`.
- Contraste AA (4.5:1 corpo, 3:1 large text). Tokens já cumprem.
- `aria-label`, `aria-hidden`, `aria-expanded`, `role` onde necessário.
- `tabular-nums` em todos os números.
- Skip-to-content link no layout (`.sr-only focus:not-sr-only`).
- Touch targets mínimo 36×36px (44×44px em mobile).

## Print CSS

- `@page A4 portrait, 14mm`. 5 páginas (hero + stats, status + metodologia,
  boxplot + histogram, bars + conclusão, autores + footer).
- Já implementado em `globals.css @media print`. Se mudar estilos visuais,
  revisar o `@media print` correspondente.
- Forçar cores hex em `:root` (não OKLCH) porque impressora e PDF nem
  sempre renderizam OKLCH.

## Stack & comandos

```bash
npm run dev      # http://localhost:3001
npm run build    # produção
npm run lint     # next lint
```

- **Next.js 16.2.9** (App Router, RSC, Server Actions)
- **React 19**, **TypeScript strict**
- **Tailwind 3.4** (utility-first, tokens em `tailwind.config.ts`)
- **Chart.js 4** via dynamic import (`components/charts/Charts.tsx`)
- **Supabase** (`@supabase/ssr`) opcional — fallback demo em `data/seed.json`

## Antes de commitar

- [ ] `node .opencode/skills/impeccable/scripts/detect.mjs app components` → 0 violações.
- [ ] `npm run lint` → clean.
- [ ] `npm run build` → success.
- [ ] Smoke test: `npm run dev` → abrir `/`, `/admin/login` (senha `ufmt2024`), `/admin`.
- [ ] Print preview: abrir `/`, Ctrl+P → 5 páginas.
- [ ] Mobile: DevTools 375px → nav vira hamburger, tabelas continuam legíveis.
- [ ] Dark mode: toggle → contrast OK em todas as seções.

## Quando estiver em dúvida

1. Leia `PRODUCT.md` (anti-referências e princípios).
2. Rode `node .opencode/skills/impeccable/scripts/context.mjs`.
3. Se for design novo, leia `.opencode/skills/impeccable/reference/brand.md`.
4. Se for UI de admin/dashboard, leia `.opencode/skills/impeccable/reference/product.md`.
5. Se for auditoria, leia `.opencode/skills/impeccable/reference/audit.md`.
