import { redirect } from "next/navigation";
import LancamentoForm from "@/components/LancamentoForm";
import { buscarContasECategorias } from "@/lib/contas-categorias";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";
import { criarLancamento } from "../actions";

export default async function NovoLancamentoPage() {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const { contas, categorias } = await buscarContasECategorias(usuarioId);

  if (contas.length === 0 || categorias.length === 0) {
    return (
      <section>
        <h1>Novo lancamento</h1>
        <p>Cadastre pelo menos uma conta e uma categoria antes de lancar.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Novo lancamento</h1>
      <LancamentoForm contas={contas} categorias={categorias} action={criarLancamento} />
    </section>
  );
}
