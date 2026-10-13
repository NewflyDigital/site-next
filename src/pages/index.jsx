import Head from "next/head";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Cog,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

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

  const featuredProducts = products.filter((product) => product.featured);

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
        <section
          id="banner"
          className="relative flex min-h-[94svh] items-end overflow-hidden bg-industrial px-5 pb-20 pt-32 text-surface-contrast lg:px-10 lg:pb-24"
        >
          <img
            src={heroImage}
            alt="Guindaste articulado em operação industrial"
            className="absolute inset-0 h-full w-full object-cover"
            width="1920"
            height="1080"
            fetchPriority="high"
          />

          <div className="hero-shade absolute inset-0" />

          <div className="relative mx-auto w-full max-w-[1480px] reveal">
            <p className="eyebrow mb-6 inline-flex bg-primary px-3 py-2 text-primary-foreground">
              Engenharia brasileira
            </p>

            <h1 className="max-w-5xl font-display text-5xl uppercase leading-[0.92] sm:text-7xl lg:text-[6.3rem]">
              Engenharia que movimenta{" "}
              <span className="text-primary">grandes operações.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base text-surface-contrast/70 lg:text-xl">
              Soluções em equipamentos e implementos desenvolvidas para entregar
              segurança, produtividade e desempenho em cada operação.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/produtos" className={buttonPrimary}>
                Conheça nossos produtos
                <ArrowRight size={18} />
              </Link>

              <Link href="/contato" className={buttonGlass}>
                Fale com a NEXT
              </Link>
            </div>
          </div>

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

            <div className="mt-14 grid gap-px bg-border md:grid-cols-2">
              {lines.map(([slug, line], index) => (
                <Link
                  key={slug}
                  href={`/produtos/${slug}`}
                  className="group relative min-h-[420px] overflow-hidden bg-industrial md:min-h-[520px]"
                >
                  <img
                    src={line.image}
                    alt={`${line.label} em operação`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                    width="1200"
                    height="1500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-industrial via-industrial/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7 text-surface-contrast lg:p-10">
                    <p className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-3 font-display text-3xl uppercase lg:text-4xl">
                      {line.label}
                    </h3>

                    <p className="mt-3 max-w-md text-surface-contrast/65">
                      {line.description}
                    </p>

                    <span className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase transition-all group-hover:gap-4">
                      Conheça o equipamento
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
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

            <div className="mt-12 flex snap-x gap-4 overflow-x-auto pb-6">
              {featuredProducts.map((product) => (
                <Link
                  key={`${product.line}-${product.slug}`}
                  href={`/produtos/${product.line}/${product.slug}`}
                  className="group min-w-[82vw] snap-start md:min-w-[380px]"
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
