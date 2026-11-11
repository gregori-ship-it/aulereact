"use client";

import { useFormStatus } from "react-dom";

type BotaoEnviarProps = {
  textoPadrao?: string;
  textoEnviando?: string;
};

export default function BotaoEnviar({
  textoPadrao = "Salvar",
  textoEnviando = "Salvando...",
}: BotaoEnviarProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="botao" disabled={pending}>
      {pending ? textoEnviando : textoPadrao}
    </button>
  );
}
