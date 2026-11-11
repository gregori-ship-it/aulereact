"use server";

import { redirect } from "next/navigation";
import { limparSessao } from "@/lib/auth/sessao";

export async function sair() {
  limparSessao();
  redirect("/login");
}
