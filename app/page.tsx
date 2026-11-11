import Link from "next/link";

export default function ApresentacaoPage() {
  return (
    <main className="container">
      <h1>Caderneta da Claudia</h1>
      <p>
        Um app simples para controlar suas entradas e saidas do dia a dia, sem
        complicacao.
      </p>
      <p>
        <Link href="/lancamentos" className="botao">
          Ver lancamentos
        </Link>
      </p>
      <p style={{ marginTop: "0.75rem" }}>
        <Link href="/dashboard">Ir para o dashboard</Link>
      </p>
    </main>
  );
}
