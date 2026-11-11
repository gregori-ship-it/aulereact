import bcrypt from "bcryptjs";

const CUSTO = 10;

export function hashSenha(senha: string) {
  return bcrypt.hash(senha, CUSTO);
}

export function verificarSenha(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}
