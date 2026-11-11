import { criarClienteServidor } from "@/lib/supabase/server";

export async function buscarContasECategorias(usuarioId: string) {
  const supabase = criarClienteServidor();

  const [{ data: contas }, { data: categorias }] = await Promise.all([
    supabase.from("contas").select("id, nome").eq("user_id", usuarioId).order("nome"),
    supabase.from("categorias").select("id, nome, tipo").eq("user_id", usuarioId).order("nome"),
  ]);

  return { contas: contas ?? [], categorias: categorias ?? [] };
}
