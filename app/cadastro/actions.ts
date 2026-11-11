"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { hashSenha } from "@/lib/auth/senha";
import { criarSessao } from "@/lib/auth/sessao";

export type EstadoCadastro = { erro: string } | null;

export async function cadastrar(
  _estadoAnterior: EstadoCadastro,
  formData: FormData
): Promise<EstadoCadastro> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (!nome || !email || !senha) {
    return { erro: "Preencha nome, e-mail e senha." };
  }

  if (senha.length < 6) {
    return { erro: "A senha deve ter pelo menos 6 caracteres." };
  }

  if (senha !== confirmarSenha) {
    return { erro: "As senhas nao coincidem." };
  }

  const supabase = criarClienteServidor();

  const { data: existente } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existente) {
    return { erro: "Ja existe uma conta com esse e-mail." };
  }

  const senhaHash = await hashSenha(senha);

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .insert({ nome, email, senha_hash: senhaHash })
    .select("id")
    .single();

  if (error || !usuario) {
    return { erro: "Nao foi possivel criar a conta. Tente novamente." };
  }

  await criarSessao(usuario.id);
  redirect("/lancamentos");
}
