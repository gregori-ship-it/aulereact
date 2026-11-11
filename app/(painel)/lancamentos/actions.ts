"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterUsuarioIdSessao } from "@/lib/auth/sessao";

export type EstadoFormulario = { erro: string } | null;

type CamposValidos = {
  descricao: string;
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
  contaId: string;
  categoriaId: string;
};

function validarCampos(formData: FormData): CamposValidos | { erro: string } {
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valor = Number(formData.get("valor"));
  const tipo = String(formData.get("tipo") ?? "");
  const data = String(formData.get("data") ?? "");
  const contaId = String(formData.get("conta_id") ?? "");
  const categoriaId = String(formData.get("categoria_id") ?? "");

  if (!descricao) return { erro: "Informe uma descricao." };
  if (!Number.isFinite(valor) || valor <= 0) {
    return { erro: "O valor precisa ser maior que zero." };
  }
  if (tipo !== "entrada" && tipo !== "saida") {
    return { erro: "Escolha o tipo entrada ou saida." };
  }
  if (!data) return { erro: "Informe a data." };
  if (!contaId) return { erro: "Escolha uma conta." };
  if (!categoriaId) return { erro: "Escolha uma categoria." };

  return { descricao, valor, tipo, data, contaId, categoriaId };
}

export async function criarLancamento(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const campos = validarCampos(formData);
  if ("erro" in campos) return campos;

  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) return { erro: "Sessao expirada. Faca login novamente." };

  const supabase = criarClienteServidor();
  const { error } = await supabase.from("lancamentos").insert({
    user_id: usuarioId,
    descricao: campos.descricao,
    valor: campos.valor,
    tipo: campos.tipo,
    data_lancamento: campos.data,
    conta_id: campos.contaId,
    categoria_id: campos.categoriaId,
  });

  if (error) return { erro: "Nao foi possivel salvar o lancamento. Tente novamente." };

  revalidatePath("/lancamentos");
  redirect("/lancamentos");
}

export async function atualizarLancamento(
  id: string,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const campos = validarCampos(formData);
  if ("erro" in campos) return campos;

  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) return { erro: "Sessao expirada. Faca login novamente." };

  const supabase = criarClienteServidor();
  const { error } = await supabase
    .from("lancamentos")
    .update({
      descricao: campos.descricao,
      valor: campos.valor,
      tipo: campos.tipo,
      data_lancamento: campos.data,
      conta_id: campos.contaId,
      categoria_id: campos.categoriaId,
    })
    .eq("id", id)
    .eq("user_id", usuarioId);

  if (error) return { erro: "Nao foi possivel atualizar o lancamento. Tente novamente." };

  revalidatePath("/lancamentos");
  redirect("/lancamentos");
}

export async function excluirLancamento(id: string) {
  const usuarioId = await obterUsuarioIdSessao();
  if (!usuarioId) redirect("/login");

  const supabase = criarClienteServidor();
  await supabase.from("lancamentos").delete().eq("id", id).eq("user_id", usuarioId);

  revalidatePath("/lancamentos");
  redirect("/lancamentos");
}
