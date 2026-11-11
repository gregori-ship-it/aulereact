"use client";

import { useFormState } from "react-dom";
import BotaoEnviar from "@/components/BotaoEnviar";
import type { EstadoFormulario } from "@/app/(painel)/lancamentos/actions";

type Conta = { id: string; nome: string };
type Categoria = { id: string; nome: string; tipo: "entrada" | "saida" };

type LancamentoExistente = {
  descricao: string | null;
  valor: number;
  tipo: "entrada" | "saida";
  data_lancamento: string;
  conta_id: string;
  categoria_id: string;
};

type LancamentoFormProps = {
  contas: Conta[];
  categorias: Categoria[];
  lancamento?: LancamentoExistente;
  action: (
    estadoAnterior: EstadoFormulario,
    formData: FormData
  ) => Promise<EstadoFormulario>;
};

const estadoInicial: EstadoFormulario = null;

export default function LancamentoForm({
  contas,
  categorias,
  lancamento,
  action,
}: LancamentoFormProps) {
  const [estado, formAction] = useFormState(action, estadoInicial);

  return (
    <form action={formAction} className="formulario">
      <label>
        Descricao
        <input
          type="text"
          name="descricao"
          defaultValue={lancamento?.descricao ?? ""}
          required
        />
      </label>

      <label>
        Valor
        <input
          type="number"
          name="valor"
          step="0.01"
          min="0.01"
          defaultValue={lancamento?.valor}
          required
        />
      </label>

      <label>
        Tipo
        <select name="tipo" defaultValue={lancamento?.tipo ?? "saida"} required>
          <option value="entrada">Entrada</option>
          <option value="saida">Saida</option>
        </select>
      </label>

      <label>
        Data
        <input
          type="date"
          name="data"
          defaultValue={lancamento?.data_lancamento ?? ""}
          required
        />
      </label>

      <label>
        Conta
        <select name="conta_id" defaultValue={lancamento?.conta_id ?? ""} required>
          <option value="" disabled>
            Escolha uma conta
          </option>
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.nome}
            </option>
          ))}
        </select>
      </label>

      <label>
        Categoria
        <select
          name="categoria_id"
          defaultValue={lancamento?.categoria_id ?? ""}
          required
        >
          <option value="" disabled>
            Escolha uma categoria
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </label>

      {estado?.erro && <p className="formulario__erro">{estado.erro}</p>}

      <BotaoEnviar />
    </form>
  );
}
