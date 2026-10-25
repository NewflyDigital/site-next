import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase-config";

import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";

const CONFIG_COLLECTION = "paginas";
const CONFIG_DOCUMENT = "quem-somos";

const conteudoInicial = {
  seoTitle: "Quem Somos | NEXT Implementos",
  seoDescription:
    "Conheça a NEXT Implementos, sua engenharia, fábrica e compromisso com operações profissionais.",
  ogTitle: "Somos a NEXT",
  ogDescription:
    "Engenharia, pessoas e tecnologia transformando desafios em soluções.",

  heroEyebrow: "Quem somos",
  heroTitle: "Somos a NEXT.",
  heroDescription:
    "Engenharia, pessoas e tecnologia transformando desafios em soluções.",
  heroButton: "Conheça nossa história",

  factoryImage: "/static/images/next-factory.jpg",
  factoryImageAlt: "Estrutura industrial da NEXT Implementos",

  historyEyebrow: "Nossa história",
  historyTitle: "Construída para transformar desafios em soluções.",
  historyDescription:
    "Fundada em 2012, a NEXT atua no desenvolvimento de equipamentos para trabalho em altura e implementos rodoviários. Sua estrutura reúne engenharia, fabricação e atendimento orientados às necessidades reais de cada operação.",
  foundingYear: "2012",

  engineeringImage: "/static/images/next-engineering.jpg",
  engineeringImageAlt: "Especialista trabalhando em equipamento da NEXT",

  stagesEyebrow: "Estrutura integrada",
  stagesTitle: "Da ideia à expedição, controle em cada etapa.",
  stages: [
    "Engenharia",
    "Montagem",
    "Soldagem",
    "Pintura",
    "Testes",
    "Expedição",
  ],

  videoEyebrow: "NEXT em movimento",
  videoTitle: "Conheça nossa estrutura e nosso trabalho.",
  videoDescription:
    "Engenharia, tecnologia e pessoas trabalhando juntas para desenvolver soluções que atendam às necessidades de cada operação.",
  videoUrl: "https://www.youtube.com/watch?v=3TOzM23TuZ0",

  values: [
    {
      title: "Missão",
      description:
        "Desenvolver soluções que contribuam para operações mais seguras, produtivas e confiáveis.",
    },
    {
      title: "Visão",
      description:
        "Evoluir continuamente como referência brasileira em equipamentos e implementos profissionais.",
    },
    {
      title: "Valores",
      description:
        "Engenharia, segurança, qualidade, confiança, melhoria contínua e respeito aos clientes.",
    },
  ],

  ctaEyebrow: "Vamos conversar?",
  ctaTitle: "Sua operação merece soluções à altura do seu desafio.",
  ctaButton: "Fale com a NEXT",
  ctaLink: "/contato",

  ativo: true,

  sectionsVisibility: {
    hero: true,
    historia: true,
    etapas: true,
    video: true,
    valores: true,
    cta: true,
  },

  sectionOrder: ["hero", "historia", "etapas", "video", "valores", "cta"],
};

const secoesValidas = ["hero", "historia", "etapas", "video", "valores", "cta"];

function normalizarConteudo(dados = {}) {
  const ordemSalva = Array.isArray(dados.sectionOrder)
    ? dados.sectionOrder.filter((id) => secoesValidas.includes(id))
    : [];

  const sectionOrder = [
    ...ordemSalva,
    ...secoesValidas.filter((id) => !ordemSalva.includes(id)),
  ];

  return {
    ...conteudoInicial,
    ...dados,

    stages: Array.isArray(dados.stages)
      ? dados.stages.filter(
          (etapa) => typeof etapa === "string" && etapa.trim(),
        )
      : [...conteudoInicial.stages],

    values: Array.isArray(dados.values)
      ? dados.values.filter(
          (item) =>
            item &&
            (String(item.title || "").trim() ||
              String(item.description || "").trim()),
        )
      : conteudoInicial.values,

    sectionsVisibility: {
      ...conteudoInicial.sectionsVisibility,
      ...(dados.sectionsVisibility || {}),
    },

    sectionOrder,
  };
}

function obterUrlVideo(url = "") {
  const valor = String(url).trim();

  if (!valor) return "";

  try {
    const urlObj = new URL(
      valor.startsWith("http://") || valor.startsWith("https://")
        ? valor
        : `https://${valor}`,
    );

    const host = urlObj.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = urlObj.pathname.split("/").filter(Boolean)[0] || "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (urlObj.pathname === "/watch") {
        videoId = urlObj.searchParams.get("v") || "";
      } else {
        const partes = urlObj.pathname.split("/").filter(Boolean);

        if (["embed", "shorts", "live"].includes(partes[0]) && partes[1]) {
          videoId = partes[1];
        }
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

function LinkBotao({ href, className, children }) {
  const destino = String(href || "/contato").trim() || "/contato";

  const externo = /^(https?:\/\/|mailto:|tel:)/i.test(destino);
  const abreNovaAba = /^https?:\/\//i.test(destino);

  if (externo) {
    return (
      <a
        href={destino}
        className={className}
        {...(abreNovaAba
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={destino} className={className}>
      {children}
    </Link>
  );
}

export default function QuemSomos() {
  const [conteudo, setConteudo] = useState(conteudoInicial);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useEffect(() => {
    let montado = true;

    async function carregarConteudo() {
      try {
        const snapshot = await getDoc(
          doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
        );

        if (!montado) return;

        if (snapshot.exists()) {
          setConteudo(normalizarConteudo(snapshot.data()));
        } else {
          setConteudo(conteudoInicial);
        }
      } catch (erro) {
        console.error("Erro ao carregar conteúdo da página Quem Somos:", erro);

        if (montado) {
          setErroCarregamento(true);
          setConteudo(conteudoInicial);
        }
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    carregarConteudo();

    return () => {
      montado = false;
    };
  }, []);

  const {
    seoTitle,
    seoDescription,
    ogTitle,
    ogDescription,

    heroEyebrow,
    heroTitle,
    heroDescription,
    heroButton,
    factoryImage,
    factoryImageAlt,

    historyEyebrow,
    historyTitle,
    historyDescription,
    foundingYear,
    engineeringImage,
    engineeringImageAlt,

    stagesEyebrow,
    stagesTitle,
    stages,

    videoEyebrow,
    videoTitle,
    videoDescription,
    videoUrl,

    values,

    ctaEyebrow,
    ctaTitle,
    ctaButton,
    ctaLink,

    ativo,
    sectionsVisibility,
    sectionOrder,
  } = conteudo;

  const visivel = (secao) => sectionsVisibility?.[secao] !== false;

  const urlVideo = obterUrlVideo(videoUrl);

  const classesBotaoHero =
    "mt-10 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-primary hover:bg-primary";

  const secoes = {
    hero: visivel("hero") ? (
      <section
        key="hero"
        className="relative flex min-h-[560px] items-center overflow-hidden bg-industrial lg:min-h-[680px]"
      >
        <img
          src={factoryImage || conteudoInicial.factoryImage}
          alt={factoryImageAlt || ""}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />

        <div className="hero-shade absolute inset-0" />

        <div className="container relative z-10 py-24 text-white lg:py-32">
          {heroEyebrow && (
            <p className="eyebrow text-white/70">{heroEyebrow}</p>
          )}

          <h1 className="mt-6 max-w-4xl font-display text-5xl uppercase leading-tight sm:text-6xl lg:text-8xl">
            {heroTitle}
          </h1>

          {heroDescription && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {heroDescription}
            </p>
          )}

          {heroButton && (
            <a href="#nossa-historia" className={classesBotaoHero}>
              {heroButton}
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </section>
    ) : null,

    historia: visivel("historia") ? (
      <section
        key="historia"
        id="nossa-historia"
        className="px-5 py-24 lg:px-10 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1480px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            {historyEyebrow && (
              <p className="eyebrow text-primary">{historyEyebrow}</p>
            )}

            <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {historyTitle}
            </h2>

            {historyDescription && (
              <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
                {historyDescription}
              </p>
            )}
          </div>

          <div className="relative">
            <img
              src={engineeringImage || conteudoInicial.engineeringImage}
              alt={engineeringImageAlt || ""}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              width="1400"
              height="1050"
            />

            {foundingYear && (
              <div className="absolute -bottom-5 -left-5 hidden border-l-4 border-primary bg-background px-7 py-5 shadow-lg sm:block">
                <p className="font-display text-4xl text-foreground">
                  {foundingYear}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Ano de fundação
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    ) : null,

    etapas: visivel("etapas") ? (
      <section key="etapas" className="bg-steel px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1480px]">
          {stagesEyebrow && (
            <p className="eyebrow text-primary">{stagesEyebrow}</p>
          )}

          <h2 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {stagesTitle}
          </h2>

          {stages.length > 0 && (
            <div className="mt-14 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage, index) => (
                <div
                  className="bg-steel p-8 transition-colors hover:bg-background sm:p-10"
                  key={`${stage}-${index}`}
                >
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-8 font-display text-2xl uppercase text-foreground sm:text-3xl">
                    {stage}
                  </h3>

                  <div className="mt-5 h-1 w-10 bg-primary" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    ) : null,

    video: visivel("video") ? (
      <section
        key="video"
        className="bg-background px-5 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-[1480px]">
          <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              {videoEyebrow && (
                <p className="eyebrow text-primary">{videoEyebrow}</p>
              )}

              <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {videoTitle}
              </h2>
            </div>

            {videoDescription && (
              <p className="max-w-xl leading-relaxed text-muted-foreground lg:justify-self-end">
                {videoDescription}
              </p>
            )}
          </div>

          {urlVideo ? (
            <div className="mt-12 overflow-hidden bg-industrial">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={urlVideo}
                  title={
                    videoTitle || "Vídeo institucional da NEXT Implementos"
                  }
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">
              O vídeo institucional ainda não foi configurado.
            </p>
          )}
        </div>
      </section>
    ) : null,

    valores: visivel("valores") ? (
      <section
        key="valores"
        className="bg-industrial px-5 py-24 text-surface-contrast lg:px-10 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-3 lg:gap-16">
          {values.map((value, index) => (
            <article
              key={`${value.title}-${index}`}
              className="border-t-2 border-primary pt-7"
            >
              <h3 className="font-display text-3xl uppercase">{value.title}</h3>

              {value.description && (
                <p className="mt-5 leading-relaxed text-surface-contrast/65">
                  {value.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null,

    cta: visivel("cta") ? (
      <section
        key="cta"
        className="bg-industrial px-5 pb-24 text-surface-contrast lg:px-10 lg:pb-32"
      >
        <div className="mx-auto max-w-[1480px] border-t border-surface-contrast/15 pt-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              {ctaEyebrow && (
                <p className="eyebrow text-primary">{ctaEyebrow}</p>
              )}

              <h2 className="mt-4 max-w-3xl font-display text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl">
                {ctaTitle}
              </h2>
            </div>

            {ctaButton && (
              <LinkBotao
                href={ctaLink}
                className="inline-flex shrink-0 items-center gap-3 bg-primary px-7 py-4 text-sm font-semibold uppercase text-white transition-opacity hover:opacity-85"
              >
                {ctaButton}
                <span aria-hidden="true">↗</span>
              </LinkBotao>
            )}
          </div>
        </div>
      </section>
    ) : null,
  };

  const paginaPublicada = ativo !== false;

  return (
    <>
      <Head>
        <title>{seoTitle || conteudoInicial.seoTitle}</title>

        <meta
          name="description"
          content={seoDescription || conteudoInicial.seoDescription}
        />

        <meta
          property="og:title"
          content={ogTitle || conteudoInicial.ogTitle}
        />

        <meta
          property="og:description"
          content={ogDescription || conteudoInicial.ogDescription}
        />

        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="/quem-somos" />
      </Head>

      <Menu />

      <main>
        {!paginaPublicada ? (
          <section className="flex min-h-[50vh] items-center justify-center bg-background px-5 py-24 text-center">
            <div>
              <h1 className="font-display text-3xl uppercase text-foreground sm:text-5xl">
                Página temporariamente indisponível
              </h1>
              <p className="mt-4 text-muted-foreground">
                Estamos atualizando nosso conteúdo institucional.
              </p>
            </div>
          </section>
        ) : (
          <>{sectionOrder.map((id) => secoes[id])}</>
        )}

        {erroCarregamento && (
          <div className="sr-only" role="status">
            Não foi possível carregar as alterações mais recentes da página.
          </div>
        )}

        {carregando && (
          <div className="sr-only" role="status">
            Carregando conteúdo institucional.
          </div>
        )}
      </main>

      <Rodape />
      <Whats />
    </>
  );
}
