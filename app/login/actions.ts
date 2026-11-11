"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { verificarSenha } from "@/lib/auth/senha";
import { criarSessao } from "@/lib/auth/sessao";

export type EstadoLogin = { erro: string } | null;

export async function entrar(
  _estadoAnterior: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const supabase = criarClienteServidor();
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, senha_hash")
    .eq("email", email)
    .maybeSingle();

  if (!usuario || !(await verificarSenha(senha, usuario.senha_hash))) {
    return { erro: "E-mail ou senha invalidos." };
  }

  await criarSessao(usuario.id);
  redirect("/lancamentos");
}
