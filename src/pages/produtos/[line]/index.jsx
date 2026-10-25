import Head from "next/head";
import Link from "next/link";
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";
import Whats from "../../../components/whats";

import { db } from "../../../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LinhaProdutosPage({ line, info, items }) {
  if (!info) return null;

  return (
    <>
      <Head>
        <title>{info.label} | NEXT Implementos</title>
        <meta name="description" content={info.description} />
        <meta property="og:title" content={info.headline} />
        <meta property="og:description" content={info.description} />
        <meta property="og:type" content="website" />
      </Head>

      <Menu />

      <main>
        <section className="relative overflow-hidden bg-industrial px-5 pb-16 pt-32 text-surface-contrast lg:px-10 lg:pb-24 lg:pt-44">
          <div className="absolute inset-0">
            <img
              src={info.image}
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="hero-shade absolute inset-0" />
          </div>

          <div className="relative mx-auto max-w-[1480px]">
            <p className="eyebrow text-primary">{info.label}</p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl uppercase leading-[0.98] sm:text-6xl lg:text-8xl">
              {info.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-surface-contrast/75">
              {info.description}
            </p>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1480px]">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow text-primary">Catálogo</p>
                <h2 className="mt-4 font-display text-4xl uppercase">
                  Modelos disponíveis
                </h2>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {String(items.length).padStart(2, "0")} EQUIPAMENTOS
              </p>
            </div>

            {items.length > 0 ? (
              <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/produtos/${product.line}/${product.slug}`}
                    className="group bg-background p-5"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-steel">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="eyebrow mt-6 text-primary">
                      {product.family ?? info.label}
                    </p>
                    <h3 className="mt-2 font-display text-2xl uppercase">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <span className="mt-5 inline-block text-xs font-semibold uppercase">
                      Conheça o equipamento →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-muted-foreground">
                Não há modelos cadastrados nesta linha.
              </p>
            )}

            {line === "cestas-aereas" && (
              <div className="mt-20 border-l-4 border-primary bg-steel p-8">
                <p className="eyebrow text-primary">Normas e segurança</p>
                <h2 className="mt-4 font-display text-3xl uppercase">
                  Informação técnica com responsabilidade.
                </h2>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  Normas, capacidades e classificações de isolamento serão
                  apresentadas em cada equipamento somente após validação da
                  documentação técnica oficial.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Rodape />
      <Whats />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { line } = params;

  try {
    const [snapshotLinhas, snapshotProdutos] = await Promise.all([
      getDocs(query(collection(db, "linhas"), where("ativo", "==", true))),
      getDocs(query(collection(db, "produtos"), where("ativo", "==", true))),
    ]);

    const linhas = snapshotLinhas.docs.map((doc) => {
      const dados = doc.data();

      return {
        ...dados,
        id: doc.id,
        criadoEm: dados.criadoEm?.toDate?.().toISOString() ?? null,
        atualizadoEm: dados.atualizadoEm?.toDate?.().toISOString() ?? null,
      };
    });

    const produtos = snapshotProdutos.docs.map((doc) => {
      const dados = doc.data();

      return {
        ...dados,
        id: doc.id,
        criadoEm: dados.criadoEm?.toDate?.().toISOString() ?? null,
        atualizadoEm: dados.atualizadoEm?.toDate?.().toISOString() ?? null,
      };
    });

    console.log("========== DIAGNÓSTICO NEXT ==========");
    console.log("Slug da URL:", line);
    console.log("Linhas encontradas:", linhas.length);
    console.log(
      "Dados das linhas:",
      linhas.map((item) => ({
        id: item.id,
        nome: item.nome,
        slug: item.slug,
        ativo: item.ativo,
      })),
    );

    console.log("Produtos encontrados:", produtos.length);
    console.log(
      "Dados dos produtos:",
      produtos.map((item) => ({
        id: item.id,
        name: item.name,
        line: item.line,
        slug: item.slug,
        ativo: item.ativo,
      })),
    );

    const linha = linhas.find(
      (item) => String(item.slug || "").trim() === line,
    );

    if (!linha) {
      console.error("CAUSA: linha não encontrada:", line);
      return { notFound: true };
    }

    if (linha.ativo === false) {
      console.error("CAUSA: linha desativada:", linha);
      return { notFound: true };
    }

    const items = produtos
      .filter(
        (product) =>
          String(product.line || "").trim() === line &&
          product.ativo !== false &&
          product.name &&
          product.slug,
      )
      .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

    const info = {
      label: linha.nome || line,
      headline:
        linha.headline || `Conheça nossa linha de ${linha.nome || line}.`,
      description:
        linha.description ||
        "Soluções NEXT desenvolvidas para diferentes operações e segmentos.",
      image: linha.image || "/static/images/next-hero.jpg",
    };

    console.log("Linha selecionada:", linha);
    console.log("Total de produtos para esta linha:", items.length);
    console.log("======================================");

    return {
      props: {
        line,
        info,
        items,
      },
    };
  } catch (error) {
    console.error("ERRO REAL AO CONSULTAR O FIRESTORE:", error);

    throw error;
  }
}
