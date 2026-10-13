import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import Menu from "../components/menu";
import Rodape from "../components/rodape";

export default function Contato() {
  const [nome, setNome] = React.useState("");
  const [empresa, setEmpresa] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [cidade, setCidade] = React.useState("");
  const [estado, setEstado] = React.useState("");
  const [interesse, setInteresse] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState("idle");

  const [produtoInicial, setProdutoInicial] = React.useState("");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const produto = params.get("produto") || "";
    const assunto = params.get("assunto") || "";

    if (produto) {
      setProdutoInicial(produto);
      setInteresse(produto);
    }

    if (assunto === "whatsapp") {
      setMensagem("Gostaria de falar com a NEXT pelo WhatsApp.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!consent) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          empresa,
          telefone,
          email,
          cidade,
          estado,
          objetivo: interesse,
          interesse,
          mensagem,
          lgpdConsent: consent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível enviar.");
      }

      setStatus("sent");
      setNome("");
      setEmpresa("");
      setTelefone("");
      setEmail("");
      setCidade("");
      setEstado("");
      setInteresse("");
      setMensagem("");
      setConsent(false);
      setProdutoInicial("");
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      setStatus("error");
    }
  }

  const inputClass =
    "mt-2 h-12 w-full rounded-none border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-foreground";

  return (
    <>
      <Head>
        <title>Contato | NEXT Implementos</title>
        <meta
          name="description"
          content="Fale com a NEXT sobre equipamentos, implementos, peças e pós-venda."
        />
        <meta
          property="og:title"
          content="Vamos falar sobre sua próxima operação"
        />
        <meta
          property="og:description"
          content="Nossa equipe ajuda sua empresa a encontrar a solução ideal."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Menu />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-industrial px-5 pb-20 pt-32 text-surface-contrast lg:px-10 lg:pb-28 lg:pt-44">
          <div className="absolute inset-0">
            <img
              src="/static/images/next-hero.jpg"
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="hero-shade absolute inset-0" />
          </div>

          <div className="relative mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="eyebrow text-primary">Contato</p>

              <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.98] sm:text-6xl lg:text-7xl">
                Vamos falar sobre sua próxima operação.
              </h1>

              <p className="mt-7 max-w-2xl text-lg text-surface-contrast/75">
                Conte o seu desafio. Nossa equipe ajuda a encontrar a solução
                adequada para sua operação.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#formulario"
                  className="inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 text-sm font-bold uppercase text-white transition-opacity hover:opacity-90"
                >
                  Solicitar orçamento
                </a>

                <Link
                  href="/quem-somos"
                  className="inline-flex min-h-12 items-center justify-center border border-surface-contrast/30 px-6 py-3 text-sm font-bold uppercase transition-colors hover:bg-surface-contrast hover:text-industrial"
                >
                  Conheça a NEXT
                </Link>
              </div>
            </div>

            <div className="grid gap-px bg-surface-contrast/15 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-industrial/90 p-6">
                <p className="eyebrow text-primary">Telefone</p>
                <h2 className="mt-3 font-display text-2xl">(19) 3307-2587</h2>
                <p className="mt-2 text-sm text-surface-contrast/65">
                  Atendimento comercial
                </p>
              </div>

              <div className="bg-industrial/90 p-6">
                <p className="eyebrow text-primary">E-mail</p>
                <h2 className="mt-3 break-words font-display text-xl">
                  contato@nextimplementos.com.br
                </h2>
                <p className="mt-2 text-sm text-surface-contrast/65">
                  Fale com nossa equipe
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO E CONTATOS */}
        <section
          id="formulario"
          className="scroll-mt-24 px-5 py-20 lg:px-10 lg:py-28"
        >
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <p className="eyebrow text-primary">Solicite atendimento</p>

              <h2 className="mt-4 font-display text-4xl uppercase sm:text-5xl">
                Fale com um especialista.
              </h2>

              <p className="mt-5 max-w-2xl text-muted-foreground">
                Preencha os dados abaixo. Nossa equipe comercial poderá entender
                sua necessidade e orientar você sobre o equipamento adequado.
              </p>

              {status === "sent" ? (
                <div className="mt-10 border border-border bg-steel p-8 sm:p-10">
                  <div className="flex size-12 items-center justify-center bg-primary/10 text-2xl text-primary">
                    ✓
                  </div>

                  <h3 className="mt-5 font-display text-3xl uppercase">
                    Solicitação enviada.
                  </h3>

                  <p className="mt-3 text-muted-foreground">
                    Recebemos seus dados. Nossa equipe entrará em contato.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-7 border border-border px-5 py-3 text-sm font-bold uppercase transition-colors hover:border-primary hover:text-primary"
                  >
                    Nova solicitação
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-9 grid gap-x-5 gap-y-6 sm:grid-cols-2"
                >
                  <label className={labelClass}>
                    Nome *
                    <input
                      name="nome"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      required
                      minLength={2}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Empresa *
                    <input
                      name="empresa"
                      value={empresa}
                      onChange={(event) => setEmpresa(event.target.value)}
                      required
                      minLength={2}
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Telefone *
                    <input
                      name="telefone"
                      type="tel"
                      value={telefone}
                      onChange={(event) => setTelefone(event.target.value)}
                      required
                      minLength={8}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    E-mail *
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Cidade *
                    <input
                      name="cidade"
                      value={cidade}
                      onChange={(event) => setCidade(event.target.value)}
                      required
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  </label>

                  <label className={labelClass}>
                    Estado *
                    <input
                      name="estado"
                      value={estado}
                      onChange={(event) => setEstado(event.target.value)}
                      required
                      maxLength={2}
                      placeholder="Ex.: SP"
                      autoComplete="address-level1"
                      className={inputClass}
                    />
                  </label>

                  <label className={`${labelClass} sm:col-span-2`}>
                    Qual produto você procura? *
                    <select
                      name="interesse"
                      value={interesse}
                      onChange={(event) => setInteresse(event.target.value)}
                      required
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Selecione uma opção
                      </option>

                      {produtoInicial &&
                        ![
                          "Guindastes",
                          "Cestas Aéreas",
                          "Cabines Suplementares",
                          "Linha Bebidas",
                          "Peças / Pós-venda",
                          "Outros",
                        ].includes(produtoInicial) && (
                          <option value={produtoInicial}>
                            {produtoInicial}
                          </option>
                        )}

                      <option value="Guindastes">Guindastes</option>
                      <option value="Cestas Aéreas">Cestas Aéreas</option>
                      <option value="Cabines Suplementares">
                        Cabines Suplementares
                      </option>
                      <option value="Linha Bebidas">Linha Bebidas</option>
                      <option value="Peças / Pós-venda">
                        Peças / Pós-venda
                      </option>
                      <option value="Outros">Outros</option>
                    </select>
                  </label>

                  <label className={`${labelClass} sm:col-span-2`}>
                    Mensagem *
                    <textarea
                      name="mensagem"
                      value={mensagem}
                      onChange={(event) => setMensagem(event.target.value)}
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={5}
                      placeholder="Conte um pouco sobre sua necessidade..."
                      className={`${inputClass} h-auto min-h-36 resize-y py-3`}
                    />
                  </label>

                  <label className="flex items-start gap-3 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      required
                      className="mt-1 size-4 shrink-0 accent-black"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      Concordo com o uso dos meus dados para atendimento da
                      solicitação, conforme a legislação de proteção de dados
                      pessoais (LGPD). *
                    </span>
                  </label>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="text-sm text-destructive sm:col-span-2"
                    >
                      Não foi possível enviar sua solicitação. Verifique os
                      dados e tente novamente.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!consent || status === "sending"}
                    className="inline-flex min-h-12 items-center justify-center bg-industrial px-6 py-4 text-sm font-bold uppercase text-surface-contrast transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                  >
                    {status === "sending"
                      ? "Enviando solicitação..."
                      : "Enviar solicitação"}
                  </button>

                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    * Campos obrigatórios.
                  </p>
                </form>
              )}
            </div>

            {/* CONTATOS DIRETOS */}
            <aside className="h-fit bg-industrial p-8 text-surface-contrast lg:p-10">
              <p className="eyebrow text-primary">Atendimento NEXT</p>

              <h2 className="mt-4 font-display text-3xl uppercase">
                Canais diretos.
              </h2>

              <div className="mt-10 space-y-8">
                <div className="flex gap-4">
                  <span className="text-xl text-primary" aria-hidden="true">
                    ☎
                  </span>
                  <div>
                    <p className="eyebrow text-surface-contrast/50">Telefone</p>
                    <a
                      href="tel:+551933072587"
                      className="mt-2 inline-block text-sm hover:text-primary"
                    >
                      (19) 3307-2587
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl text-primary" aria-hidden="true">
                    ↗
                  </span>
                  <div>
                    <p className="eyebrow text-surface-contrast/50">WhatsApp</p>
                    <a
                      href="https://wa.me/5519987230602"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm hover:text-primary"
                    >
                      (19) 98723-0602
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl text-primary" aria-hidden="true">
                    @
                  </span>
                  <div>
                    <p className="eyebrow text-surface-contrast/50">E-mail</p>
                    <a
                      href="mailto:contato@nextimplementos.com.br"
                      className="mt-2 inline-block break-all text-sm hover:text-primary"
                    >
                      contato@nextimplementos.com.br
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-xl text-primary" aria-hidden="true">
                    ⌖
                  </span>
                  <div>
                    <p className="eyebrow text-surface-contrast/50">Fábrica</p>
                    <p className="mt-2 text-sm leading-relaxed text-surface-contrast/75">
                      Rod. Jornalista Francisco Aguirre Proença, Km 26,5 — Monte
                      Mor/SP
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-5 pb-20 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-[1480px] bg-steel p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-primary">Atendimento comercial</p>

            <h2 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-tight sm:text-5xl">
              Vamos conversar sobre sua próxima operação.
            </h2>

            <p className="mt-5 max-w-2xl text-muted-foreground">
              Nossa equipe está pronta para entender sua necessidade e ajudar
              você a encontrar a solução adequada.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/5519987230602"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 text-sm font-bold uppercase text-white transition-opacity hover:opacity-90"
              >
                Falar pelo WhatsApp
              </a>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-bold uppercase transition-colors hover:border-primary hover:text-primary"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
