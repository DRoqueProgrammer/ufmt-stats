/** Print-only header shown on @media print. Contains site title, authors,
 *  and date — useful when the printed page is detached from the URL. */
export function PrintHeader() {
  return (
    <header
      className="print-only"
      style={{
        padding: "0 0 12pt 0",
        marginBottom: "8pt",
        borderBottom: "2px solid #000",
      }}
    >
      <div style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Universidade Federal de Mato Grosso · Análise Acadêmica
      </div>
      <h1 style={{ fontSize: "18pt", margin: "2pt 0 4pt", color: "#000" }}>
        Análise de Desempenho Acadêmico em Cálculo I e VGA
      </h1>
      <div style={{ fontSize: "10pt", color: "#333" }}>
        Davi Roque Luiz · João Baptista Zanin · Prof. Dr. Laudino Roces Rodrigues
      </div>
      <div style={{ fontSize: "9pt", color: "#666", marginTop: "2pt" }}>
        ufmt-stats.vercel.app · Impresso em {new Date().toLocaleDateString("pt-BR")}
      </div>
    </header>
  );
}
