import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function DashboardPage() {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const supabase = criarClienteServidor();
  const { data: lancamentos } = await supabase
    .from("lancamentos")
    .select("valor, tipo")
    .eq("user_id", usuarioId);

  const totalEntradas = (lancamentos ?? [])
    .filter((lancamento) => lancamento.tipo === "entrada")
    .reduce((soma, lancamento) => soma + lancamento.valor, 0);

  const totalSaidas = (lancamentos ?? [])
    .filter((lancamento) => lancamento.tipo === "saida")
    .reduce((soma, lancamento) => soma + lancamento.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="resumo">
        <div className="resumo__item">
          <p>Entradas</p>
          <strong>{formatadorMoeda.format(totalEntradas)}</strong>
        </div>
        <div className="resumo__item">
          <p>Saidas</p>
          <strong>{formatadorMoeda.format(totalSaidas)}</strong>
        </div>
        <div className="resumo__item">
          <p>Saldo</p>
          <strong>{formatadorMoeda.format(saldo)}</strong>
        </div>
      </div>
    </section>
  );
}
