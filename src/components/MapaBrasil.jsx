import { useState } from "react";
import mapaBrasil from "@svg-maps/brazil";

const ESTADO_INICIAL = "RS";

function obterSigla(id) {
  return String(id).split("-").pop().toUpperCase();
}

export default function MapaBrasil({
  estadoSelecionado = ESTADO_INICIAL,
  onSelectEstado,
}) {
  const [estadoHover, setEstadoHover] = useState(null);

  return (
    <div className="mapa-brasil-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={mapaBrasil.viewBox}
        role="group"
        aria-label="Mapa interativo dos estados do Brasil"
        className="mapa-brasil"
      >
        {mapaBrasil.locations.map((estado) => {
          const sigla = obterSigla(estado.id);
          const selecionado = sigla === String(estadoSelecionado).toUpperCase();
          const emHover = sigla === estadoHover;

          return (
            <path
              key={estado.id}
              d={estado.path}
              fill={selecionado ? "#D90820" : emHover ? "#ffbfc7" : "#d1d5db"}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="mapa-brasil-estado"
              role="button"
              tabIndex={0}
              aria-label={estado.name}
              aria-pressed={selecionado}
              onMouseEnter={() => setEstadoHover(sigla)}
              onMouseLeave={() => setEstadoHover(null)}
              onClick={() => onSelectEstado?.(sigla)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectEstado?.(sigla);
                }
              }}
            >
              <title>{estado.name}</title>
            </path>
          );
        })}
      </svg>

      <style jsx>{`
        .mapa-brasil-container {
          width: 100%;
          max-width: 580px;
          margin: 0 auto;
        }

        .mapa-brasil {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .mapa-brasil-estado {
          cursor: pointer;
          transition: fill 160ms ease;
          outline: none;
        }

        .mapa-brasil-estado:focus-visible {
          stroke: #292929;
          stroke-width: 3;
        }
      `}</style>
    </div>
  );
}
