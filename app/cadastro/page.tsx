import Link from "next/link";
import CadastroForm from "@/components/CadastroForm";

export default function CadastroPage() {
  return (
    <main className="container">
      <h1>Criar conta na Caderneta da Claudia</h1>
      <CadastroForm />
      <p style={{ marginTop: "1rem" }}>
        Ja tem conta? <Link href="/login">Entrar</Link>
      </p>
    </main>
  );
}
