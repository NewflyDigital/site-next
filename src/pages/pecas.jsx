import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PackageSearch,
  AlertTriangle,
} from "lucide-react";

import Menu from "../components/menu";
import Rodape from "../components/rodape";

const initialForm = {
  oficina: "Oficina parceira",
  contato_nome: "",
  contato_email: "",
  contato_telefone: "",
  codigo_peca: "",
  nome_peca: "",
  quantidade: "1",
  modelo_veiculo: "",
  chassi: "",
  urgencia: "Normal",
  observacoes: "",
};

const origens = ["Cliente", "Oficina parceira"];
const urgencias = ["Normal", "Alta", "Veículo parado (VOR)"];

const prazos = [
  {
    titulo: "Peças de linha",
    prazo: "3 a 5 dias úteis",
  },
  {
    titulo: "Peças sob encomenda",
    prazo: "15 a 30 dias úteis",
  },
  {
    titulo: "Veículo parado (VOR)",
    prazo: "Tratativa prioritária",
  },
];

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  maxLength,
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-secondary"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        min={type === "number" ? "1" : undefined}
        max={type === "number" ? "999" : undefined}
        step={type === "number" ? "1" : undefined}
        className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      />
    </div>
  );
}

export default function PecasPage() {
  const [form, setForm] = useState(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [protocolo, setProtocolo] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));

    setErro("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    const dados = {
      ...form,
      contato_nome: form.contato_nome.trim(),
      contato_email: form.contato_email.trim(),
      contato_telefone: form.contato_telefone.trim(),
      codigo_peca: form.codigo_peca.trim(),
      nome_peca: form.nome_peca.trim(),
      modelo_veiculo: form.modelo_veiculo.trim(),
      chassi: form.chassi.trim(),
      observacoes: form.observacoes.trim(),
    };

    if (dados.contato_nome.length < 2) {
      setErro("Informe o nome do responsável.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.contato_email)) {
      setErro("Informe um endereço de e-mail válido.");
      return;
    }

    if (dados.nome_peca.length < 2) {
      setErro("Informe a descrição da peça.");
      return;
    }

    const quantidade = Number(dados.quantidade);

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 999) {
      setErro("A quantidade deve ser um número inteiro entre 1 e 999.");
      return;
    }

    /*
      Integração pendente:
      conectar ao Supabase e chamar a função RPC
      criar_pedido_peca antes de confirmar o registro.
    */

    setEnviando(true);

    try {
      // Não simular um protocolo nem afirmar que o pedido foi registrado.
      setErro(
        "O formulário ainda precisa ser conectado ao sistema de Pós-Vendas. Seus dados não foram enviados nem registrados.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Head>
        <title>Solicitação de peças | Pós-Vendas Next</title>
        <meta
          name="description"
          content="Solicite peças de reposição Next para manutenção e reparos. Informe código, quantidade, modelo do veículo e urgência."
        />
        <meta
          property="og:title"
          content="Solicitação de peças | Pós-Vendas Next"
        />
        <meta
          property="og:description"
          content="Formulário de solicitação de peças para clientes e oficinas parceiras Next."
        />
      </Head>

      <Menu />

      <main>
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-6xl px-5 pb-14 sm:py-18 lg:py-20 lg:pt-40">
            <Link
              href="/pos-venda"
              className="inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao Pós-Vendas
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              Suprimentos
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Solicitação de peças
            </h1>

            <p className="mt-5 max-w-2xl leading-relaxed text-background/75 sm:text-lg">
              Informe os dados da peça e do veículo para ajudar nossa equipe a
              identificar o item solicitado. Sempre que possível, inclua o
              código da peça e o número do chassi.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:py-16">
            <div>
              {protocolo && (
                <div className="mb-6 rounded-sm border border-green-600/30 bg-green-600/5 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-green-700"
                      aria-hidden="true"
                    />

                    <div>
                      <h2 className="font-semibold text-foreground">
                        Solicitação registrada
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Protocolo:{" "}
                        <strong className="text-foreground">{protocolo}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {erro && (
                <div
                  role="alert"
                  className="mb-6 rounded-sm border border-red-500/30 bg-red-500/5 p-4 text-sm leading-relaxed text-foreground"
                >
                  {erro}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 sm:p-7"
              >
                <div className="grid gap-2">
                  <label
                    htmlFor="oficina"
                    className="text-sm font-medium text-foreground"
                  >
                    Origem do atendimento
                    <span className="text-secondary"> *</span>
                  </label>

                  <select
                    id="oficina"
                    name="oficina"
                    value={form.oficina}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  >
                    {origens.map((origem) => (
                      <option key={origem} value={origem}>
                        {origem}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Responsável"
                  name="contato_nome"
                  value={form.contato_nome}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Nome completo"
                />

                <Field
                  label="E-mail da oficina / contato"
                  name="contato_email"
                  type="email"
                  value={form.contato_email}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="nome@empresa.com.br"
                />

                <Field
                  label="Telefone"
                  name="contato_telefone"
                  type="tel"
                  value={form.contato_telefone}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="(00) 00000-0000"
                />

                <Field
                  label="Código da peça"
                  name="codigo_peca"
                  value={form.codigo_peca}
                  onChange={handleChange}
                  maxLength={60}
                  placeholder="Ex.: NX-4410-02"
                />

                <Field
                  label="Descrição da peça"
                  name="nome_peca"
                  value={form.nome_peca}
                  onChange={handleChange}
                  required
                  maxLength={160}
                  placeholder="Nome ou descrição"
                />

                <Field
                  label="Quantidade"
                  name="quantidade"
                  type="number"
                  value={form.quantidade}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Modelo do veículo"
                  name="modelo_veiculo"
                  value={form.modelo_veiculo}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="Modelo do equipamento"
                />

                <Field
                  label="Chassi"
                  name="chassi"
                  value={form.chassi}
                  onChange={handleChange}
                  maxLength={40}
                  placeholder="Número do chassi"
                />

                <div className="grid gap-2">
                  <label
                    htmlFor="urgencia"
                    className="text-sm font-medium text-foreground"
                  >
                    Urgência
                    <span className="text-secondary"> *</span>
                  </label>

                  <select
                    id="urgencia"
                    name="urgencia"
                    value={form.urgencia}
                    onChange={handleChange}
                    required
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  >
                    {urgencias.map((urgencia) => (
                      <option key={urgencia} value={urgencia}>
                        {urgencia}
                      </option>
                    ))}
                  </select>
                </div>

                {form.urgencia === "Veículo parado (VOR)" && (
                  <div className="flex gap-3 rounded-sm border border-amber-500/30 bg-amber-500/10 p-4 sm:col-span-2">
                    <AlertTriangle
                      className="h-5 w-5 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-foreground">
                      Você selecionou veículo parado. Descreva nas observações o
                      impacto operacional e informe um telefone para contato
                      rápido. A prioridade será avaliada pela equipe.
                    </p>
                  </div>
                )}

                <div className="grid gap-2 sm:col-span-2">
                  <label
                    htmlFor="observacoes"
                    className="text-sm font-medium text-foreground"
                  >
                    Observações
                  </label>

                  <textarea
                    id="observacoes"
                    name="observacoes"
                    rows={5}
                    maxLength={2000}
                    value={form.observacoes}
                    onChange={handleChange}
                    placeholder="Informações adicionais, aplicação da peça, chamado relacionado ou detalhes para identificação."
                    className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />

                  <p className="text-right text-xs text-muted-foreground">
                    {form.observacoes.length}/2000 caracteres
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {enviando ? "Processando..." : "Solicitar peça"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Os dados só serão registrados quando a integração com o
                    sistema de Pós-Vendas estiver configurada.
                  </p>
                </div>
              </form>
            </div>

            <aside className="h-fit rounded-xl border border-border bg-secondary/5 p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-secondary/10 text-secondary">
                <PackageSearch className="h-6 w-6" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-foreground">
                Prazos de referência
              </h2>

              <ul className="mt-5 space-y-5">
                {prazos.map((item) => (
                  <li
                    key={item.titulo}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <p className="font-semibold text-foreground">
                      {item.titulo}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.prazo}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Dica para agilizar
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Informe o código da peça e o chassi sempre que possível. Isso
                  ajuda a reduzir dúvidas durante a identificação do item.
                </p>
              </div>

              <Link
                href="/faq"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-secondary"
              >
                Consultar perguntas frequentes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
