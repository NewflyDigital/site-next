import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function PopupPromocional() {
  const [config, setConfig] = useState(null);
  const [fechado, setFechado] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarPopup() {
      try {
        if (sessionStorage.getItem("next-popup-fechado") === "1") {
          return;
        }
        const snapshot = await getDoc(doc(db, "siteConfig", "popup"));

        if (!ativo || !snapshot.exists()) return;

        const dados = snapshot.data();

        if (
          dados.ativo === true &&
          (dados.titulo || dados.texto || dados.imagemFundoUrl)
        ) {
          setConfig(dados);
          setFechado(false);
        }
      } catch (error) {
        console.error("Erro ao carregar pop-up:", error);
      }
    }

    carregarPopup();

    return () => {
      ativo = false;
    };
  }, []);

  function fecharPopup() {
    sessionStorage.setItem("next-popup-fechado", "1");
    setFechado(true);
  }

  useEffect(() => {
    let ativo = true;

    async function carregarPopup() {
      try {
        const snapshot = await getDoc(doc(db, "siteConfig", "popup"));

        console.log("Documento do pop-up existe:", snapshot.exists());

        if (!ativo || !snapshot.exists()) return;

        const dados = snapshot.data();

        console.log("Configuração do pop-up:", dados);

        if (
          dados.ativo === true &&
          (dados.titulo || dados.texto || dados.imagemFundoUrl)
        ) {
          setConfig(dados);
          setFechado(false);
        } else {
          console.warn("Pop-up desativado ou sem conteúdo para exibir.");
        }
      } catch (error) {
        console.error("Erro ao carregar pop-up do Firestore:", error);
      }
    }

    carregarPopup();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (fechado) return;

    function pressionouEsc(event) {
      if (event.key === "Escape") fecharPopup();
    }

    document.addEventListener("keydown", pressionouEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", pressionouEsc);
      document.body.style.overflow = "";
    };
  }, [fechado]);

  if (!config || fechado) return null;

  const temImagem = Boolean(config.imagemFundoUrl);

  const linkExterno = /^https?:\/\//i.test(config.botaoLink);

  return (
    <div
      className="popup-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) fecharPopup();
      }}
    >
      <section
        className={`popup-promocional ${temImagem ? "com-imagem" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-titulo"
        style={
          temImagem
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(17, 21, 25, .96), rgba(17, 21, 25, .72)), url("${config.imagemFundoUrl}")`,
              }
            : undefined
        }
      >
        <button
          type="button"
          className="popup-fechar"
          onClick={fecharPopup}
          aria-label="Fechar pop-up"
        >
          ×
        </button>

        <div className="popup-conteudo">
          <span className="popup-identidade">NEXT IMPLEMENTOS</span>

          {config.titulo && <h2 id="popup-titulo">{config.titulo}</h2>}

          {config.texto && <p>{config.texto}</p>}

          {config.botaoTexto && config.botaoLink && (
            <a
              className="popup-botao"
              href={config.botaoLink}
              onClick={fecharPopup}
              target={linkExterno ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              {config.botaoTexto}
            </a>
          )}
        </div>
      </section>

      <style jsx>{`
        .popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(8, 11, 15, 0.76);
          backdrop-filter: blur(5px);
          animation: popup-aparecer 180ms ease-out;
        }

        .popup-promocional {
          position: relative;
          width: min(760px, 100%);
          min-height: 350px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
          border-top: 5px solid #d90820;
          background: #5a050f;
          color: #fff;
          background-position: center;
          background-size: cover;
          box-shadow: 0 25px 90px rgba(0, 0, 0, 0.4);
        }

        .popup-promocional.com-imagem {
          background-repeat: no-repeat;
        }

        .popup-conteudo {
          width: 100%;
          max-width: 650px;
          padding: 56px 54px;
        }

        .popup-identidade {
          color: #ffbfc7;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .popup-conteudo h2 {
          margin: 18px 0 14px;
          color: #fff;
          font-size: clamp(28px, 4vw, 43px);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.8px;
          white-space: pre-line;
        }

        .popup-conteudo p {
          margin: 0;
          color: #e3e5e8;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .popup-fechar {
          position: absolute;
          top: 14px;
          right: 16px;
          z-index: 2;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
          color: #fff;
          background: rgba(0, 0, 0, 0.24);
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          transition: background 150ms ease;
        }

        .popup-fechar:hover {
          background: #d90820;
          color: #ffffff;
        }

        .popup-botao {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 28px;
          padding: 15px 21px;
          border-radius: 4px;
          color: #ffffff;
          background: #d90820;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: background 150ms ease;
        }

        .popup-botao:hover {
          background: #5a050f;
        }

        .popup-botao span {
          font-size: 20px;
        }

        @keyframes popup-aparecer {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .popup-backdrop {
            padding: 14px;
          }

          .popup-promocional {
            min-height: 320px;
          }

          .popup-conteudo {
            padding: 48px 24px 32px;
          }

          .popup-conteudo p {
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .popup-backdrop {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
