import Head from "next/head";
import Link from "next/link";
import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";

const factoryImage = "/static/images/next-factory.jpg";
const engineeringImage = "/static/images/next-engineering.jpg";

const stages = [
  "Engenharia",
  "Montagem",
  "Soldagem",
  "Pintura",
  "Testes",
  "Expedição",
];

const values = [
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
];

export default function QuemSomos() {
  return (
    <>
      <Head>
        <title>Quem Somos | NEXT Implementos</title>
        <meta
          name="description"
          content="Conheça a NEXT Implementos, sua engenharia, fábrica e compromisso com operações profissionais."
        />
        <meta property="og:title" content="Somos a NEXT" />
        <meta
          property="og:description"
          content="Engenharia, pessoas e tecnologia transformando desafios em soluções."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="/quem-somos" />
      </Head>

      <Menu />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-[560px] items-center overflow-hidden bg-industrial lg:min-h-[680px]">
          <img
            src={factoryImage}
            alt="Estrutura industrial da NEXT Implementos"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />

          <div className="hero-shade absolute inset-0" />

          <div className="container relative z-10 py-24 text-white lg:py-32">
            <p className="eyebrow text-white/70">Quem somos</p>

            <h1 className="mt-6 max-w-4xl font-display text-5xl uppercase leading-tight sm:text-6xl lg:text-8xl">
              Somos a <span className="text-primary">NEXT.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Engenharia, pessoas e tecnologia transformando desafios em
              soluções.
            </p>

            <a
              href="#nossa-historia"
              className="mt-10 inline-flex items-center gap-3 border border-white/30 px-6 py-4 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-primary hover:bg-primary"
            >
              Conheça nossa história
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {/* NOSSA HISTÓRIA */}
        <section id="nossa-historia" className="px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1480px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow text-primary">Nossa história</p>

              <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Construída para transformar desafios em soluções.
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
                Fundada em 2012, a NEXT atua no desenvolvimento de equipamentos
                para trabalho em altura e implementos rodoviários. Sua estrutura
                reúne engenharia, fabricação e atendimento orientados às
                necessidades reais de cada operação.
              </p>
            </div>

            <div className="relative">
              <img
                src={engineeringImage}
                alt="Especialista trabalhando em equipamento da NEXT"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                width="1400"
                height="1050"
              />

              <div className="absolute -bottom-5 -left-5 hidden border-l-4 border-primary bg-background px-7 py-5 shadow-lg sm:block">
                <p className="font-display text-4xl text-foreground">2012</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Ano de fundação
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ESTRUTURA INTEGRADA */}
        <section className="bg-steel px-5 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1480px]">
            <p className="eyebrow text-primary">Estrutura integrada</p>

            <h2 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Da ideia à expedição, controle em cada etapa.
            </h2>

            <div className="mt-14 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage, index) => (
                <div
                  className="bg-steel p-8 transition-colors hover:bg-background sm:p-10"
                  key={stage}
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
          </div>
        </section>

        {/* VÍDEO INSTITUCIONAL */}
        <section className="bg-background px-5 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow text-primary">NEXT em movimento</p>

                <h2 className="mt-5 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Conheça nossa estrutura e nosso trabalho.
                </h2>
              </div>

              <p className="max-w-xl leading-relaxed text-muted-foreground lg:justify-self-end">
                Engenharia, tecnologia e pessoas trabalhando juntas para
                desenvolver soluções que atendam às necessidades de cada
                operação.
              </p>
            </div>

            <div className="mt-12 overflow-hidden bg-industrial">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/3TOzM23TuZ0"
                  title="Vídeo institucional da NEXT Implementos"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* MISSÃO, VISÃO E VALORES */}
        <section className="bg-industrial px-5 py-24 text-surface-contrast lg:px-10 lg:py-32">
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-3 lg:gap-16">
            {values.map((value) => (
              <article
                key={value.title}
                className="border-t-2 border-primary pt-7"
              >
                <h3 className="font-display text-3xl uppercase">
                  {value.title}
                </h3>

                <p className="mt-5 leading-relaxed text-surface-contrast/65">
                  {value.description}
                </p>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mx-auto mt-20 max-w-[1480px] border-t border-surface-contrast/15 pt-12">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="eyebrow text-primary">Vamos conversar?</p>

                <h2 className="mt-4 max-w-3xl font-display text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl">
                  Sua operação merece soluções à altura do seu desafio.
                </h2>
              </div>

              <Link
                href="/contato"
                className="inline-flex shrink-0 items-center gap-3 bg-primary px-7 py-4 text-sm font-semibold uppercase text-white transition-opacity hover:opacity-85"
              >
                Fale com a NEXT
                <span aria-hidden="true">↗</span>
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
