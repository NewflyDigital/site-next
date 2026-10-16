import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { ChevronDown, Search, ArrowRight } from "lucide-react";

import Menu from "../components/menu";
import Rodape from "../components/rodape";

const perguntasIniciais = [
  {
    id: "garantia-1",
    categoria: "Garantia",
    pergunta: "Como solicito atendimento em garantia?",
    resposta:
      "Entre em contato com a oficina autorizada responsável pelo atendimento e informe os dados do veículo, o chassi, a descrição do problema e, se possível, fotos ou vídeos. A equipe avaliará as informações e orientará sobre os próximos passos.",
  },
  {
    id: "garantia-2",
    categoria: "Garantia",
    pergunta: "Quais informações devo apresentar para uma análise de garantia?",
    resposta:
      "Tenha em mãos o número do chassi, o modelo do equipamento, a identificação da peça ou do componente envolvido e uma descrição detalhada do problema. Registros fotográficos e informações sobre as condições de uso também podem ajudar na análise.",
  },
  {
    id: "atendimento-1",
    categoria: "Atendimento",
    pergunta: "Como registro uma reclamação?",
    resposta:
      "Acesse a página Registrar reclamação, preencha os dados do responsável e do cliente, informe os dados disponíveis do veículo e descreva o ocorrido com o máximo de detalhes. Após o envio, a página apresentará o protocolo quando a integração de registro estiver habilitada.",
  },
  {
    id: "atendimento-2",
    categoria: "Atendimento",
    pergunta: "Qual é o prazo para retorno de uma reclamação?",
    resposta:
      "O portal apresenta dois dias úteis como prazo de referência para retorno. O prazo efetivo pode variar conforme a complexidade do caso e as informações necessárias para a análise. Casos de veículo parado devem ser identificados como prioritários.",
  },
  {
    id: "pecas-1",
    categoria: "Peças",
    pergunta: "Como solicito uma peça de reposição?",
    resposta:
      "Acesse Solicitação de peças e informe a descrição, a quantidade e, sempre que possível, o código da peça, o modelo do veículo e o chassi. Esses dados ajudam a equipe a identificar o item correto.",
  },
  {
    id: "pecas-2",
    categoria: "Peças",
    pergunta: "Qual é o prazo para entrega de peças?",
    resposta:
      "Como referência inicial do portal, peças de linha podem ter prazo estimado de três a cinco dias úteis. Peças sob encomenda podem exigir prazos maiores. A disponibilidade e o prazo definitivo precisam ser confirmados pela equipe responsável.",
  },
  {
    id: "pecas-3",
    categoria: "Peças",
    pergunta: "O que devo informar se não souber o código da peça?",
    resposta:
      "Informe a descrição da peça, o modelo do equipamento, o chassi e quaisquer detalhes que ajudem na identificação. Se tiver fotos da peça ou do local de aplicação, elas também podem facilitar a consulta.",
  },
  {
    id: "urgencia-1",
    categoria: "Urgências",
    pergunta: "O que significa VOR?",
    resposta:
      "VOR é a sigla utilizada para indicar uma situação de veículo parado. Ao registrar uma solicitação com essa condição, descreva o impacto operacional e informe os dados do veículo para facilitar a avaliação da prioridade.",
  },
];

export default function FaqPage() {
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState(null);

  const categorias = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    const filtradas = perguntasIniciais.filter((item) => {
      const conteudo =
        `${item.categoria} ${item.pergunta} ${item.resposta}`.toLocaleLowerCase(
          "pt-BR",
        );

      return !termo || conteudo.includes(termo);
    });

    return filtradas.reduce((grupos, item) => {
      if (!grupos[item.categoria]) {
        grupos[item.categoria] = [];
      }

      grupos[item.categoria].push(item);
      return grupos;
    }, {});
  }, [busca]);

  return (
    <>
      <Head>
        <title>Perguntas frequentes | Pós-Vendas Next</title>
        <meta
          name="description"
          content="Consulte orientações sobre garantia, atendimento, prazos de peças e suporte à rede autorizada Next."
        />
        <meta
          property="og:title"
          content="Perguntas frequentes | Pós-Vendas Next"
        />
        <meta
          property="og:description"
          content="Encontre respostas para dúvidas comuns sobre garantia, peças e atendimento."
        />
      </Head>

      <Menu />

      <main>
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-6xl px-5 pb-14 sm:py-18 lg:py-20 lg:pt-40">
            <Link
              href="/pos-venda"
              className="inline-flex items-center gap-2 mb-6 text-sm text-background/70 transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao Pós-Vendas
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              Suporte à rede
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Perguntas frequentes
            </h1>

            <p className="mt-5 max-w-2xl leading-relaxed text-background/75 sm:text-lg">
              Consulte orientações sobre garantia, peças, prazos e atendimento.
              Reunimos aqui respostas para as dúvidas mais comuns da rede Next.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
            <label
              htmlFor="busca-faq"
              className="mb-3 block text-sm font-semibold text-foreground"
            >
              O que você gostaria de saber?
            </label>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                id="busca-faq"
                type="search"
                value={busca}
                onChange={(event) => {
                  setBusca(event.target.value);
                  setAberta(null);
                }}
                placeholder="Buscar por garantia, prazo, peça..."
                className="min-h-12 w-full rounded-sm border border-border bg-card py-3 pl-12 pr-4 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {Object.values(categorias).reduce(
                (total, itens) => total + itens.length,
                0,
              )}{" "}
              perguntas encontradas
            </p>

            <div className="mt-10 space-y-10">
              {Object.entries(categorias).map(([categoria, itens]) => (
                <section key={categoria}>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                    {categoria}
                  </h2>

                  <div className="space-y-3">
                    {itens.map((item) => {
                      const isOpen = aberta === item.id;

                      return (
                        <article
                          key={item.id}
                          className={`overflow-hidden rounded-sm border bg-card transition-colors ${
                            isOpen
                              ? "border-secondary"
                              : "border-border hover:border-secondary/60"
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`resposta-${item.id}`}
                            onClick={() => setAberta(isOpen ? null : item.id)}
                            className="flex w-full items-center justify-between gap-4 p-5 text-left"
                          >
                            <span className="font-semibold leading-relaxed text-foreground">
                              {item.pergunta}
                            </span>

                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-secondary transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>

                          {isOpen && (
                            <div
                              id={`resposta-${item.id}`}
                              className="border-t border-border px-5 pb-5 pt-4"
                            >
                              <p className="text-sm leading-7 text-muted-foreground">
                                {item.resposta}
                              </p>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}

              {Object.keys(categorias).length === 0 && (
                <div className="rounded-xl border border-border bg-card px-6 py-10 text-center">
                  <h2 className="text-lg font-semibold text-foreground">
                    Nenhuma pergunta encontrada
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Tente outra palavra-chave ou registre uma reclamação para
                    encaminhar sua dúvida à equipe de Pós-Vendas.
                  </p>

                  <Link
                    href="/reclamacoes"
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Registrar reclamação
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-12 rounded-xl border border-border bg-secondary/5 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground">
                Não encontrou sua resposta?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Envie os detalhes do caso para que a equipe possa avaliar sua
                solicitação.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/reclamacoes"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Registrar reclamação
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/pos-venda"
                  className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/10"
                >
                  Voltar ao Pós-Vendas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
