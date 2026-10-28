"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Menu as MenuIcon,
  Search,
  X,
} from "lucide-react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
{
  /*
  Quando puxava da Lib
  import { lineInfo, products } from "../../lib/catalog";

const productLines = Object.entries(lineInfo);

  */
}
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d90820]";

const buttonPrimary = `${buttonBase} border-[#d90820] bg-[#d90820] text-[#ffffff] hover:bg-transparent hover:text-[#d90820]`;

const buttonGlass = `${buttonBase} border-white/50 bg-transparent text-white hover:border-[#d90820] hover:bg-[#d90820] hover:text-[#ffffff]`;

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();

  const [solid, setSolid] = useState(false);
  const [openLine, setOpenLine] = useState(null);
  const [previewSlug, setPreviewSlug] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [linhas, setLinhas] = useState([]);
  const [products, setProducts] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [snapshotLinhas, snapshotProdutos] = await Promise.all([
          getDocs(collection(db, "linhas")),
          getDocs(collection(db, "produtos")),
        ]);

        const linhasBanco = snapshotLinhas.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((linha) => linha.ativo === true)
          .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

        const produtosBanco = snapshotProdutos.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((produto) => produto.ativo !== false)
          .sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

        setLinhas(linhasBanco);
        setProducts(produtosBanco);
      } catch (error) {
        console.error("Erro ao carregar menu da NEXT:", error);
      } finally {
        setDadosCarregados(true);
      }
    }

    carregarDados();
  }, []);

  const productLines = linhas.map((linha) => [
    linha.slug,
    {
      ...linha,
      label: linha.nome,
      description: linha.description || linha.headline || "",
    },
  ]);

  const currentLine = productLines.find(([line]) =>
    pathname.startsWith(`/produtos/${line}`),
  )?.[0];

  const activeLine = openLine ?? currentLine ?? "guindastes";
  const activeInfo = productLines.find(([line]) => line === activeLine)?.[1];

  const activeProducts = products.filter(
    (product) => product.line === activeLine,
  );

  const previewProduct =
    activeProducts.find((product) => product.slug === previewSlug) ??
    activeProducts.find((product) => product.featured && product.image) ??
    activeProducts.find((product) => product.image) ??
    activeProducts[0];

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenLine(null);
    setPreviewSlug(null);
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!openLine && !searchOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenLine(null);
        setPreviewSlug(null);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openLine, searchOpen]);

  function closeMenus() {
    setOpenLine(null);
    setPreviewSlug(null);
    setMobileOpen(false);
    setMobileProductsOpen(false);
    setSearchOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      router.push("/produtos");
      closeMenus();
      return;
    }

    router.push(`/produtos?q=${encodeURIComponent(query)}`);
    closeMenus();
  }

  function productHref(product) {
    return `/produtos/${product.line}/${product.slug}`;
  }

  return (
    <header
      onMouseLeave={() => {
        setOpenLine(null);
        setPreviewSlug(null);
      }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        solid || openLine
          ? "border-white/10 bg-[#111519] shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
          : "border-white/10 bg-[#111519]/70 backdrop-blur-sm"
      }`}
    >
      {/* Cabeçalho principal */}
      <div className="mx-auto grid h-20 max-w-[1480px] grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-10">
        <Link
          href="/"
          aria-label="NEXT Implementos — início"
          onClick={closeMenus}
          className="min-w-0"
        >
          <img
            src="/static/images/next-logo.png"
            alt="NEXT Implementos"
            className="h-auto w-50 max-w-full sm:w-44 lg:w-60"
            width="292"
            height="80"
          />
        </Link>

        {/* Navegação desktop */}
        <nav
          className="hidden items-center justify-center gap-6 xl:gap-8 lg:flex"
          aria-label="Navegação principal"
        >
          <Link
            href="/"
            onClick={closeMenus}
            className={`text-sm transition-colors hover:text-[#d90820] ${
              pathname === "/" ? "text-[#d90820]" : "text-white"
            }`}
          >
            Home
          </Link>

          <Link
            href="/quem-somos"
            onClick={closeMenus}
            className={`text-sm transition-colors hover:text-[#d90820] ${
              pathname === "/quem-somos" ? "text-[#d90820]" : "text-white"
            }`}
          >
            Quem somos
          </Link>

          <Link
            href="/produtos"
            onMouseEnter={() => {
              setOpenLine(currentLine ?? "guindastes");
              setPreviewSlug(null);
              setSearchOpen(false);
            }}
            onFocus={() => {
              setOpenLine(currentLine ?? "guindastes");
              setPreviewSlug(null);
            }}
            className={`inline-flex items-center gap-1 text-sm transition-colors hover:text-[#d90820] ${
              openLine ? "text-[#d90820]" : "text-white"
            }`}
          >
            Produtos
            <ChevronDown
              size={14}
              className={`transition-transform ${openLine ? "rotate-180" : ""}`}
            />
          </Link>
          <Link
            href="/representantes"
            onClick={closeMenus}
            className={`text-sm transition-colors hover:text-[#d90820] ${
              pathname === "/representantes" ? "text-[#d90820]" : "text-white"
            }`}
          >
            Representantes
          </Link>

          <Link
            href="/contato"
            onClick={closeMenus}
            className={`text-sm transition-colors hover:text-[#d90820] ${
              pathname === "/contato" ? "text-[#d90820]" : "text-white"
            }`}
          >
            Contato
          </Link>

          <Link
            href="/pos-venda"
            onMouseEnter={() => {
              setOpenLine(null);
              setPreviewSlug(null);
            }}
            className={buttonGlass}
          >
            Pós-venda
          </Link>
          {/*
          <button
            type="button"
            aria-label="Pesquisar produtos"
            onClick={() => {
              setSearchOpen((open) => !open);
              setOpenLine(null);
              setPreviewSlug(null);
            }}
            className="p-2 text-white transition-colors hover:text-[#d90820]"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          */}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contato"
            onClick={closeMenus}
            className={`${buttonPrimary} hidden sm:inline-flex`}
          >
            Solicitar orçamento
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-sm p-2 text-white transition-colors hover:text-[#d90820] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d90820] lg:hidden"
          >
            {mobileOpen ? <X size={25} /> : <MenuIcon size={25} />}
          </button>
        </div>
      </div>

      {/* Navegação secundária: linhas de produtos */}
      <div className="hidden border-t border-white/10 bg-[#171c21] lg:block">
        <nav
          className="mx-auto flex h-14 max-w-[1480px] items-stretch justify-center px-10"
          aria-label="Linhas de produtos"
        >
          {productLines.map(([line, info]) => (
            <Link
              key={line}
              href={`/produtos/${line}`}
              onMouseEnter={() => {
                setOpenLine(line);
                setPreviewSlug(null);
                setSearchOpen(false);
              }}
              onFocus={() => {
                setOpenLine(line);
                setPreviewSlug(null);
              }}
              className={`relative flex min-w-0 items-center justify-center border-b-2 px-5 text-[10px] font-bold uppercase tracking-wide transition-colors xl:min-w-48 xl:px-8 xl:text-[11px] ${
                activeLine === line && openLine
                  ? "border-[#d90820] text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {info.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Busca */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#111519] px-5 py-5">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-3xl gap-2"
          >
            <label htmlFor="menu-search" className="sr-only">
              Pesquisar produtos
            </label>

            <input
              id="menu-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="O que você procura?"
              autoFocus
              className="min-w-0 flex-1 border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#d90820]"
            />

            <button type="submit" className={buttonPrimary}>
              Buscar <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Mega menu desktop */}
      <div
        className={`absolute left-[calc(50%-50vw)] top-full z-50 hidden w-screen overflow-hidden bg-[#f5f5f3] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 lg:block ${
          openLine
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {activeInfo && (
          <div className="grid w-full grid-cols-[38%_62%] items-stretch">
            <div className="flex flex-col px-8 py-10 xl:px-14 xl:py-12">
              <Link
                href={`/produtos/${activeLine}`}
                onClick={closeMenus}
                className="group flex items-center gap-2 text-lg font-bold text-[#171c21] transition-colors hover:text-[#000000] xl:text-xl"
              >
                Ver todos em {activeInfo.label}
                <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="mt-3 text-sm leading-6 text-[#60666c]">
                {activeInfo.description}
              </p>

              <div className="mt-6 grid max-h-[280px] grid-cols-2 content-start gap-x-4 gap-y-1 overflow-y-auto pr-2 xl:mt-8 xl:gap-x-8">
                {activeProducts.map((product) => (
                  <Link
                    key={product.slug}
                    href={productHref(product)}
                    onMouseEnter={() => setPreviewSlug(product.slug)}
                    onFocus={() => setPreviewSlug(product.slug)}
                    onClick={closeMenus}
                    className={`border-l-2 py-2.5 pl-2 text-sm font-medium transition-all hover:border-[#d90820] hover:pl-3 hover:text-[#000000] xl:text-base ${
                      previewProduct?.slug === product.slug
                        ? "border-[#d90820] text-[#171c21]"
                        : "border-transparent text-[#6a7075]"
                    }`}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>

            {previewProduct ? (
              <Link
                href={productHref(previewProduct)}
                onClick={closeMenus}
                className="group relative block min-h-[420px] w-full self-stretch overflow-hidden bg-[#333a40] leading-none"
              >
                <img
                  src={previewProduct.image}
                  alt={previewProduct.name}
                  className="absolute inset-0 block h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111519]/80 via-[#111519]/25 to-transparent" />

                <div className="absolute bottom-8 left-8 max-w-md text-white xl:bottom-12 xl:left-12">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e55062]">
                    {activeInfo.label}
                  </p>

                  <p className="mt-3 font-bold uppercase leading-none tracking-wide text-3xl xl:text-4xl">
                    {previewProduct.name}
                  </p>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                    {previewProduct.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    Conhecer produto
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="min-h-[420px] bg-[#e5e5e2]" />
            )}
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/65"
          />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-[#111519] px-6 pb-8 pt-24 shadow-2xl">
            <nav aria-label="Navegação mobile" className="flex flex-col">
              {navLinks.slice(0, 2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className="border-b border-white/10 py-5 font-bold uppercase text-white transition-colors hover:text-[#d90820]"
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                aria-expanded={mobileProductsOpen}
                onClick={() => setMobileProductsOpen((open) => !open)}
                className="flex items-center justify-between border-b border-white/10 py-5 text-left font-bold uppercase text-white transition-colors hover:text-[#d90820]"
              >
                Produtos
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    mobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileProductsOpen && (
                <div className="border-b border-white/10 py-3 pl-3">
                  {productLines.map(([line, info]) => {
                    const lineProducts = products.filter(
                      (product) => product.line === line,
                    );

                    return (
                      <div key={line} className="py-2">
                        <Link
                          href={`/produtos/${line}`}
                          onClick={closeMenus}
                          className="block py-2 text-sm font-bold text-[#d90820]"
                        >
                          {info.label}
                        </Link>

                        {lineProducts.map((product) => (
                          <Link
                            key={product.slug}
                            href={productHref(product)}
                            onClick={closeMenus}
                            className="block py-2 pl-3 text-sm text-white/60 transition-colors hover:text-white"
                          >
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              <Link
                href="/pos-venda"
                onClick={closeMenus}
                className="border-b border-white/10 py-5 font-bold uppercase text-white transition-colors"
              >
                Pós-venda
              </Link>
              <Link
                href="/representantes"
                onClick={closeMenus}
                className="border-b border-white/10 py-5 font-bold uppercase text-white transition-colors hover:text-[#d90820]"
              >
                Representantes
              </Link>

              <Link
                href="/contato"
                onClick={closeMenus}
                className="border-b border-white/10 py-5 font-bold uppercase text-white transition-colors hover:text-[#d90820]"
              >
                Contato
              </Link>

              <Link
                href="/contato"
                onClick={closeMenus}
                className={`${buttonPrimary} mt-8 w-full`}
              >
                Solicitar orçamento <ArrowRight size={16} />
              </Link>

              {/*
              <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
                <label htmlFor="mobile-menu-search" className="sr-only">
                  Pesquisar produtos
                </label>

                <input
                  id="mobile-menu-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Pesquisar produtos..."
                  className="min-w-0 flex-1 border border-white/20 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#d90820]"
                />

                <button
                  type="submit"
                  aria-label="Pesquisar"
                  className={buttonGlass}
                >
                  <Search size={17} />
                </button>
              </form>
              */}
            </nav>

            <p className="mt-auto pt-10 text-xs text-white/40">
              NEXT Implementos
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
