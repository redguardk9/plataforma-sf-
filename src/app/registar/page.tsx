import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="Crie a sua conta para aceder às formações e à sua área pessoal."
      footer={<>Já tem conta? <Link href="/login" className="text-glow font-medium">Entrar</Link></>}
    >
      <RegisterForm />
    </AuthShell>
  );
}
