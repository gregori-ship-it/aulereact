import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <h1>Pagina nao encontrada</h1>
      <p>O lancamento ou a pagina que voce procurou nao existe.</p>
      <p>
        <Link href="/">Voltar para o inicio</Link>
      </p>
    </main>
  );
}
