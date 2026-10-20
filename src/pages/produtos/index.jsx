import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { lineInfo, products } from "../../../lib/catalog";
import Menu from "../../components/menu";
import Rodape from "../../components/rodape";
import Whats from "../../components/whats";
import { ArrowRight } from "lucide-react";

export default function ProdutosPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return [];

    return products.filter((product) => {
      const line = lineInfo[product.line]?.label ?? "";
      return `${product.name} ${line} ${product.description}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [query]);

  return (
    <>
      <Head>
        <title>Produtos | NEXT Implementos</title>
        <meta
          name="description"
          content="Conheça os guindastes, cestas aéreas, cabines suplementares e implementos para bebidas da NEXT."
        />
        <meta property="og:title" content="Produtos | NEXT Implementos" />
        <meta
          property="og:description"
          content="Equipamentos preparados para grandes desafios."
        />
        <meta property="og:type" content="website" />
      </Head>

      <Menu />

      <main>
        <section className="relative overflow-hidden bg-industrial px-5 pb-20 pt-32 text-surface-contrast lg:px-10 lg:pb-28 lg:pt-44">
          <div className="absolute inset-0">
            <img
              src="/static/images/next-hero.jpg"
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="hero-shade absolute inset-0" />
          </div>

          <div className="relative mx-auto max-w-[1480px]">
            <p className="eyebrow text-primary">Catálogo NEXT</p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl uppercase leading-[0.98] sm:text-6xl lg:text-8xl">
              Equipamentos preparados para grandes desafios.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-surface-contrast/75">
              Conheça as soluções NEXT para diferentes operações e segmentos.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1480px]">
            <label htmlFor="busca-produtos" className="sr-only">
              Buscar produtos
            </label>
            <input
              id="busca-produtos"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por modelo ou equipamento..."
              className="h-14 w-full max-w-2xl rounded-none border border-border bg-background px-5 text-base text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {query.trim() ? (
              <div className="mt-12">
                <p className="eyebrow text-primary">Resultados da busca</p>
                <h2 className="mt-3 font-display text-3xl uppercase">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "resultado" : "resultados"}
                </h2>

                {filtered.length > 0 ? (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((product) => (
                      <Link
                        key={`${product.line}-${product.slug}`}
                        href={`/produtos/${product.line}/${product.slug}`}
                        className="group block"
                      >
                        <div className="overflow-hidden bg-steel">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="eyebrow mt-5 text-primary">
                          {lineInfo[product.line]?.label}
                        </p>
                        <h3 className="mt-2 font-display text-xl uppercase">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        <span className="mt-4 inline-block text-xs font-bold uppercase">
                          Conheça o equipamento →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-muted-foreground">
                    Nenhum produto encontrado. Tente buscar por outro nome.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mt-14">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="eyebrow text-primary">Vitrine industrial</p>

                      <h2 className="mt-4 font-display text-4xl uppercase lg:text-6xl">
                        Nosso catálogo.
                      </h2>

                      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                        Conheça nossas soluções em equipamentos e proteção
                        industrial.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <Link
                      key={`${product.line}-${product.slug}`}
                      href={`/produtos/${product.line}/${product.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-steel">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          width="1200"
                          height="1500"
                        />
                      </div>

                      <p className="eyebrow mt-5 text-primary">
                        {lineInfo[product.line]?.label}
                      </p>

                      <h3 className="mt-2 font-display text-2xl uppercase">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase">
                        Conheça o produto
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Rodape />
      <Whats />
    </>
  );
}
