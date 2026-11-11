"use client";

import { excluirLancamento } from "@/app/(painel)/lancamentos/actions";

export default function BotaoExcluir({ id }: { id: string }) {
  return (
    <form
      action={excluirLancamento.bind(null, id)}
      onSubmit={(evento) => {
        if (!window.confirm("Excluir este lancamento?")) {
          evento.preventDefault();
        }
      }}
    >
      <button type="submit" className="botao botao--perigo">
        Excluir
      </button>
    </form>
  );
}
