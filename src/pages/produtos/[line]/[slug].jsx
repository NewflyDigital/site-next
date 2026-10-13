import Head from "next/head";
import Link from "next/link";
import { getProduct, lineInfo, products } from "../../../../lib/catalog";
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";
import Whats from "../../../components/whats";

export default function ProdutoPage({ product }) {
  if (!product) return null;

  const info = lineInfo[product.line];
  const related = products
    .filter((item) => item.line === product.line && item.slug !== product.slug)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <>
      <Head>
        <title>{product.name} | NEXT Implementos</title>
        <meta name="description" content={product.description} />
        <meta
          property="og:title"
          content={`${product.name} | NEXT Implementos`}
        />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={`${siteUrl}${product.image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${siteUrl}/produtos/${product.line}/${product.slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: `${siteUrl}${product.image}`,
              brand: {
                "@type": "Brand",
                name: "NEXT Implementos",
              },
            }),
          }}
        />
      </Head>

      <Menu />

      <main>
        <section className="bg-industrial px-5 pb-16 pt-32 text-surface-contrast lg:px-10 lg:pb-20 lg:pt-44">
          <div className="mx-auto max-w-[1480px]">
            <nav
              className="flex flex-wrap items-center gap-2 text-xs text-surface-contrast/60"
              aria-label="Navegação estrutural"
            >
              <Link href="/produtos" className="hover:text-primary">
                Produtos
              </Link>
              <span>/</span>
              <Link
                href={`/produtos/${product.line}`}
                className="hover:text-primary"
              >
                {info.label}
              </Link>
              <span>/</span>
              <span>{product.name}</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="eyebrow text-primary">
                  {product.family ?? info.label}
                </p>
                <h1 className="mt-5 max-w-3xl font-display text-5xl uppercase leading-[0.94] sm:text-7xl lg:text-8xl">
                  {product.name}
                </h1>
                <p className="mt-7 max-w-xl text-lg text-surface-contrast/75">
                  {product.description}
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href={`/contato?produto=${encodeURIComponent(product.name)}`}
                    className="inline-flex min-h-12 items-center justify-center gap-3 bg-primary px-6 py-3 text-sm font-bold uppercase text-white transition-opacity hover:opacity-90"
                  >
                    Solicitar orçamento <span aria-hidden="true">↗</span>
                  </Link>
                  <Link
                    href="/contato"
                    className="inline-flex min-h-12 items-center justify-center border border-surface-contrast/30 px-6 py-3 text-sm font-bold uppercase transition-colors hover:bg-surface-contrast hover:text-industrial"
                  >
                    Falar com especialista
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden bg-steel">
                <img
                  src={product.image}
                  alt={`${product.name}, equipamento da NEXT Implementos`}
                  className="aspect-[16/10] w-full object-cover"
                  width="1200"
                  height="750"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </section>

        <nav className="sticky top-20 z-30 hidden border-b border-border bg-background/95 backdrop-blur lg:block">
          <div className="mx-auto flex h-14 max-w-[1480px] items-center gap-10 px-10 text-xs font-bold uppercase">
            <a href="#visao-geral" className="hover:text-primary">
              Visão geral
            </a>
            <a href="#diferenciais" className="hover:text-primary">
              Diferenciais
            </a>
            <a href="#especificacoes" className="hover:text-primary">
              Especificações
            </a>
            <a href="#modelos" className="hover:text-primary">
              Outros modelos
            </a>
          </div>
        </nav>

        <section
          id="visao-geral"
          className="scroll-mt-36 px-5 py-24 lg:px-10 lg:py-32"
        >
          <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="eyebrow text-primary">Visão geral</p>
              <h2 className="mt-5 font-display text-4xl uppercase leading-tight sm:text-5xl">
                Projetado para o mundo real.
              </h2>
            </div>
            <div>
              <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
                Uma solução NEXT desenvolvida para integrar-se a operações
                profissionais com foco em produtividade, segurança e
                confiabilidade.
              </p>
              <p className="mt-6 max-w-3xl text-muted-foreground">
                Cada configuração é definida conforme as necessidades da
                operação. Nossa equipe comercial pode orientar a composição
                adequada e disponibilizar as informações técnicas oficiais do
                equipamento.
              </p>
            </div>
          </div>
        </section>

        <section
          id="diferenciais"
          className="scroll-mt-36 bg-steel px-5 py-24 lg:px-10"
        >
          <div className="mx-auto max-w-[1480px]">
            <p className="eyebrow text-primary">Diferenciais</p>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Engenharia aplicada",
                "Construção robusta",
                "Suporte especializado",
                "Configuração por operação",
              ].map((item, index) => (
                <div key={item} className="bg-background p-8">
                  <span className="font-mono text-xs text-primary">
                    0{index + 1}
                  </span>
                  <div
                    className="mt-10 text-2xl text-primary"
                    aria-hidden="true"
                  >
                    ✓
                  </div>
                  <h3 className="mt-5 font-display text-xl uppercase">
                    {item}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="especificacoes"
          className="scroll-mt-36 px-5 py-24 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="eyebrow text-primary">Informação técnica</p>
                <h2 className="mt-5 font-display text-4xl uppercase">
                  Especificações
                </h2>
              </div>

              <div className="border-t-2 border-foreground">
                {[
                  "Capacidade",
                  "Alcance",
                  "Peso",
                  "Configuração",
                  "Aplicação",
                ].map((label) => (
                  <div
                    key={label}
                    className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-b border-border py-5"
                  >
                    <span className="font-semibold uppercase">{label}</span>
                    <span className="text-muted-foreground">
                      Consulte a equipe NEXT
                    </span>
                  </div>
                ))}
                <p className="mt-6 text-sm text-muted-foreground">
                  Os dados serão publicados após validação da ficha técnica
                  oficial deste modelo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section
            id="modelos"
            className="scroll-mt-36 bg-industrial px-5 py-24 text-surface-contrast lg:px-10"
          >
            <div className="mx-auto max-w-[1480px]">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow text-primary">Continue explorando</p>
                  <h2 className="mt-4 font-display text-4xl uppercase">
                    Outros modelos
                  </h2>
                </div>
                <Link
                  href={`/produtos/${product.line}`}
                  className="hidden border border-surface-contrast/30 px-5 py-3 text-xs font-bold uppercase transition-colors hover:bg-surface-contrast hover:text-industrial sm:inline-flex"
                >
                  Ver a linha →
                </Link>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/produtos/${item.line}/${item.slug}`}
                    className="group border border-surface-contrast/15"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 p-6">
                      <div>
                        <p className="eyebrow text-primary">
                          {item.family ?? info.label}
                        </p>
                        <h3 className="mt-2 font-display text-xl uppercase">
                          {item.name}
                        </h3>
                      </div>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-primary px-5 py-20 text-white lg:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-white/75">Fale com um especialista</p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-tight sm:text-5xl">
                Precisa deste equipamento na sua operação?
              </h2>
            </div>
            <Link
              href={`/contato?produto=${encodeURIComponent(product.name)}`}
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-6 py-3 text-sm font-bold uppercase text-industrial transition-opacity hover:opacity-90"
            >
              Solicitar orçamento →
            </Link>
          </div>
        </section>
      </main>

      <Rodape />
      <Whats />
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: products.map((product) => ({
      params: {
        line: product.line,
        slug: product.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const product = getProduct(params.line, params.slug);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
    },
  };
}
