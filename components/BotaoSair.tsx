import { sair } from "@/app/(painel)/actions";

export default function BotaoSair() {
  return (
    <form action={sair}>
      <button type="submit" className="painel__sair">
        Sair
      </button>
    </form>
  );
}
