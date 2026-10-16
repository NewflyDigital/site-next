import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

import Menu from "../components/menu";
import Rodape from "../components/rodape";

const initialForm = {
  oficina: "Oficina parceira",
  cnpj: "",
  contato_nome: "",
  contato_email: "",
  contato_telefone: "",
  cliente_nome: "",
  chassi_placa: "",
  modelo: "",
  tipo: "Produto",
  prioridade: "Media",
  descricao: "",
};

const origens = ["Cliente", "Oficina parceira"];
const tipos = [
  "Produto",
  "Garantia",
  "Atendimento",
  "Peça em falta",
  "Veículo parado (VOR)",
];
const prioridades = [
  { value: "Baixa", label: "Baixa" },
  { value: "Media", label: "Média" },
  { value: "Alta", label: "Alta" },
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
        className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = true,
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-secondary"> *</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      >
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function ReclamacoesPage() {
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
      cnpj: form.cnpj.trim(),
      contato_nome: form.contato_nome.trim(),
      contato_email: form.contato_email.trim(),
      contato_telefone: form.contato_telefone.trim(),
      cliente_nome: form.cliente_nome.trim(),
      chassi_placa: form.chassi_placa.trim(),
      modelo: form.modelo.trim(),
      descricao: form.descricao.trim(),
    };

    if (dados.contato_nome.length < 2) {
      setErro("Informe o nome do responsável pelo registro.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.contato_email)) {
      setErro("Informe um endereço de e-mail válido.");
      return;
    }

    if (dados.cliente_nome.length < 2) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (dados.descricao.length < 20) {
      setErro("Descreva o problema com pelo menos 20 caracteres.");
      return;
    }

    /*
      Integração pendente:
      conectar ao Supabase e chamar a função RPC
      criar_reclamacao antes de confirmar o registro.
    */

    setEnviando(true);

    try {
      setErro(
        "O formulário ainda precisa ser conectado ao sistema de Pós-Vendas. Sua reclamação não foi enviada nem registrada.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Head>
        <title>Registrar reclamação | Pós-Vendas Next</title>
        <meta
          name="description"
          content="Registre uma reclamação de cliente Next informando os dados do responsável, do veículo, a prioridade e a descrição do problema."
        />
        <meta
          property="og:title"
          content="Registrar reclamação | Pós-Vendas Next"
        />
        <meta
          property="og:description"
          content="Canal de registro de reclamações para clientes e oficinas parceiras Next."
        />
      </Head>

      <Menu />

      <main>
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-6xl px-5 sm:pb-14 sm:pt-[10rem]  py-16">
            <Link
              href="/pos-venda"
              className="inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao Pós-Vendas
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              Central de chamados
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-5xl">
              Registrar reclamação de cliente
            </h1>

            <p className="mt-5 max-w-2xl leading-relaxed text-background/75 sm:text-lg">
              Descreva o caso com o máximo de detalhes para ajudar na análise.
              Informe os dados do cliente e do veículo, selecione a prioridade e
              explique o problema encontrado.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
            {protocolo && (
              <div className="mb-6 rounded-sm border border-green-600/30 bg-green-600/5 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-green-700"
                    aria-hidden="true"
                  />

                  <div>
                    <h2 className="font-semibold text-foreground">
                      Reclamação registrada
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Guarde o protocolo{" "}
                      <strong className="text-foreground">{protocolo}</strong>{" "}
                      para acompanhar a solicitação com a equipe de Pós-Vendas.
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
              <div className="sm:col-span-2">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary/10 text-secondary">
                    <ClipboardList className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-foreground">
                      Dados do atendimento
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Identifique a origem e o responsável pela solicitação.
                    </p>
                  </div>
                </div>
              </div>

              <SelectField
                label="Origem do atendimento"
                name="oficina"
                value={form.oficina}
                onChange={handleChange}
                options={origens}
              />

              <Field
                label="CNPJ"
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                maxLength={20}
                placeholder="00.000.000/0000-00"
              />

              <Field
                label="Responsável pelo registro"
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
                label="Nome do cliente"
                name="cliente_nome"
                value={form.cliente_nome}
                onChange={handleChange}
                required
                maxLength={120}
                placeholder="Nome do cliente"
              />

              <div className="sm:col-span-2 mt-3">
                <div className="border-b border-border pb-4">
                  <h2 className="font-semibold text-foreground">
                    Dados do veículo e da ocorrência
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Preencha os dados disponíveis para facilitar a análise.
                  </p>
                </div>
              </div>

              <Field
                label="Chassi ou placa"
                name="chassi_placa"
                value={form.chassi_placa}
                onChange={handleChange}
                maxLength={40}
                placeholder="Chassi ou placa do veículo"
              />

              <Field
                label="Modelo do veículo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                maxLength={80}
                placeholder="Modelo do equipamento"
              />

              <SelectField
                label="Tipo de reclamação"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                options={tipos}
              />

              <SelectField
                label="Prioridade"
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
                options={prioridades}
              />

              {form.tipo === "Veículo parado (VOR)" && (
                <div className="flex gap-3 rounded-sm border border-amber-500/30 bg-amber-500/10 p-4 sm:col-span-2">
                  <AlertTriangle
                    className="h-5 w-5 shrink-0 text-amber-700"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-foreground">
                    Você selecionou veículo parado. Descreva o impacto
                    operacional e informe um telefone para contato. A
                    classificação e a prioridade finais devem ser confirmadas
                    pela equipe de Pós-Vendas.
                  </p>
                </div>
              )}

              <div className="grid gap-2 sm:col-span-2">
                <label
                  htmlFor="descricao"
                  className="text-sm font-medium text-foreground"
                >
                  Descrição do problema
                  <span className="text-secondary"> *</span>
                </label>

                <textarea
                  id="descricao"
                  name="descricao"
                  rows={6}
                  maxLength={3000}
                  minLength={20}
                  required
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descreva os sintomas, as condições de uso, a quilometragem, os testes já realizados e as peças envolvidas."
                  className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />

                <p className="text-right text-xs text-muted-foreground">
                  {form.descricao.length}/3000 caracteres
                </p>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {enviando ? "Processando..." : "Registrar reclamação"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Os dados só serão registrados quando a integração com o
                  sistema de Pós-Vendas estiver configurada.
                </p>
              </div>
            </form>

            <div className="mt-8 rounded-xl border border-border bg-secondary/5 p-6">
              <h2 className="font-semibold text-foreground">
                Precisa consultar uma orientação antes?
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Consulte as perguntas frequentes para obter informações sobre
                garantia, peças e procedimentos de atendimento.
              </p>

              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-secondary"
              >
                Consultar perguntas frequentes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  );
}
