import { cookies } from "next/headers";

const NOME_COOKIE = "sessao";
const UM_MES_EM_SEGUNDOS = 60 * 60 * 24 * 30;

async function obterChave() {
  const segredo = process.env.SESSAO_SECRET;
  if (!segredo) throw new Error("SESSAO_SECRET nao configurado em .env.local.");

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function assinar(usuarioId: string) {
  const chave = await obterChave();
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    new TextEncoder().encode(usuarioId)
  );
  return Buffer.from(assinatura).toString("base64url");
}

async function assinaturaValida(usuarioId: string, assinaturaBase64: string) {
  const chave = await obterChave();
  return crypto.subtle.verify(
    "HMAC",
    chave,
    Buffer.from(assinaturaBase64, "base64url"),
    new TextEncoder().encode(usuarioId)
  );
}

export async function criarSessao(usuarioId: string) {
  const assinatura = await assinar(usuarioId);
  cookies().set(NOME_COOKIE, `${usuarioId}.${assinatura}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UM_MES_EM_SEGUNDOS,
  });
}

export function limparSessao() {
  cookies().delete(NOME_COOKIE);
}

export async function obterUsuarioIdSessao(): Promise<string | null> {
  const valor = cookies().get(NOME_COOKIE)?.value;
  if (!valor) return null;

  const separador = valor.lastIndexOf(".");
  if (separador === -1) return null;

  const usuarioId = valor.slice(0, separador);
  const assinatura = valor.slice(separador + 1);

  const valido = await assinaturaValida(usuarioId, assinatura);
  return valido ? usuarioId : null;
}
