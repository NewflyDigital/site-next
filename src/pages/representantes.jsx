import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import Link from "next/link";

import Menu from "../components/menu";
import Rodape from "../components/rodape";
import Whats from "../components/whats";
import MapaBrasil from "../components/MapaBrasil";

const ESTADOS = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

function normalizarEstado(estado) {
  if (!estado) return "";
  const valor = String(estado).trim().toUpperCase();

  if (ESTADOS[valor]) return valor;

  const encontrado = Object.entries(ESTADOS).find(
    ([, nome]) => nome.toUpperCase() === valor,
  );

  return encontrado ? encontrado[0] : valor;
}

function formatarTelefone(telefone) {
  return String(telefone || "").trim();
}

function linkTelefone(telefone) {
  return String(telefone || "").replace(/\D/g, "");
}

function CartaoRepresentante({ representante }) {
  const telefone = formatarTelefone(representante.telefone);
  const telefoneLink = linkTelefone(telefone);

  return (
    <article className="rep-card">
      <div className="rep-card-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      </div>

      <div className="rep-card-content">
        {representante.empresa && (
          <span className="rep-company">{representante.empresa}</span>
        )}

        <h3>{representante.contato || "Representante comercial"}</h3>

        {representante.cargo && (
          <p className="rep-role">{representante.cargo}</p>
        )}

        {telefone && (
          <a
            className="rep-contact"
            href={telefoneLink ? `tel:${telefoneLink}` : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 18a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.2 2 2 0 0 1 4.1 1h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {telefone}
          </a>
        )}

        {representante.email && (
          <a className="rep-contact" href={`mailto:${representante.email}`}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {representante.email}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Representantes() {
  const [estadoSelecionado, setEstadoSelecionado] = useState("RS");
  const [representantes, setRepresentantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarRepresentantes() {
      try {
        setCarregando(true);
        setErro(false);

        const snapshot = await getDocs(collection(db, "representantes"));

        const lista = snapshot.docs
          .map((documento) => ({
            id: documento.id,
            ...documento.data(),
          }))
          .filter((item) => item.ativo === true)
          .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

        setRepresentantes(lista);
      } catch (error) {
        console.error("Erro ao carregar representantes:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarRepresentantes();
  }, []);

  const representantesEstado = useMemo(
    () =>
      representantes.filter(
        (item) =>
          item.tipo === "comercial" &&
          normalizarEstado(item.estado) === estadoSelecionado,
      ),
    [representantes, estadoSelecionado],
  );

  const representantesTI = useMemo(
    () => representantes.filter((item) => item.tipo === "ti"),
    [representantes],
  );

  return (
    <>
      <Menu />

      <main className="pagina-representantes">
        <section className="rep-hero">
          <div className="rep-hero-overlay" />

          <div className="rep-container rep-hero-content">
            <span className="rep-eyebrow">NOSSA PRESENÇA</span>

            <h1>
              Estamos perto de
              <br />
              <span>quem faz acontecer.</span>
            </h1>

            <p>
              Encontre o representante comercial da NEXT Implementos na sua
              região e fale com quem entende do seu negócio.
            </p>
          </div>
        </section>

        <section className="rep-main-section">
          <div className="rep-container">
            <div className="rep-section-heading">
              <div>
                <span className="rep-eyebrow rep-eyebrow-dark">
                  ATENDIMENTO COMERCIAL
                </span>
                <h2>
                  Encontre seu <span>representante</span>
                </h2>
                <p>
                  Selecione um estado no mapa para consultar os contatos
                  comerciais disponíveis na região.
                </p>
              </div>
            </div>

            <div className="rep-layout">
              <section className="rep-results">
                <div className="rep-selected-state">
                  <div className="rep-state-marker">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </div>

                  <div>
                    <span>ESTADO SELECIONADO</span>
                    <h3>{ESTADOS[estadoSelecionado] || estadoSelecionado}</h3>
                  </div>

                  <span className="rep-uf">{estadoSelecionado}</span>
                </div>

                <div className="rep-results-body">
                  {carregando ? (
                    <div className="rep-feedback">
                      <span className="rep-spinner" />
                      <p>Carregando representantes...</p>
                    </div>
                  ) : erro ? (
                    <div className="rep-feedback">
                      <h3>Não foi possível carregar os contatos.</h3>
                      <p>
                        Verifique sua conexão e as permissões de leitura do
                        Firestore.
                      </p>
                    </div>
                  ) : representantesEstado.length > 0 ? (
                    <>
                      <div className="rep-count">
                        {representantesEstado.length}{" "}
                        {representantesEstado.length === 1
                          ? "contato encontrado"
                          : "contatos encontrados"}
                      </div>

                      <div className="rep-cards">
                        {representantesEstado.map((representante) => (
                          <CartaoRepresentante
                            key={representante.id}
                            representante={representante}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rep-empty">
                      <div className="rep-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="m16 16 4 4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <h3>Estamos ampliando nossa presença.</h3>
                      <p>
                        No momento, não há representantes comerciais cadastrados
                        para {ESTADOS[estadoSelecionado]}. Entre em contato com
                        a NEXT para receber orientação.
                      </p>

                      <button
                        type="button"
                        className="rep-outline-button"
                        onClick={() => (window.location.href = "/contato")}
                      >
                        Falar com a NEXT
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section className="rep-map-panel">
                <div className="rep-map-heading">
                  <div>
                    <span className="rep-eyebrow rep-eyebrow-dark">
                      COBERTURA NACIONAL
                    </span>
                    <h3>Onde estamos</h3>
                  </div>

                  <span className="rep-map-hint">
                    <span />
                    Selecione um estado
                  </span>
                </div>

                <MapaBrasil
                  estadoSelecionado={estadoSelecionado}
                  onSelectEstado={setEstadoSelecionado}
                />

                <div className="rep-map-legend">
                  <span className="rep-legend-dot" />
                  <span>Estado selecionado</span>
                </div>
              </section>
            </div>
          </div>
        </section>

        {representantesTI.length > 0 && (
          <section className="rep-ti-section">
            <div className="rep-container">
              <div className="rep-ti-heading">
                <span className="rep-eyebrow">SUPORTE E SERVIÇOS</span>
                <h2>
                  Contato de <span>TI</span>
                </h2>
                <p>
                  Para assuntos relacionados a suporte técnico e serviços, entre
                  em contato com nossa equipe responsável.
                </p>
              </div>

              <div className="rep-ti-grid">
                {representantesTI.map((representante) => (
                  <CartaoRepresentante
                    key={representante.id}
                    representante={representante}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-primary px-5 py-20 text-primary-foreground lg:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-primary-foreground/70">
                Fale com um especialista
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-tight sm:text-5xl">
                Precisa deste equipamento na sua operação?
              </h2>
            </div>

            <Link
              href={{
                pathname: "/contato",
              }}
              className="inline-flex items-center gap-2 bg-background px-6 py-4 text-sm font-bold uppercase text-foreground"
            >
              Solicitar orçamento <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Rodape />
      <Whats />

      <style jsx global>{`
        .pagina-representantes {
          color: #202329;
          background: #fff;
        }

        .rep-container {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rep-hero {
          min-height: 600px;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              100deg,
              rgba(13, 17, 22, 0.94),
              rgba(13, 17, 22, 0.58)
            ),
            url("/static/images/next-hero.jpg") center 55% / cover no-repeat;
        }

        .rep-hero-overlay {
          position: absolute;
          inset: auto 0 0;
          height: 5px;
          background: #d90820;
        }

        .rep-hero-content {
          position: relative;
          padding-top: 54px;
          padding-bottom: 58px;
        }

        .rep-eyebrow {
          display: inline-block;
          color: #d90820;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.3px;
          line-height: 1.5;
        }

        .rep-hero h1 {
          margin: 18px 0 16px;
          max-width: 760px;
          color: #fff;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -1.8px;
        }

        .rep-hero h1 span {
          color: #d90820;
        }

        .rep-hero p {
          max-width: 590px;
          margin: 0;
          color: #e2e5e9;
          font-size: 16px;
          line-height: 1.8;
        }

        .rep-main-section {
          padding: 78px 0 84px;
        }

        .rep-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 34px;
        }

        .rep-eyebrow-dark {
          color: #5a050f;
        }

        .rep-section-heading h2,
        .rep-ti-heading h2 {
          margin: 12px 0 10px;
          color: #202329;
          font-size: clamp(28px, 3.4vw, 40px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .rep-section-heading h2 span,
        .rep-ti-heading h2 span {
          color: #d90820;
        }

        .rep-section-heading p,
        .rep-ti-heading > p {
          max-width: 680px;
          margin: 0;
          color: #666d76;
          font-size: 15px;
          line-height: 1.8;
        }

        .rep-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 28px;
          align-items: stretch;
        }

        .rep-results,
        .rep-map-panel {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e7e8eb;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 12px 38px rgba(18, 24, 32, 0.055);
        }

        .rep-selected-state {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 23px 24px;
          border-bottom: 1px solid #e9eaec;
          background: #f7f8fa;
        }

        .rep-state-marker {
          display: grid;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          place-items: center;
          border-radius: 6px;
          color: #5a050f;
          background: #ffbfc7;
        }

        .rep-state-marker svg {
          width: 22px;
          height: 22px;
        }

        .rep-selected-state > div:nth-child(2) {
          min-width: 0;
        }

        .rep-selected-state > div:nth-child(2) > span {
          color: #777e87;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .rep-selected-state h3 {
          margin: 4px 0 0;
          color: #22262c;
          font-size: 20px;
          font-weight: 800;
        }

        .rep-uf {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 34px;
          margin-left: auto;
          border: 1px solid #ffbfc7;
          border-radius: 4px;
          color: #5a050f;
          background: #ffbfc7;
          font-size: 12px;
          font-weight: 800;
        }

        .rep-results-body {
          min-height: 300px;
          padding: 24px;
        }

        .rep-count {
          margin-bottom: 16px;
          color: #777e87;
          font-size: 12px;
          font-weight: 700;
        }

        .rep-cards {
          display: grid;
          gap: 12px;
        }

        .rep-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          min-width: 0;
          padding: 20px;
          border: 1px solid #e8e9ec;
          border-radius: 6px;
          background: #fff;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .rep-card:hover {
          border-color: #d90820;
          box-shadow: 0 7px 22px rgba(90, 5, 15, 0.09);
        }

        .rep-card-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          border-radius: 5px;
          color: #5a050f;
          background: #ffbfc7;
        }

        .rep-card-icon svg {
          width: 23px;
          height: 23px;
        }

        .rep-card-content {
          min-width: 0;
          flex: 1;
        }

        .rep-company {
          display: block;
          margin-bottom: 5px;
          color: #5a050f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .rep-card h3 {
          margin: 0;
          color: #23272d;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .rep-role {
          margin: 5px 0 12px;
          color: #707781;
          font-size: 13px;
          line-height: 1.6;
        }

        .rep-contact {
          display: flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          max-width: 100%;
          margin-top: 9px;
          color: #444b54;
          font-size: 13px;
          line-height: 1.5;
          text-decoration: none;
          overflow-wrap: anywhere;
        }

        .rep-contact:hover {
          color: #5a050f;
        }

        .rep-contact svg {
          width: 16px;
          height: 16px;
          flex: 0 0 16px;
          color: #5a050f;
        }

        .rep-empty,
        .rep-feedback {
          display: flex;
          min-height: 250px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .rep-empty-icon {
          display: grid;
          width: 54px;
          height: 54px;
          margin-bottom: 16px;
          place-items: center;
          border-radius: 50%;
          color: #5a050f;
          background: #ffbfc7;
        }

        .rep-empty-icon svg {
          width: 25px;
          height: 25px;
        }

        .rep-empty h3,
        .rep-feedback h3 {
          margin: 0 0 9px;
          color: #282d33;
          font-size: 17px;
          font-weight: 800;
        }

        .rep-empty p,
        .rep-feedback p {
          max-width: 340px;
          margin: 0;
          color: #737a83;
          font-size: 13px;
          line-height: 1.8;
        }

        .rep-outline-button {
          margin-top: 20px;
          padding: 12px 18px;
          border: 1px solid #d90820;
          border-radius: 4px;
          color: #5a050f;
          background: #fff;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition:
            background 150ms ease,
            color 150ms ease;
        }

        .rep-outline-button:hover {
          color: #fff;
          background: #5a050f;
          border-color: #5a050f;
        }

        .rep-map-panel {
          display: flex;
          flex-direction: column;
          padding: 26px 26px 20px;
        }

        .rep-map-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .rep-map-heading h3 {
          margin: 7px 0 0;
          color: #22262c;
          font-size: 23px;
          font-weight: 800;
        }

        .rep-map-hint {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #767d85;
          font-size: 10px;
          line-height: 1.5;
        }

        .rep-map-hint > span,
        .rep-legend-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 50%;
          background: #d90820;
        }

        .rep-map-panel :global(.mapa-brasil-container) {
          margin-top: 24px;
          margin-bottom: 14px;
        }

        .rep-map-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #eceef0;
          color: #707781;
          font-size: 11px;
        }

        .rep-ti-section {
          padding: 72px 0;
          background: #f5f6f8;
        }

        .rep-ti-heading {
          margin-bottom: 28px;
        }

        .rep-ti-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .rep-cta {
          padding: 48px 0;
          color: #fff;
          background: #5a050f;
          border-top: 4px solid #d90820;
        }

        .rep-cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .rep-cta h2 {
          margin: 10px 0 0;
          color: #fff;
          font-size: clamp(23px, 3vw, 34px);
          font-weight: 800;
          line-height: 1.25;
        }

        .rep-cta-button {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 16px 22px;
          border-radius: 4px;
          color: #5a050f;
          background: #ffbfc7;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition:
            background 160ms ease,
            color 160ms ease;
        }

        .rep-cta-button:hover {
          color: #fff;
          background: #d90820;
        }

        .rep-cta-button span {
          font-size: 20px;
        }

        .rep-spinner {
          width: 30px;
          height: 30px;
          margin-bottom: 15px;
          border: 3px solid #ffbfc7;
          border-top-color: #d90820;
          border-radius: 50%;
          animation: rep-spin 0.8s linear infinite;
        }

        @keyframes rep-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .rep-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .rep-map-panel {
            grid-row: 1;
          }

          .rep-map-panel :global(.mapa-brasil-container) {
            max-width: 520px;
          }

          .rep-ti-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 600px) {
          .rep-container {
            width: calc(100% - 32px);
          }

          .rep-hero {
            min-height: 0px;
          }

          .rep-hero-content {
            padding-top: 44px;
            padding-bottom: 48px;
          }

          .rep-hero h1 {
            letter-spacing: -1px;
          }

          .rep-hero p {
            font-size: 14px;
          }

          .rep-main-section {
            padding: 48px 0;
          }

          .rep-section-heading {
            margin-bottom: 24px;
          }

          .rep-selected-state {
            padding: 18px 16px;
            gap: 10px;
          }

          .rep-selected-state h3 {
            font-size: 17px;
          }

          .rep-results-body {
            padding: 18px 14px;
          }

          .rep-card {
            padding: 16px 13px;
            gap: 11px;
          }

          .rep-card-icon {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
          }

          .rep-card h3 {
            font-size: 15px;
          }

          .rep-contact {
            font-size: 12px;
          }

          .rep-map-panel {
            padding: 20px 14px 16px;
          }

          .rep-map-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .rep-ti-section {
            padding: 48px 0;
          }

          .rep-cta {
            padding: 36px 0;
          }

          .rep-cta-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .rep-cta h2 br {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
