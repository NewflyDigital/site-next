import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  HelpCircle,
  PackageSearch,
} from "lucide-react";

import Menu from "../components/menu";
import Rodape from "../components/rodape";

const atalhos = [
  {
    href: "/faq",
    icon: HelpCircle,
    titulo: "Perguntas frequentes",
    texto:
      "Consulte orientações sobre garantia, prazos, boletins técnicos e atendimento da rede autorizada.",
    acao: "Consultar dúvidas",
  },
  {
    href: "/reclamacoes",
    icon: ClipboardList,
    titulo: "Registrar reclamação",
    texto:
      "Registre uma ocorrência de cliente com os dados do veículo, a descrição do problema e a prioridade.",
    acao: "Abrir reclamação",
  },
  {
    href: "/pecas",
    icon: PackageSearch,
    titulo: "Solicitação de peças",
    texto:
      "Solicite peças para reparos e manutenções, informando código, quantidade e modelo do veículo.",
    acao: "Solicitar peças",
  },
];

const indicadores = [
  {
    valor: "2 dias úteis",
    rotulo: "Prazo de referência para retorno das reclamações",
  },
  {
    valor: "3 a 5 dias",
    rotulo: "Prazo de referência para peças de linha",
  },
  {
    valor: "VOR",
    rotulo: "Atendimento prioritário para casos de veículo parado",
  },
];

export default function PosVenda() {
  return (
    <>
      <Head>
        <title>Pós-Vendas Next | Portal de atendimento</title>
        <meta
          name="description"
          content="Acesse o Pós-Vendas Next para consultar perguntas frequentes, registrar reclamações de clientes e solicitar reposição de peças."
        />
        <meta
          property="og:title"
          content="Pós-Vendas Next | Portal de atendimento"
        />
        <meta
          property="og:description"
          content="Dúvidas, reclamações e solicitação de peças em um só lugar."
        />
        <meta property="og:type" content="website" />
      </Head>

      <Menu />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-foreground text-background">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-5 py-16 mt-20 sm:py-20 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary sm:text-sm">
              Rede autorizada Next
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              O canal direto com o{" "}
              <span className="text-secondary">Pós-Vendas</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">
              Tire dúvidas, registre reclamações de clientes e solicite peças em
              um só lugar. Encontre o canal adequado para sua necessidade e
              encaminhe sua solicitação à equipe de Pós-Vendas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/reclamacoes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Registrar reclamação
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/pecas"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                Solicitar peças
              </Link>
            </div>

            <div className="mt-14 grid gap-6 border-t border-background/15 pt-8 sm:grid-cols-3 sm:gap-8">
              {indicadores.map((item) => (
                <div key={item.valor}>
                  <p className="text-2xl font-bold text-secondary sm:text-3xl">
                    {item.valor}
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-background/70">
                    {item.rotulo}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-3xl text-xs leading-relaxed text-background/50">
              Os prazos apresentados são referências informadas para o portal e
              podem variar conforme a análise da solicitação, a disponibilidade
              da peça e a situação do atendimento.
            </p>
          </div>
        </section>

        {/* Atalhos */}
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Central de atendimento
              </p>

              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                Como podemos ajudar hoje?
              </h2>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Escolha uma das opções abaixo para acessar o serviço desejado.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {atalhos.map((item) => {
                const Icone = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                      <Icone className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-foreground">
                      {item.titulo}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.texto}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      {item.acao}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Orientação adicional */}
        <section className="border-t border-border bg-secondary/5">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Precisa de ajuda para iniciar uma solicitação?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Consulte as perguntas frequentes para encontrar orientações
                sobre os procedimentos de atendimento da rede Next.
              </p>
            </div>

            <Link
              href="/faq"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:bg-secondary/10 sm:self-auto"
            >
              Acessar perguntas frequentes
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
