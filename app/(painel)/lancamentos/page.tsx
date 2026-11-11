import Link from "next/link";
import { redirect } from "next/navigation";
import LancamentoCard from "@/components/LancamentoCard";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";

export default async function LancamentosPage() {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const supabase = criarClienteServidor();
  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("id, descricao, valor, tipo, data_lancamento")
    .eq("user_id", usuarioId)
    .order("data_lancamento", { ascending: false });

  return (
    <section>
      <div className="lancamentos__cabecalho">
        <h1>Lancamentos</h1>
        <Link href="/lancamentos/novo" className="botao">
          Novo lancamento
        </Link>
      </div>
      {(lancamentos ?? []).map((lancamento) => (
        <LancamentoCard key={lancamento.id} lancamento={lancamento} />
      ))}
    </section>
  );
}
