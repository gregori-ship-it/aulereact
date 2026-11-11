"use client";

import { useFormState } from "react-dom";
import BotaoEnviar from "@/components/BotaoEnviar";
import { entrar, type EstadoLogin } from "@/app/login/actions";

const estadoInicial: EstadoLogin = null;

export default function LoginForm() {
  const [estado, formAction] = useFormState(entrar, estadoInicial);

  return (
    <form action={formAction} className="formulario">
      <label>
        E-mail
        <input type="email" name="email" required />
      </label>

      <label>
        Senha
        <input type="password" name="senha" required />
      </label>

      {estado?.erro && <p className="formulario__erro">{estado.erro}</p>}

      <BotaoEnviar textoPadrao="Entrar" textoEnviando="Entrando..." />
    </form>
  );
}
