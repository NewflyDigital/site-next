import Head from "next/head";
import Link from "next/link";
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";
import Whats from "../../../components/whats";
import { useState } from "react";

import { db } from "../../../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

function getYouTubeEmbedUrl(value) {
  if (!value) return "";

  const input = String(value).trim();

  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);

    const host = url.hostname.replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      id =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ||
        "";
    }

    if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    // Se não for uma URL válida, verifica se o valor é um ID.
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return `https://www.youtube-nocookie.com/embed/${input}`;
  }

  return "";
}

export default function ProdutoPage({ product, related = [], info }) {
  const p = product;
  const infoProduto = info;

  const imagensProduto = [
    ...(p?.image ? [{ url: p.image, alt: p.name }] : []),
    ...(Array.isArray(p?.images)
      ? p.images
          .filter((imagem) => imagem?.url)
          .map((imagem, index) => ({
            url: imagem.url,
            alt: `${p.name} - imagem ${index + 2}`,
          }))
      : []),
  ];

  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  function navegarGaleria(direcao) {
    setImagemSelecionada((atual) => {
      if (imagensProduto.length <= 1) return 0;

      return (atual + direcao + imagensProduto.length) % imagensProduto.length;
    });
  }

  if (!p || !infoProduto) {
    return (
      <>
        <Menu />
        <main className="flex min-h-screen items-center justify-center px-5 pt-32">
          <div className="text-center">
            <p className="eyebrow text-primary">Produto indisponível</p>
            <h1 className="mt-4 font-display text-4xl uppercase">
              Equipamento não encontrado
            </h1>
            <Link
              href="/produtos"
              className="mt-8 inline-flex items-center bg-primary px-6 py-3 text-sm font-bold uppercase text-white"
            >
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <Rodape />
        <Whats />
      </>
    );
  }

  // Mantenha aqui o restante do JSX atual da página.

  return (
    <>
      <Menu />
      <main>
        <section className="bg-industrial px-5 pb-16 pt-32 text-surface-contrast lg:px-10 lg:pb-20 lg:pt-44">
          <div className="mx-auto max-w-[1480px]">
            <nav
              className="flex flex-wrap items-center gap-2 text-xs text-surface-contrast/55"
              aria-label="Navegação estrutural"
            >
              <Link href="/produtos">Produtos</Link>
              <span>/</span>
              <Link href={`/produtos/${p.line}`}>{infoProduto.label}</Link>
              <span>/</span>
              <span className="text-surface-contrast">{p.name}</span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div className="reveal">
                <p className="eyebrow text-primary">
                  {p.family ?? infoProduto.label}
                </p>

                <h1 className="mt-5 max-w-3xl font-display text-6xl uppercase leading-[0.94] sm:text-7xl lg:text-8xl">
                  {p.name}
                </h1>

                <p className="mt-7 max-w-xl text-lg text-surface-contrast/70">
                  {p.description}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={{
                      pathname: "/contato",
                      query: { produto: p.name },
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-bold uppercase text-white"
                  >
                    Solicitar orçamento
                    <span aria-hidden="true">↗</span>
                  </Link>

                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 border border-surface-contrast/25 bg-transparent px-6 py-3 text-sm font-bold uppercase text-surface-contrast opacity-60"
                  >
                    Catálogo indisponível
                    <span aria-hidden="true">↓</span>
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                {/* Imagem principal */}
                <div className="group relative overflow-hidden bg-white/5">
                  {imagensProduto.length > 0 ? (
                    <>
                      <img
                        key={imagensProduto[imagemSelecionada]?.url}
                        src={imagensProduto[imagemSelecionada]?.url}
                        alt={
                          imagensProduto[imagemSelecionada]?.alt ||
                          `${p.name}, equipamento da NEXT Implementos`
                        }
                        className="aspect-[16/10] w-full object-contain transition-opacity duration-300 sm:object-cover"
                        width="1200"
                        height="750"
                      />

                      {/* Setas para navegar entre as imagens */}
                      {imagensProduto.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => navegarGaleria(-1)}
                            aria-label="Ver imagem anterior"
                            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-industrial/80 text-2xl text-white transition hover:bg-primary"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={() => navegarGaleria(1)}
                            aria-label="Ver próxima imagem"
                            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-industrial/80 text-2xl text-white transition hover:bg-primary"
                          >
                            ›
                          </button>

                          <span className="absolute bottom-3 right-3 bg-industrial/85 px-3 py-1 text-xs font-bold text-white">
                            {imagemSelecionada + 1} / {imagensProduto.length}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center text-sm text-surface-contrast/60">
                      Imagem indisponível
                    </div>
                  )}
                </div>

                {/* Miniaturas abaixo da imagem principal */}
                {imagensProduto.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-4 xl:grid-cols-5">
                    {imagensProduto.map((imagem, index) => (
                      <button
                        key={`${imagem.url}-${index}`}
                        type="button"
                        onClick={() => setImagemSelecionada(index)}
                        aria-label={`Exibir imagem ${index + 1} de ${imagensProduto.length}`}
                        aria-pressed={imagemSelecionada === index}
                        className={`overflow-hidden border-2 bg-white/5 transition ${
                          imagemSelecionada === index
                            ? "border-primary opacity-100"
                            : "border-surface-contrast/15 opacity-65 hover:border-surface-contrast/60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imagem.url}
                          alt={imagem.alt}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
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
                {p.overviewTitle || p.name}
              </h2>
            </div>

            <div>
              {p.overviewText && (
                <p className="max-w-3xl whitespace-pre-line text-xl leading-relaxed text-muted-foreground">
                  {p.overviewText}
                </p>
              )}

              {p.overviewDetails && (
                <p className="mt-6 max-w-3xl whitespace-pre-line text-muted-foreground">
                  {p.overviewDetails}
                </p>
              )}

              {!p.overviewText && !p.overviewDetails && p.description && (
                <p className="max-w-3xl whitespace-pre-line text-xl leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              )}
            </div>
          </div>
        </section>
        {p.differentials?.filter(Boolean).length > 0 && (
          <section
            id="diferenciais"
            className="scroll-mt-36 bg-steel px-5 py-24 lg:px-10"
          >
            <div className="mx-auto max-w-[1480px]">
              <p className="eyebrow text-primary">Diferenciais</p>

              <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                {p.differentials.filter(Boolean).map((item, index) => (
                  <div className="bg-background p-8" key={`${item}-${index}`}>
                    <span className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="mt-10 block text-2xl text-primary"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <h3 className="mt-5 font-display text-xl uppercase">
                      {item}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                {(p.specifications || [])
                  .filter((item) => item.label?.trim() || item.value?.trim())
                  .map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-b border-border py-5"
                    >
                      <span className="font-semibold uppercase">
                        {item.label}
                      </span>

                      <span className="whitespace-pre-line text-muted-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}

                {(!p.specifications ||
                  !p.specifications.some(
                    (item) => item.label?.trim() || item.value?.trim(),
                  )) && (
                  <p className="py-5 text-muted-foreground">
                    As especificações técnicas deste equipamento serão
                    disponibilizadas em breve.
                  </p>
                )}
              </div>
            </div>

            {/* Gráfico de carga */}
            {p.loadChart && (
              <div className="mt-16 w-full">
                <div className="w-full bg-red-600 px-6 py-5 text-center text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                  Gráfico de carga
                </div>

                <div className="mt-6 w-full overflow-hidden">
                  <img
                    src={p.loadChart}
                    alt={`Gráfico de carga do equipamento ${p.name}`}
                    className="block h-auto w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {p.videoUrl && (
          <div className="mt-16 w-full">
            <div className="w-full bg-red-600 px-6 py-5 text-center text-base font-bold uppercase tracking-wider text-white sm:text-lg">
              Vídeo do equipamento
            </div>

            <div className="mt-6 w-full overflow-hidden bg-black">
              <div className="aspect-video w-full">
                <iframe
                  src={getYouTubeEmbedUrl(p.videoUrl)}
                  title={`Vídeo de ${p.name}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

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
                  href={`/produtos/${p.line}`}
                  className="hidden items-center gap-2 border border-surface-contrast/30 px-5 py-3 text-sm font-bold uppercase text-surface-contrast sm:inline-flex"
                >
                  Ver a linha <span aria-hidden="true">→</span>
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
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-6">
                      <div>
                        <p className="eyebrow text-primary">
                          {item.family ?? infoProduto.label}
                        </p>
                        <h3 className="mt-2 font-display text-xl uppercase">
                          {item.name}
                        </h3>
                      </div>
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-primary px-5 py-20 text-primary-foreground lg:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-primary-foreground/70">
                Fale com um especialista
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-tight sm:text-5xl">
                Precisa deste equipamento na sua operação?
              </h2>
            </div>

            <Link
              href={{
                pathname: "/contato",
                query: { produto: p.name },
              }}
              className="inline-flex items-center gap-2 bg-background px-6 py-4 text-sm font-bold uppercase text-foreground"
            >
              Solicitar orçamento <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <aside className="fixed bottom-6 right-6 z-30 hidden md:block">
          <Link
            href={{
              pathname: "/contato",
              query: { produto: p.name },
            }}
            className="inline-flex items-center bg-industrial px-6 py-4 text-sm font-bold uppercase text-surface-contrast shadow-menu"
          >
            Solicitar orçamento
          </Link>
        </aside>
      </main>

      <Rodape />
      <Whats />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { line, slug } = params;

    const [snapshotProdutos, snapshotLinhas] = await Promise.all([
      getDocs(query(collection(db, "produtos"), where("ativo", "==", true))),
      getDocs(query(collection(db, "linhas"), where("ativo", "==", true))),
    ]);

    const produtos = snapshotProdutos.docs.map((item) => {
      const dados = item.data();

      return {
        ...dados,
        id: item.id,
        criadoEm: dados.criadoEm?.toDate?.().toISOString() ?? null,
        atualizadoEm: dados.atualizadoEm?.toDate?.().toISOString() ?? null,
      };
    });

    const linhas = snapshotLinhas.docs.map((item) => {
      const dados = item.data();

      return {
        ...dados,
        id: item.id,
        criadoEm: dados.criadoEm?.toDate?.().toISOString() ?? null,
        atualizadoEm: dados.atualizadoEm?.toDate?.().toISOString() ?? null,
      };
    });

    const product = produtos.find(
      (item) =>
        item.line === line && item.slug === slug && item.ativo !== false,
    );

    if (!product) {
      return { notFound: true };
    }

    const linha = linhas.find((item) => item.slug === product.line);

    const info = {
      label: linha?.nome || product.line,
      description:
        linha?.description ||
        linha?.headline ||
        "Conheça as soluções da NEXT Implementos para sua operação.",
      headline:
        linha?.headline ||
        `Conheça nossa linha de ${linha?.nome || product.line}.`,
      image: linha?.image || product.image || "/static/images/next-hero.jpg",
    };

    const related = produtos
      .filter(
        (item) =>
          item.id !== product.id &&
          item.line === product.line &&
          item.ativo !== false &&
          item.name &&
          item.slug,
      )
      .sort((a, b) =>
        String(a.ordem ?? 0).localeCompare(String(b.ordem ?? 0), "pt-BR", {
          numeric: true,
        }),
      )
      .slice(0, 3);

    console.log("========== DIAGNÓSTICO PRODUTO ==========");
    console.log("Parâmetros da URL:", { line, slug });

    console.log(
      "Produtos:",
      produtos.map((item) => ({
        id: item.id,
        name: item.name,
        line: item.line,
        slug: item.slug,
        ativo: item.ativo,
      })),
    );

    console.log(
      "Linhas:",
      linhas.map((item) => ({
        id: item.id,
        nome: item.nome,
        slug: item.slug,
        ativo: item.ativo,
      })),
    );

    return {
      props: {
        product,
        related,
        info,
      },
    };
  } catch (error) {
    console.error("ERRO REAL AO CARREGAR O PRODUTO:", error);
    throw error;
  }
}
