const craneImage = "/static/images/product-crane.jpg";
const bucketImage = "/static/images/product-bucket.jpg";
const cabinImage = "/static/images/product-cabin.jpg";
const beverageImage = "/static/images/product-beverage.jpg";

export const lineInfo = {
  guindastes: {
    label: "Guindastes",
    headline: "Força, precisão e confiabilidade para movimentação de cargas.",
    description:
      "Equipamentos desenvolvidos para operações exigentes, com engenharia orientada à produtividade.",
    image: craneImage,
  },
  "cestas-aereas": {
    label: "Cestas Aéreas",
    headline: "Segurança para quem precisa chegar mais alto.",
    description:
      "Soluções para trabalho em altura projetadas para energia, telecomunicações e serviços urbanos.",
    image: bucketImage,
  },
  "cabines-suplementares": {
    label: "Cabines Suplementares",
    headline: "Mais espaço. Mais conforto. Mais segurança para sua equipe.",
    description:
      "Configurações para o transporte profissional de equipes em operações de campo.",
    image: cabinImage,
  },
  "linha-bebidas": {
    label: "Linha Bebidas",
    headline: "Eficiência para cada etapa da distribuição.",
    description:
      "Implementos que organizam a carga e tornam a rotina de distribuição mais produtiva.",
    image: beverageImage,
  },
};

const craneModels = [
  "NX 3.500",
  "NX 5.500",
  "NX 7.500",
  "NX 10.500",
  "NX 12.500",
  "NX 16.500",
  "NX 21.500",
  "NX 25.500",
  "NX 30.500",
  "NX 45.500",
  "NX 55.500",
  "NX 60.500",
  "NX 65.500",
];

const slugify = (value) =>
  value.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");

export const products = [
  ...craneModels.map((name) => ({
    name,
    slug: slugify(name),
    line: "guindastes",
    family: "Linha Trave",
    description:
      "Guindaste articulado para movimentação profissional de cargas.",
    image: craneImage,
    featured: name === "NX 21.500",

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  })),

  {
    name: "SkyCity 13.5 AT",
    slug: "skycity-13-5-at",
    line: "cestas-aereas",
    family: "SkyCity",
    description: "Cesta aérea para operações urbanas e infraestrutura.",
    image: bucketImage,
    featured: true,

    loadChart: "/static/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Cabine 4 lugares",
    slug: "cabine-4-lugares",
    line: "cabines-suplementares",
    description: "Configuração suplementar para transporte de equipes.",
    image: cabinImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Cabine 6 lugares",
    slug: "cabine-6-lugares",
    line: "cabines-suplementares",
    description: "Mais espaço e praticidade para equipes em campo.",
    image: cabinImage,
    featured: true,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Cabine 8 lugares",
    slug: "cabine-8-lugares",
    line: "cabines-suplementares",
    description: "Configuração ampliada para frotas especiais.",
    image: cabinImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Roll Up Híbrida",
    slug: "roll-up-hibrida",
    line: "linha-bebidas",
    description: "Solução versátil para distribuição de bebidas.",
    image: beverageImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Roll Up Alumínio",
    slug: "roll-up-aluminio",
    line: "linha-bebidas",
    description: "Agilidade e organização para rotas de distribuição.",
    image: beverageImage,
    featured: true,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "City Sider",
    slug: "city-sider",
    line: "linha-bebidas",
    description: "Implemento orientado à distribuição urbana.",
    image: beverageImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Sider Lonado",
    slug: "sider-lonado",
    line: "linha-bebidas",
    description: "Acesso lateral e flexibilidade operacional.",
    image: beverageImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
  {
    name: "Asa Delta",
    slug: "asa-delta",
    line: "linha-bebidas",
    description: "Abertura ampla para operações de carga e descarga.",
    image: beverageImage,

    loadChart: "/static/images/produtos/grafico-de-carga.png",
    loadChartPdf: "/documents/produtos/grafico-de-carga.pdf",
    videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk",
  },
];

export function getProduct(line, slug) {
  return products.find(
    (product) => product.line === line && product.slug === slug,
  );
}

{
  /*
  No arquivo lib/catalog, o objeto do produto poderá ter estas propriedades:
{
  // Demais dados do produto...
  loadChart: "/images/graficos/modelo-exemplo.png",
  loadChartPdf: "/arquivos/graficos/modelo-exemplo.pdf",
  videoUrl: "https://youtu.be/3TOzM23TuZ0?si=oMRVzrfX-q6FK-pk"
}  
  */
}
