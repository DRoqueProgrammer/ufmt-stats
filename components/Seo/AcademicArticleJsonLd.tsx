/** JSON-LD structured data (Schema.org ScholarlyArticle) for the study.
 *  Rendered server-side as a <script type="application/ld+json"> so
 *  search engines and AI crawlers can parse the article metadata
 *  (title, authors, publisher, datePublished). */
type Author = { name: string; role?: string };

export function AcademicArticleJsonLd({
  title,
  description,
  url,
  authors,
}: {
  title: string;
  description: string;
  url: string;
  authors: Author[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: title,
    name: title,
    description,
    url,
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name: "Universidade Federal de Mato Grosso",
      url: "https://www.ufmt.br",
    },
    author: authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      jobTitle: a.role,
    })),
    about: [
      { "@type": "Thing", name: "Cálculo I" },
      { "@type": "Thing", name: "Vetores e Geometria Analítica" },
      { "@type": "Thing", name: "Desempenho acadêmico" },
    ],
    educationalLevel: "Higher education",
    isAccessibleForFree: true,
    inLanguage: "pt-BR",
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
