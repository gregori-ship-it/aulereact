"use client";

import { useFormState } from "react-dom";
import BotaoEnviar from "@/components/BotaoEnviar";
import { cadastrar, type EstadoCadastro } from "@/app/cadastro/actions";

const estadoInicial: EstadoCadastro = null;

export default function CadastroForm() {
  const [estado, formAction] = useFormState(cadastrar, estadoInicial);

  return (
    <form action={formAction} className="formulario">
      <label>
        Nome
        <input type="text" name="nome" required />
      </label>

      <label>
        E-mail
        <input type="email" name="email" required />
      </label>

      <label>
        Senha
        <input type="password" name="senha" minLength={6} required />
      </label>

      <label>
        Confirmar senha
        <input type="password" name="confirmarSenha" minLength={6} required />
      </label>

      {estado?.erro && <p className="formulario__erro">{estado.erro}</p>}

      <BotaoEnviar textoPadrao="Criar conta" textoEnviando="Criando..." />
    </form>
  );
}
