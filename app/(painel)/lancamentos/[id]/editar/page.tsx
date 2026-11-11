import { notFound, redirect } from "next/navigation";
import LancamentoForm from "@/components/LancamentoForm";
import { buscarContasECategorias } from "@/lib/contas-categorias";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";
import { atualizarLancamento } from "../../actions";

export default async function EditarLancamentoPage({
  params,
}: {
  params: { id: string };
}) {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const supabase = criarClienteServidor();
  const { data: lancamento, error } = await supabase
    .from("lancamentos")
    .select("id, descricao, valor, tipo, data_lancamento, conta_id, categoria_id")
    .eq("id", params.id)
    .eq("user_id", usuarioId)
    .single();

  if (error || !lancamento) {
    notFound();
  }

  const { contas, categorias } = await buscarContasECategorias(usuarioId);

  return (
    <section>
      <h1>Editar lancamento</h1>
      <LancamentoForm
        lancamento={lancamento}
        contas={contas}
        categorias={categorias}
        action={atualizarLancamento.bind(null, lancamento.id)}
      />
    </section>
  );
}
