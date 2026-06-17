# Product

## Register

brand

## Users

Docentes, pesquisadores e coordenadores de cursos de exatas/engenharias da UFMT (Universidade Federal de Mato Grosso) que consultam o panorama quantitativo de desempenho em disciplinas de Cálculo I e Vetores e Geometria Analítica (VGA). Contexto: pesquisa acadêmica de iniciação científica, leitura em desktop e mobile, foco em transparência e reprodutibilidade dos dados.

## Product Purpose

Publicar de forma legível e auditável um estudo comparativo de duas turmas (X e Y) em Cálculo I e VGA — médias, medianas, dispersão, distribuição de notas, taxas de aprovação e desagregação por status (aprovado / reprovado por nota / zero) — oferecendo insumos para discutir metodologias de ensino, evasão e engajamento. Sucesso = leitor consegue extrair os achados em <2 min e baixar/compartilhar os dados; nenhum dos 4 grupos ultrapassa 33% de aprovação (achado central, não bug).

## Brand Personality

Sóbrio, acadêmico-científico, transparente. Não é marketing — é divulgação científica. 3 palavras: institucional, didático, rigoroso. Tom: paper de IC com cuidado visual, não blog post. Linguagem: pt-BR acadêmica, números formatados com vírgula, termos técnicos sem floreio.

## Anti-references

- Páginas SaaS modernas com gradientes vibrantes, glassmorphism e ilustrações 3D (saturado AI default de 2026).
- "Education startups" com hero big-number, kicker uppercase em todo section, e CTAs "Comece grátis" — inadequado ao contexto de pesquisa pública.
- Sites institucionais antigos da UFMT, Gov.br puro, templates Bootstrap não customizados.
- Layouts que escondem a metodologia ou os dados brutos atrás de dashboards fechados.

## Design Principles

1. **Os dados vêm antes do enfeite.** Cada gráfico precisa responder a uma pergunta explícita do leitor; decoração é discreta.
2. **Metodologia visível.** RLS, fonte dos dados, critério de aprovação (≥ 5,0) e tamanho da amostra sempre expostos.
3. **Hierarquia numérica clara.** Estatísticas-chave (mediana, taxa de aprovação) em destaque tipográfico; médias de fundo presentes mas sem competir.
4. **Acessibilidade científica.** Contraste AA mínimo, navegação por âncoras, HTML semântico, números em `tabular-nums`.
5. **Mobile-first mas desktop-honesto.** Tabelas e boxplots continuam legíveis em telas pequenas sem virar cards genéricos.

## Accessibility & Inclusion

- WCAG 2.1 AA mínimo: contraste 4.5:1 corpo / 3:1 large text.
- Suporte a `prefers-reduced-motion` no reveal e nas transições dos cards.
- Foco visível declarado em `:focus-visible` no globals.css.
- `lang="pt-BR"` declarado no `<html>`.
- Dados em formato aberto (CSV/TSV exportável) — inclusão para pesquisadores sem JS.
- Sem dependência de cor apenas: ícones e texto acompanham os status (aprovado / reprovado / zero).
