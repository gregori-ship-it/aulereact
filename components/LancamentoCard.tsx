import Link from "next/link";

export type Lancamento = {
  id: string;
  descricao: string | null;
  valor: number;
  tipo: "entrada" | "saida";
  data_lancamento: string;
};

type LancamentoCardProps = {
  lancamento: Lancamento;
};

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function LancamentoCard({ lancamento }: LancamentoCardProps) {
  const ehEntrada = lancamento.tipo === "entrada";

  return (
    <Link href={`/lancamentos/${lancamento.id}`} className="lancamento-card">
      <span className="lancamento-card__descricao">{lancamento.descricao}</span>
      <span className="lancamento-card__data">{lancamento.data_lancamento}</span>
      <span
        className={
          ehEntrada ? "lancamento-card__valor valor--entrada" : "lancamento-card__valor valor--saida"
        }
      >
        {ehEntrada ? "+" : "-"} {formatadorMoeda.format(lancamento.valor)}
      </span>
    </Link>
  );
}
