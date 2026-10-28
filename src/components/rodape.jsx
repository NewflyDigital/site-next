import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Institucional",
    links: [
      { label: "Home", href: "/" },
      { label: "Quem somos", href: "/quem-somos" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    title: "Produtos",
    links: [
      { label: "Guindastes", href: "/produtos/guindastes" },
      { label: "Cestas Aéreas", href: "/produtos/cestas-aereas" },
      {
        label: "Cabines Suplementares",
        href: "/produtos/cabines-suplementares",
      },
      { label: "Linha Bebidas", href: "/produtos/linha-bebidas" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/next-implementos/",
    image: "/linkedin-branco.png",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/nextimplementos",
    image: "/facebook-branco.png",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/p/DfC5fuvCsFH/",
    image: "/instagram-branco.png",
  },
];

export default function Rodape() {
  return (
    <footer className="bg-industrial px-5 pb-8 pt-16 text-surface-contrast lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-12 border-b border-surface-contrast/10 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:pb-16">
          {/* Marca */}
          <div>
            <Link href="/" aria-label="NEXT Implementos - Página inicial">
              <img
                src="/static/images/next-logo.png"
                alt="NEXT Implementos"
                className="w-52"
                width="292"
                height="80"
              />
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 opacity-60">
              Engenharia brasileira para operações que exigem segurança,
              produtividade e confiança.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Acesse a NEXT Implementos no ${social.name}`}
                  className="inline-flex items-center justify-center opacity-75 transition-opacity hover:opacity-100"
                >
                  <img
                    src={social.image}
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6 object-contain"
                    width="24"
                    height="24"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="eyebrow opacity-45">{column.title}</p>

              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-65 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Atendimento */}
          <div>
            <p className="eyebrow opacity-45">Atendimento</p>

            <p className="mt-6 text-sm leading-6 opacity-65">
              Monte Mor — SP
              <br />
              Brasil
            </p>

            <Link
              href="/contato"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary transition-opacity hover:opacity-80"
            >
              Fale com a NEXT
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="/pos-venda"
              className="mt-4 flex items-center gap-2 text-sm opacity-65 transition-colors hover:text-primary"
            >
              Pós-vendas
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="https://next-implementos.factorialhr.com.br/"
              className="mt-4 flex items-center gap-2 text-sm opacity-65 transition-colors hover:text-primary"
            >
              Trabalhe Conosco
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Informações legais */}
        <div className="flex flex-col gap-5 pt-7 text-xs opacity-45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} NEXT Implementos. Todos os direitos
            reservados.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link
              href="/politica-de-privacidade"
              className="transition-colors hover:text-surface-contrast"
            >
              Política de Privacidade
            </Link>

            <Link
              href="/politica-de-cookies"
              className="transition-colors hover:text-surface-contrast"
            >
              Política de Cookies
            </Link>

            <Link
              href="/termos-de-uso"
              className="transition-colors hover:text-surface-contrast"
            >
              Termos de Uso
            </Link>
          </div>
        </div>

        {/* Crédito */}
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-surface-contrast/10 pt-5 text-xs opacity-45">
          <span>Desenvolvido por</span>

          <a
            href="https://newfly.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Newfly"
          >
            <img src="/newfly.png" alt="Newfly" className="w-40" />
          </a>
        </div>
      </div>
    </footer>
  );
}
