import Link from "next/link";
import { redirect } from "next/navigation";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";
import BotaoSair from "@/components/BotaoSair";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuarioId = await obterUsuarioIdSessao();

  if (!usuarioId) {
    redirect("/login");
  }

  return (
    <>
      <nav className="painel__nav">
        <Link href="/lancamentos">Lancamentos</Link>
        <Link href="/dashboard">Dashboard</Link>
        <BotaoSair />
      </nav>
      <main className="container">{children}</main>
    </>
  );
}
