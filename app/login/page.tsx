import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="container">
      <h1>Entrar na Caderneta da Claudia</h1>
      <LoginForm />
      <p style={{ marginTop: "1rem" }}>
        Ainda nao tem conta? <Link href="/cadastro">Criar conta</Link>
      </p>
    </main>
  );
}
