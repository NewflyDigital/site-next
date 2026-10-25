import Head from "next/head";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Cog,
  ShieldCheck,
  Sparkles,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { db } from "../../firebase-config";

import { collection, getDocs, getDoc, doc } from "firebase/firestore";

import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";

import { lineInfo, products } from "../../lib/catalog";

const heroImage = "/static/images/next-hero.jpg";
const factoryImage = "/static/images/next-factory.jpg";
const engineeringImage = "/static/images/next-engineering.jpg";

const stats = [
  {
    value: "Desde 2012",
    label: "Desenvolvendo soluções",
  },
  {
    value: "Brasil + América Latina",
    label: "Presença de mercado",
  },
  {
    value: "Engenharia própria",
    label: "Conhecimento aplicado",
  },
  {
    value: "Soluções sob medida",
    label: "Para diferentes operações",
  },
];

const engineeringFeatures = [
  { icon: Cog, label: "Engenharia" },
  { icon: ShieldCheck, label: "Segurança" },
  { icon: Sparkles, label: "Qualidade" },
  { icon: Wrench, label: "Soluções personalizadas" },
];

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:opacity-90";

const buttonOutline =
  "inline-flex items-center justify-center gap-2 border border-border px-6 py-4 text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary";

const buttonGlass =
  "inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20";

export default function Home() {
  const lines = Object.entries(lineInfo);
  const [homeLines, setHomeLines] = useState([]);
  const [homeLinesLoading, setHomeLinesLoading] = useState(true);

  useEffect(() => {
    async function carregarLinhasHome() {
      try {
        const snapshot = await getDocs(collection(db, "homeLinhas"));

        const lista = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (linha) =>
              linha.ativo === true &&
              linha.titulo &&
              linha.imagem &&
              linha.linhaSlug,
          )
          .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

        setHomeLines(lista);
      } catch (error) {
        console.error("Erro ao carregar linhas da página inicial:", error);
        setHomeLines([]);
      } finally {
        setHomeLinesLoading(false);
      }
    }

    carregarLinhasHome();
  }, []);

  const [banners, setBanners] = useState([]);
  const [bannerAtual, setBannerAtual] = useState(0);
  const [bannersCarregados, setBannersCarregados] = useState(false);

  useEffect(() => {
    async function carregarBanners() {
      try {
        const snapshot = await getDocs(collection(db, "banners"));

        const lista = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((banner) => banner.ativo === true)
          .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0))
          .filter((banner) => banner.imagemUrl)
          .slice(0, 4);

        setBanners(lista);
        setBannerAtual(0);
      } catch (error) {
        console.error("Erro ao carregar banners do Firebase:", error);
      } finally {
        setBannersCarregados(true);
      }
    }

    carregarBanners();
  }, []);

  const slidesBanner =
    banners.length > 0
      ? banners
      : [
          {
            id: "banner-padrao",
            titulo: "Engenharia que movimenta grandes operações.",
            subtitulo:
              "Soluções em equipamentos e implementos desenvolvidas para entregar segurança, produtividade e desempenho em cada operação.",
            link: "/produtos",
            imagemUrl: heroImage,
          },
        ];

  useEffect(() => {
    if (slidesBanner.length <= 1) return;

    const intervalo = setInterval(() => {
      setBannerAtual((atual) => (atual + 1) % slidesBanner.length);
    }, 6000);

    return () => clearInterval(intervalo);
  }, [slidesBanner.length]);

  const bannerSelecionado = slidesBanner[bannerAtual] || slidesBanner[0];

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      try {
        const [configSnapshot, produtosSnapshot] = await Promise.all([
          getDoc(doc(db, "siteConfig", "home")),
          getDocs(collection(db, "produtos")),
        ]);

        if (!configSnapshot.exists()) {
          setFeaturedProducts([]);
          return;
        }

        const config = configSnapshot.data();
        const idsDestaque = Array.isArray(config.produtosDestaque)
          ? config.produtosDestaque
          : [];

        const produtos = produtosSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        // Mantém a ordem definida no painel de destaques.
        const produtosSelecionados = idsDestaque
          .map((id) => produtos.find((produto) => produto.id === id))
          .filter(
            (produto) =>
              produto &&
              produto.ativo === true &&
              produto.slug &&
              produto.line &&
              produto.image,
          );

        setFeaturedProducts(produtosSelecionados);
      } catch (error) {
        console.error("Erro ao carregar produtos em destaque:", error);
        setFeaturedProducts([]);
      } finally {
        setFeaturedLoading(false);
      }
    }

    carregarDestaques();
  }, []);

  return (
    <>
      <Head>
        <title>NEXT Implementos | Engenharia para grandes operações</title>

        <meta
          name="description"
          content="Equipamentos para trabalho em altura e implementos rodoviários desenvolvidos para segurança, produtividade e desempenho."
        />

        <meta
          property="og:title"
          content="NEXT Implementos | Engenharia para grandes operações"
        />

        <meta
          property="og:description"
          content="Soluções robustas e tecnológicas para operações profissionais."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content={heroImage} />

        <meta name="twitter:card" content="summary_large_image" />

        <link rel="canonical" href="/" />
      </Head>

      <Menu />

      <main>
        {/* HERO */}

        {/* HERO / CARROSSEL DE BANNERS */}
        <section
          id="banner"
          className="relative flex min-h-[94svh] items-end overflow-hidden bg-industrial px-5 pb-20 pt-40 text-surface-contrast lg:px-10 lg:pb-24"
        >
          {/* Imagem do banner */}
          <div className="absolute inset-0">
            {slidesBanner.map((banner, index) => (
              <img
                key={banner.id}
                src={banner.imagemUrl || heroImage}
                alt={
                  banner.titulo || "Banner institucional da NEXT Implementos"
                }
                width="1920"
                height="1080"
                fetchPriority={index === 0 ? "high" : "auto"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  index === bannerAtual
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                aria-hidden={index !== bannerAtual}
              />
            ))}
          </div>

          {/* Camada de contraste */}
          <div className="hero-shade absolute inset-0" />

          {/* Conteúdo */}
          <div
            key={bannerSelecionado.id}
            className="relative mx-auto w-full max-w-[1480px] reveal"
          >
            <p className="eyebrow mb-6 inline-flex bg-primary px-3 py-2 text-primary-foreground">
              Engenharia brasileira
            </p>

            <h1 className="max-w-5xl font-display text-5xl uppercase leading-[0.92] sm:text-4xl lg:text-[3.5rem]">
              {bannerSelecionado.titulo ||
                "Engenharia que movimenta grandes operações."}
            </h1>

            {bannerSelecionado.subtitulo && (
              <p className="mt-7 max-w-2xl text-base text-surface-contrast/70 lg:text-xl">
                {bannerSelecionado.subtitulo}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={bannerSelecionado.link || "/produtos"}
                className={buttonPrimary}
              >
                Saiba mais
                <ArrowRight size={18} />
              </Link>

              <Link href="/contato" className={buttonGlass}>
                Fale com a NEXT
              </Link>
            </div>
          </div>

          {/* Navegação lateral */}
          {slidesBanner.length > 1 && (
            <div className="absolute bottom-24 right-5 z-10 flex items-center gap-2 lg:bottom-28 lg:right-10">
              <button
                type="button"
                onClick={() =>
                  setBannerAtual(
                    (atual) =>
                      (atual - 1 + slidesBanner.length) % slidesBanner.length,
                  )
                }
                aria-label="Banner anterior"
                className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setBannerAtual((atual) => (atual + 1) % slidesBanner.length)
                }
                aria-label="Próximo banner"
                className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Indicadores */}
          {slidesBanner.length > 1 && (
            <div
              className="absolute bottom-10 left-5 z-10 flex items-center gap-3 lg:left-10"
              aria-label="Selecionar banner"
            >
              {slidesBanner.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setBannerAtual(index)}
                  aria-label={`Ir para o banner ${index + 1}`}
                  aria-current={index === bannerAtual ? "true" : undefined}
                  className={`h-1.5 transition-all duration-300 ${
                    index === bannerAtual
                      ? "w-12 bg-primary"
                      : "w-6 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}

              <span className="ml-1 text-xs text-white/70">
                {String(bannerAtual + 1).padStart(2, "0")} /{" "}
                {String(slidesBanner.length).padStart(2, "0")}
              </span>
            </div>
          )}

          <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs uppercase text-white/60 lg:flex">
            Role para explorar
            <ArrowDown size={16} className="animate-bounce" />
          </div>
        </section>

        {/* SOBRE A NEXT */}
        <section className="bg-background px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="eyebrow text-primary">NEXT Implementos</p>

              <h2 className="mt-5 font-display text-4xl uppercase leading-tight lg:text-6xl">
                Soluções inteligentes para operações que não podem parar.
              </h2>

              <p className="mt-7 max-w-xl text-lg text-muted-foreground">
                Fabricante brasileira especializada em equipamentos para
                trabalho em altura e implementos rodoviários, unindo engenharia,
                segurança e confiabilidade para diferentes desafios.
              </p>

              <Link href="/quem-somos" className={`${buttonOutline} mt-9`}>
                Conheça a NEXT
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative">
              <img
                src={factoryImage}
                alt="Montagem de equipamento na fábrica"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                width="1400"
                height="1050"
              />

              <div className="absolute -bottom-6 left-0 bg-primary px-7 py-5 text-primary-foreground lg:-left-8">
                <p className="mb-1 font-display text-2xl uppercase">
                  Desde 2012
                </p>

                <p className="mb-0 text-xs uppercase">Desenvolvendo soluções</p>
              </div>
            </div>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="bg-steel px-5 py-14 lg:px-10">
          <div className="mx-auto grid max-w-[1480px] gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.value} className="bg-steel px-6 py-8">
                <p className="mb-0 font-display text-2xl uppercase lg:text-3xl">
                  {stat.value}
                </p>

                <p className="mb-0 mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* LINHAS DE PRODUTOS */}
        <section className="bg-background px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1480px]">
            <p className="eyebrow text-primary">Linhas de produto</p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-3xl font-display text-4xl uppercase lg:text-6xl">
                Uma solução para cada operação.
              </h2>

              <p className="max-w-md text-muted-foreground">
                Conheça as principais linhas de equipamentos e implementos NEXT.
              </p>
            </div>

            <div className="mt-14 grid w-full grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
              {homeLinesLoading ? (
                <div className="col-span-full bg-background py-12 text-center text-sm text-muted-foreground">
                  Carregando linhas de produtos...
                </div>
              ) : homeLines.length > 0 ? (
                homeLines.map((line, index) => (
                  <Link
                    key={line.id}
                    href={`/produtos/${line.linhaSlug}`}
                    className="group relative block h-[480px] min-w-0 overflow-hidden bg-industrial sm:h-[520px] lg:h-[560px] xl:h-[600px]"
                  >
                    {/* Imagem do card */}
                    <img
                      src={line.imagem}
                      alt={`${line.titulo} em operação`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width="1200"
                      height="1500"
                    />

                    {/* Contraste sobre a imagem */}
                    <div className="absolute inset-0 bg-gradient-to-t from-industrial/80 via-industrial/10 to-transparent" />

                    {/* Faixa vermelha */}
                    <div className="absolute inset-x-0 bottom-0 flex h-[42%] flex-col bg-primary p-5 text-primary-foreground transition-[height] duration-500 ease-out group-hover:h-[90%] sm:p-6 lg:p-5 xl:p-6">
                      <p className="shrink-0 font-mono text-xs opacity-80">
                        {String(Number(line.ordem) || index + 1).padStart(
                          2,
                          "0",
                        )}
                      </p>

                      <h3 className="mt-3 shrink-0 font-display text-xl uppercase leading-tight sm:text-2xl lg:text-xl xl:text-2xl">
                        {line.titulo}
                      </h3>

                      {line.descricao && (
                        <p className="mt-3 line-clamp-4 overflow-hidden text-sm leading-relaxed text-primary-foreground/85">
                          {line.descricao}
                        </p>
                      )}

                      <span className="mt-auto flex shrink-0 items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-wide">
                        Conheça o equipamento
                        <ArrowRight
                          size={16}
                          className="shrink-0 transition-transform duration-300 group-hover:translate-x-2"
                        />
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full bg-background py-12 text-center text-sm text-muted-foreground">
                  Nenhuma linha de produto disponível no momento.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ENGENHARIA */}
        <section className="grid bg-industrial text-surface-contrast lg:grid-cols-2">
          <div className="min-h-[360px] overflow-hidden lg:min-h-[560px]">
            <img
              src={engineeringImage}
              alt="Processo de engenharia e fabricação de equipamentos"
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"
              loading="lazy"
              width="1400"
              height="1050"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-20 lg:px-20">
            <p className="eyebrow text-primary">Engenharia NEXT</p>

            <h2 className="mt-5 font-display text-4xl uppercase leading-tight lg:text-6xl">
              Engenharia presente em cada detalhe.
            </h2>

            <p className="mt-7 text-surface-contrast/60">
              Do desenvolvimento à fabricação, cada etapa é orientada por
              qualidade, segurança e necessidades reais de operação.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-px bg-white/10">
              {engineeringFeatures.map(({ icon: Icon, label }) => (
                <div key={label} className="bg-industrial p-6">
                  <Icon size={24} strokeWidth={1.5} className="text-primary" />

                  <p className="mb-0 mt-4 text-sm font-semibold uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUTOS EM DESTAQUE */}
        <section className="bg-background px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1480px]">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="eyebrow text-primary">Vitrine industrial</p>

                <h2 className="mt-4 font-display text-4xl uppercase lg:text-6xl">
                  Produtos em destaque.
                </h2>
              </div>

              <Link
                href="/produtos"
                className={`${buttonOutline} hidden md:inline-flex`}
              >
                Ver todos
                <ArrowRight size={16} />
              </Link>
            </div>

            {featuredLoading ? (
              <div className="mt-12 py-12 text-sm text-muted-foreground">
                Carregando produtos...
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="mt-12 flex snap-x gap-4 overflow-x-auto pb-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.line}/${product.slug}`}
                    className="group min-w-[82vw] snap-start md:min-w-[380px]"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-steel">
                      <img
                        src={product.image}
                        alt={product.name || "Produto NEXT Implementos"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        width="1200"
                        height="1500"
                      />
                    </div>

                    <p className="eyebrow mt-5 text-primary">
                      {lineInfo[product.line]?.label || product.line}
                    </p>

                    <h3 className="mt-2 font-display text-2xl uppercase">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    )}

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
            ) : (
              <div className="mt-12 border border-border p-8">
                <p className="text-muted-foreground">
                  Nenhum produto em destaque disponível no momento.
                </p>
              </div>
            )}

            <Link
              href="/produtos"
              className={`${buttonOutline} mt-5 md:hidden`}
            >
              Ver todos os produtos
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* CHAMADA PARA ORÇAMENTO */}
        <section className="relative min-h-[600px] overflow-hidden bg-industrial px-5 py-24 text-surface-contrast lg:px-10">
          <img
            src={heroImage}
            alt="Equipamento NEXT em operação"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            loading="lazy"
            width="1920"
            height="1080"
          />

          <div className="hero-shade absolute inset-0" />

          <div className="relative mx-auto flex min-h-[420px] max-w-[1480px] flex-col justify-end">
            <p className="eyebrow text-primary">Vamos avançar</p>

            <h2 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-tight lg:text-7xl">
              Qual é o próximo desafio da sua operação?
            </h2>

            <p className="mt-6 max-w-xl text-surface-contrast/65">
              Nossa equipe está pronta para ajudar você a encontrar a solução
              ideal.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contato" className={buttonPrimary}>
                Solicitar orçamento
                <ArrowRight size={18} />
              </Link>

              <Link href="/contato?assunto=whatsapp" className={buttonGlass}>
                Falar pelo WhatsApp
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
      <Whats />
    </>
  );
}
