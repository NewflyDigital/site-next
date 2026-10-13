import Link from "next/link";

export default function Error404() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h1>404</h1>

      <h2>Página não encontrada</h2>

      <p>O conteúdo que você procura não existe ou foi removido.</p>

      <Link href="/">Voltar para a página inicial</Link>
    </main>
  );
}
