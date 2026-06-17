import Navbar from "@/components/Navbar";
import { Boxplot, Histogram, ApprovalBars } from "@/components/charts/Charts";
import { StatusBreakdown } from "@/components/charts/StatusBreakdown";
import { getAutores, getGrupos, getMetadata } from "@/lib/data";
import type { Grupo } from "@/lib/types";

export default async function HomePage() {
  const grupos = getGrupos(5.0);
  const meta = getMetadata();
  const autores = getAutores();

  const geralMean = grupos.reduce((a, g) => a + g.stats.mean, 0) / grupos.length;
  const geralMedian = grupos.reduce((a, g) => a + g.stats.median, 0) / grupos.length;
  const geralSD = grupos.reduce((a, g) => a + g.stats.sd, 0) / grupos.length;
  const approvalMean = grupos.reduce((a, g) => a + g.approval, 0) / grupos.length;

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: meta.titulo,
    description: "Notas finais de Cálculo I e VGA de duas turmas da UFMT",
    creator: autores.map((a) => ({ "@type": "Person", name: a.nome })),
    publisher: { "@type": "Organization", name: meta.universidade },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* ============== HERO ============== */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 -z-10" style={{
          background: "radial-gradient(800px 400px at 85% 0%, rgba(255,107,61,0.10), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(26,58,92,0.10), transparent 60%)",
        }} />
        <div className="container mx-auto px-6 max-w-[1200px] grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <span className="eyebrow eyebrow--primary">
              Estudo Comparativo · UFMT
            </span>
            <h1 className="font-serif font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
              Análise de Desempenho Acadêmico em{" "}
              <span className="text-accent">Cálculo I</span> e{" "}
              <span className="text-accent">VGA</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl">
              Um panorama quantitativo do aproveitamento de duas turmas (X e Y) nas disciplinas
              de Cálculo I e Vetores e Geometria Analítica, identificando padrões, diferenças e
              sinais de alerta no processo de ensino-aprendizagem.
            </p>
            <div className="flex gap-3 flex-wrap mt-7 mb-9">
              <a href="#estatisticas" className="inline-flex items-center px-5 py-3 font-semibold text-sm rounded-full bg-primary text-white shadow-md hover:bg-primary-2 transition-colors">
                Ver os dados →
              </a>
              <a href="#conclusao" className="inline-flex items-center px-5 py-3 font-semibold text-sm rounded-full border border-line-2 text-ink-2 hover:text-accent hover:border-accent transition-colors">
                Ler conclusões →
              </a>
            </div>
            <ul className="grid grid-cols-3 gap-4 border-t border-line pt-5">
              <li><strong className="block text-[11px] tracking-widest uppercase text-muted-2 font-semibold">Universidade</strong><span className="text-ink-2 font-medium text-sm">UFMT</span></li>
              <li><strong className="block text-[11px] tracking-widest uppercase text-muted-2 font-semibold">Orientador</strong><span className="text-ink-2 font-medium text-sm">Prof. Dr. Laudino Roces Rodrigues</span></li>
              <li><strong className="block text-[11px] tracking-widest uppercase text-muted-2 font-semibold">Autores</strong><span className="text-ink-2 font-medium text-sm">Davi Roque Luiz · João Baptista Zanin</span></li>
            </ul>
          </div>

          <aside className="bg-bg-alt border border-line rounded-[22px] p-8 shadow-md relative">
            <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-accent to-accent-2 rounded-b" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-muted">
              Taxa média de aprovação
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5 mb-2">
              <span className="font-serif font-semibold text-7xl text-ink-2 leading-none">
                {approvalMean.toFixed(1).replace(".", ",")}
              </span>
              <span className="text-2xl text-accent font-semibold">%</span>
            </div>
            <p className="text-muted text-sm mb-5">
              Em 4 combinações de turma &amp; disciplina, nenhuma ultrapassa 33%.
            </p>
            <div className="grid grid-cols-2 gap-3 border-t border-line pt-5">
              {grupos.map((g) => (
                <div key={g.id}>
                  <span className="font-serif font-semibold text-2xl text-ink-2 block">
                    {g.approval.toFixed(2).replace(".", ",")}%
                  </span>
                  <span className="text-xs text-muted">{g.short}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ============== STRIP ============== */}
      <section className="bg-gradient-to-br from-primary to-primary-2 text-white py-7">
        <div className="container mx-auto px-6 max-w-[1200px] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif font-semibold text-3xl md:text-4xl leading-none">
              {geralMean.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-xs opacity-80 mt-1">Média geral das notas finais</div>
          </div>
          <div>
            <div className="font-serif font-semibold text-3xl md:text-4xl leading-none">
              {geralMedian.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-xs opacity-80 mt-1">Mediana geral (nota central)</div>
          </div>
          <div>
            <div className="font-serif font-semibold text-3xl md:text-4xl leading-none">
              {geralSD.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-xs opacity-80 mt-1">Desvio padrão médio</div>
          </div>
          <div>
            <div className="font-serif font-semibold text-3xl md:text-4xl leading-none">
              {grupos.length}
            </div>
            <div className="text-xs opacity-80 mt-1">Combinações turma × disciplina</div>
          </div>
        </div>
      </section>

      {/* ============== INTRO ============== */}
      <section id="introducao" className="py-20">
        <div className="container mx-auto px-6 max-w-[860px]">
          <span className="eyebrow">Introdução</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-5">Por que estudar o desempenho em cálculo?</h2>
          <p className="text-ink">
            O ensino de disciplinas de base como <strong>Cálculo I</strong> e{" "}
            <strong>Vetores e Geometria Analítica (VGA)</strong> é fundamental para a formação
            de estudantes em ciências exatas e engenharias. Ainda assim, é comum observar
            altas taxas de reprovação que afetam a permanência e o progresso no curso.
          </p>
          <p>
            Este estudo propõe uma análise detalhada do desempenho acadêmico de duas turmas da
            Universidade Federal de Mato Grosso nessas disciplinas, com o objetivo de fornecer um
            panorama quantitativo que subsidie discussões e ações pedagógicas futuras.
          </p>
          <div className="bg-accent-soft border border-accent-soft-border p-5 rounded-[14px] mt-6 flex gap-4">
            <span aria-hidden="true" className="flex-shrink-0 w-8 h-8 grid place-items-center rounded-full bg-accent text-white font-serif font-semibold">i</span>
            <p className="m-0 text-ink-2">
              <strong className="text-accent">Objetivo:</strong> identificar padrões, diferenças e
              similaridades no aproveitamento dos alunos em ambas as disciplinas e turmas, oferecendo
              insumos para compreender os desafios e sucessos do processo de ensino-aprendizagem.
            </p>
          </div>
        </div>
      </section>

      {/* ============== METODOLOGIA ============== */}
      <section id="metodologia" className="py-20 bg-bg-alt border-y border-line">
        <div className="container mx-auto px-6 max-w-[860px]">
          <span className="eyebrow">Metodologia</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-5">Como os dados foram tratados</h2>
          <p>
            Foram coletadas as notas finais de duas turmas, designadas como <em>Turma X</em> e{" "}
            <em>Turma Y</em>, nas disciplinas de Cálculo I e VGA. Os dados foram organizados e
            processados com ferramentas de análise estatística, passando pelas seguintes etapas:
          </p>
          <ol className="space-y-3 mt-7">
            {[
              ["1", "Estatísticas descritivas", "Cálculo de média, desvio padrão, mínimo, máximo e quartis (Q1, mediana e Q3) para cada grupo."],
              ["2", "Taxas de aprovação", "Considerou-se aprovada a obtenção de nota ≥ 5,0, conforme as diretrizes da UFMT."],
              ["3", "Visualização dos dados", "Boxplots e histogramas para a distribuição de notas, e gráfico de barras para comparar as taxas de aprovação."],
            ].map(([num, title, desc]) => (
              <li key={num} className="grid grid-cols-[auto_1fr] gap-4 bg-bg-alt border border-line rounded-[14px] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="w-10 h-10 rounded-[10px] grid place-items-center bg-primary-soft text-primary font-serif font-semibold text-lg">{num}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
                  <p className="text-muted m-0">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============== ESTATÍSTICAS ============== */}
      <section id="estatisticas" className="py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Resultados</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Estatísticas descritivas das notas</h2>
          <p className="text-muted text-lg mb-9">
            A análise quantitativa revela um desempenho médio abaixo do esperado em ambas as
            disciplinas, com medianas que evidenciam a dificuldade geral dos estudantes.
          </p>

          <div className="border border-line rounded-[14px] overflow-hidden bg-bg-alt shadow-sm overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-[11px] tracking-wider uppercase font-semibold bg-primary-soft text-primary text-left">Estatística</th>
                  {grupos.map((g) => (
                    <th key={g.id} scope="col" className="px-4 py-3.5 text-[11px] tracking-wider uppercase font-semibold bg-primary-soft text-primary text-center">
                      {g.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Média", (g: Grupo) => g.stats.mean.toFixed(2).replace(".", ",")],
                  ["Mediana", (g: Grupo) => g.stats.median.toFixed(2).replace(".", ",")],
                  ["Desvio padrão", (g: Grupo) => g.stats.sd.toFixed(2).replace(".", ",")],
                  ["Mínimo", (g: Grupo) => g.stats.min.toFixed(2).replace(".", ",")],
                  ["Q1 (25%)", (g: Grupo) => g.stats.q1.toFixed(2).replace(".", ",")],
                  ["Q3 (75%)", (g: Grupo) => g.stats.q3.toFixed(2).replace(".", ",")],
                  ["Máximo", (g: Grupo) => g.stats.max.toFixed(2).replace(".", ",")],
                  ["Nº de alunos", (g: Grupo) => String(g.notas.length)],
                  ["Aprovação (%)", (g: Grupo) => g.approval.toFixed(2).replace(".", ",") + "%"],
                ].map(([label, fn]: any, i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-bg-alt" : "bg-bg-subtle"}>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink-2 border-t border-line text-sm">{label}</th>
                    {grupos.map((g) => (
                      <td key={g.id} className="px-4 py-3 text-center text-sm border-t border-line tabular-nums">
                        {fn(g)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Findings — varied layout: stat callout + observation list.
              Avoids the 3 identical cards pattern (anti-pattern). */}
          <div className="grid md:grid-cols-[1fr_2fr] gap-4 mt-9">
            <aside className="bg-primary-soft border border-line rounded-[14px] p-6 shadow-sm">
              <div className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">Achado central</div>
              <div className="font-serif font-semibold text-5xl text-ink-2 leading-none mb-3">3<span className="text-2xl text-muted">/4</span></div>
              <p className="text-ink-2 m-0 text-sm">
                grupos têm <strong>mediana abaixo de 1,0</strong> — metade dos alunos não atinge esse limiar.
              </p>
            </aside>
            <ul className="space-y-3">
              {[
                { label: "Alta dispersão", body: "Desvios padrão entre 2,7 e 3,0 revelam que poucos alunos se destacam; a maioria se concentra nas faixas mais baixas." },
                { label: "VGA levemente melhor", body: "Em ambas as turmas, VGA apresenta médias e medianas superiores às de Cálculo I — perfis de dificuldade distintos." },
                { label: "Zeros pesam mais do que a taxa sugere", body: "Em 3 dos 4 grupos, mais de 40% zeraram ou não compareceram à prova final." },
              ].map((o) => (
                <li key={o.label} className="bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm flex gap-4">
                  <span aria-hidden="true" className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-accent" />
                  <div>
                    <strong className="block text-ink-2 font-semibold mb-1">{o.label}</strong>
                    <p className="text-muted m-0 text-sm">{o.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============== DISTRIBUIÇÃO ============== */}
      <section id="distribuicao" className="py-20 bg-bg-alt border-y border-line">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Visualizações</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Distribuição das notas</h2>
          <p className="text-muted text-lg mb-9">
            A análise visual revela alta concentração de notas próximas de zero, com a mediana
            colada ao quartil inferior e alguns valores atípicos superiores.
          </p>

          <div className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm mb-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <h3 className="text-lg font-semibold m-0">Figura 1 · Boxplot (min, Q1, mediana, Q3, máximo)</h3>
              <div className="flex flex-wrap gap-3 text-xs text-muted">
                <span className="flex items-center gap-1.5 before:content-[''] before:w-3 before:h-3 before:rounded-sm before:bg-x" style={{ position: "relative" }}><span className="w-3 h-3 inline-block rounded-sm" style={{background:"var(--x)"}}/>Turma X</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block rounded-sm" style={{background:"var(--y)"}}/>Turma Y</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block rounded-sm" style={{background:"var(--calc)"}}/>Cálculo I</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block rounded-sm" style={{background:"var(--vga)"}}/>VGA</span>
              </div>
            </div>
            <Boxplot grupos={grupos} cutoff={5} />
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 mt-3 border-t border-dashed border-line text-xs text-muted">
              <span className="flex items-center gap-2"><i className="inline-block w-3.5 h-2.5 border-2 border-x" style={{ background: "#1a3a5c33" }}></i> Q1–Q3 (50% central)</span>
              <span className="flex items-center gap-2"><i className="inline-block w-[18px] h-[3px] bg-ink" style={{ position: "relative", top: "-1px" }}></i> Mediana</span>
              <span className="flex items-center gap-2"><i className="inline-block w-2.5 h-2.5 bg-accent rotate-45" style={{ position: "relative", top: "1px" }}></i> Média</span>
              <span className="flex items-center gap-2"><i className="inline-block w-0.5 h-3.5 bg-muted"></i> Whiskers (mín–máx)</span>
            </div>
            <p className="text-xs text-muted mt-3 mb-0">
              Linha tracejada vermelha marca a nota mínima de aprovação (5,0). Passe o mouse sobre as caixas para detalhes.
            </p>
          </div>

          <div className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <h3 className="text-lg font-semibold m-0">Figura 2 · Histograma — frequência de notas</h3>
              <span className="text-muted text-xs">Calculado a partir das notas brutas</span>
            </div>
            <Histogram grupos={grupos} cutoff={5} bins={10} />
            <p className="text-xs text-muted mt-3 mb-0">
              Frequência relativa (%) por faixa. A linha vermelha em 5,0 indica o corte de aprovação.
            </p>
          </div>
        </div>
      </section>

      {/* ============== APROVAÇÃO ============== */}
      <section id="aprovacao" className="py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Indicador crítico</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Taxas de aprovação</h2>
          <p className="text-muted text-lg mb-9">
            Considerando o critério de aprovação da UFMT (nota final ≥ 5,0), os resultados são
            preocupantes em todas as combinações — nenhum dos grupos ultrapassa um terço dos
            alunos aprovados.
          </p>

          <div className="grid md:grid-cols-[1.7fr_1fr] gap-5">
            <div className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm" style={{ background: "linear-gradient(180deg, #fff 0%, #fafbfd 100%)" }}>
              <h3 className="text-lg font-semibold mb-4">Figura 3 · Taxa de aprovação por turma e disciplina</h3>
              <ApprovalBars grupos={grupos} cutoff={5} />
            </div>
            <ul className="space-y-2.5">
              {grupos.map((g) => (
                <li key={g.id} className="flex items-center gap-3 bg-bg-alt border border-line rounded-[14px] p-4 shadow-sm">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.disciplinaColor }} />
                  <div>
                    <strong className="font-serif text-2xl text-ink-2 font-semibold leading-none block">
                      {g.approval.toFixed(2).replace(".", ",")}%
                    </strong>
                    <small className="block text-muted text-xs mt-1">{g.label}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center gap-4 bg-accent-soft border border-accent-soft-border rounded-[14px] p-4">
            <span className="font-serif text-xl font-semibold bg-accent text-white w-10 h-10 grid place-items-center rounded-full flex-shrink-0">5,0</span>
            <p className="text-ink-2 m-0 text-sm">Critério de aprovação usado pela UFMT — e a nota média nunca chega perto disso.</p>
          </div>
        </div>
      </section>

      {/* ============== STATUS / ANÁLISE APROFUNDADA ============== */}
      <section id="status" className="py-20 bg-bg-alt border-y border-line">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Análise de status</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Aprovados, reprovados e zeros</h2>
          <p className="text-muted text-lg mb-9 max-w-3xl">
            Para cada turma, separamos os alunos em três grupos: <strong>aprovados</strong> (≥ 5,0),
            <strong> reprovados com nota</strong> (0 &lt; nota &lt; 5,0) e <strong>zeros</strong> (não compareceram ou zeraram a prova final).
            A "cauda esquerda" (notas baixíssimas) pesa mais do que a taxa agregada sugere.
          </p>

          <StatusBreakdown grupos={grupos} cutoff={5} />

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-accent-soft border border-accent-soft-border rounded-[14px] p-5">
              <div className="text-xs font-semibold tracking-wide uppercase text-accent mb-1">Achado central</div>
              <p className="text-ink-2 m-0 text-sm">
                Em <strong>3 dos 4 grupos</strong>, mais de <strong>40%</strong> dos alunos tiraram
                <strong> zero</strong> ou não compareceram à prova final. Combinado com a reprovação por nota,
                isso indica que boa parte dos "reprovados" nem chegou a ser avaliada de fato.
              </p>
            </div>
            <div className="bg-success-soft border border-success/20 rounded-[14px] p-5">
              <div className="text-xs font-semibold tracking-wide uppercase text-success mb-1">Leitura por disciplina</div>
              <p className="text-ink-2 m-0 text-sm">
                <strong>VGA</strong> consistentemente apresenta mais aprovados que <strong>Cálculo I</strong>
                em ambas as turmas. A diferença é pequena em números absolutos, mas sugere perfis de
                dificuldade distintos entre as duas disciplinas.
              </p>
            </div>
            <div className="bg-primary-soft border border-primary/20 rounded-[14px] p-5">
              <div className="text-xs font-semibold tracking-wide uppercase text-primary mb-1">Recomendação</div>
              <p className="text-ink-2 m-0 text-sm">
                Investigar políticas de <strong>frequência e engajamento</strong> antes de propor
                mudanças no conteúdo programático. A taxa de zeros sugere que o problema começa
                <em> antes</em> da prova.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CONCLUSÃO ============== */}
      <section id="conclusao" className="py-20 bg-bg-alt border-y border-line">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Conclusão</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Um quadro que pede ação</h2>
          <p className="text-muted text-lg mb-9">
            A análise revela um desafio significativo no desempenho dos alunos nas disciplinas
            de Cálculo I e VGA na UFMT. As baixas médias e taxas de aprovação indicam que a
            maioria não atinge o nível de proficiência esperado — um sinal de alerta para a
            formação dos futuros profissionais e para a evasão universitária.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            <article className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <header className="flex items-center gap-2 mb-3"><span aria-hidden="true" className="text-xl">🔍</span><h3 className="text-lg font-semibold m-0">Diagnóstico</h3></header>
              <p className="text-muted m-0">
                Necessidade de investigar as causas subjacentes: metodologias de ensino,
                pré-requisitos dos ingressantes e adequação da carga horária.
              </p>
            </article>
            <article className="bg-bg-alt border border-line rounded-[14px] p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              <header className="flex items-center gap-2 mb-3"><span aria-hidden="true" className="text-xl">🎯</span><h3 className="text-lg font-semibold m-0">Ação</h3></header>
              <p className="text-muted m-0">
                Implementação de estratégias eficazes e recursos de apoio ao estudante
                (monitoria, nivelamento, material multimídia) para melhorar o aproveitamento.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============== AUTORES ============== */}
      <section id="autores" className="py-20">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <span className="eyebrow">Créditos</span>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Autores &amp; agradecimentos</h2>
          <p className="text-muted text-lg mb-9">
            Expressamos nossa gratidão ao Prof. Dr. Laudino Roces Rodrigues pela orientação,
            pela disponibilização dos dados e pelo apoio fundamental no desenvolvimento desta
            análise acadêmica.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {autores.map((a) => (
              <article key={a.nome} className="bg-bg-alt border border-line rounded-[14px] p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center text-white font-serif font-semibold text-xl"
                  style={{ background: a.orientador ? "linear-gradient(135deg, #ff6b3d, #ff8c66)" : "linear-gradient(135deg, #1a3a5c, #244a73)" }}
                >
                  {a.iniciais}
                </div>
                <h3 className="text-lg font-semibold mb-1.5">{a.nome}</h3>
                <p className="text-muted m-0 text-sm">{a.papel} · UFMT</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="bg-ink-2 text-on-dark py-9 text-sm">
        <div className="container mx-auto px-6 max-w-[1200px] flex items-start justify-between flex-wrap gap-8">
          <div>
            <strong className="text-white block">{meta.universidade}</strong>
            <small className="text-on-dark-muted">Análise de Desempenho Acadêmico em Cálculo I e VGA</small>
          </div>
          <div className="max-w-[540px]">
            <span className="text-accent font-semibold">Referência: </span>
            <em className="not-italic text-on-dark italic">{meta.referencia}</em>
          </div>
        </div>
      </footer>
    </>
  );
}
