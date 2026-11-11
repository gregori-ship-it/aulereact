import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";
import BotaoExcluir from "@/components/BotaoExcluir";

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function LancamentoPage({
  params,
}: {
  params: { id: string };
}) {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const supabase = criarClienteServidor();
  const { data: lancamento, error } = await supabase
    .from("lancamentos")
    .select("id, descricao, valor, tipo, data_lancamento")
    .eq("id", params.id)
    .eq("user_id", usuarioId)
    .single();

  if (error || !lancamento) {
    notFound();
  }

  return (
    <section>
      <h1>{lancamento.descricao}</h1>
      <p>Data: {lancamento.data_lancamento}</p>
      <p>Tipo: {lancamento.tipo === "entrada" ? "Entrada" : "Saida"}</p>
      <p>Valor: {formatadorMoeda.format(lancamento.valor)}</p>
      <div className="lancamento__acoes">
        <Link href={`/lancamentos/${lancamento.id}/editar`} className="botao">
          Editar
        </Link>
        <BotaoExcluir id={lancamento.id} />
      </div>
      <p>
        <Link href="/lancamentos">Voltar para a lista</Link>
      </p>
    </section>
  );
}
