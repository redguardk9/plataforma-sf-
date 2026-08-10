import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Entrar" };

// Converte um destino (path ou URL absoluto) num caminho interno seguro.
function safePath(raw?: string): string {
  if (!raw) return "/conta";
  try {
    const u = new URL(raw, "http://local");
    const path = u.pathname + u.search;
    return path.startsWith("/") ? path : "/conta";
  } catch {
    return "/conta";
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; callbackUrl?: string; registered?: string }>;
}) {
  const { next, callbackUrl, registered } = await searchParams;
  const dest = safePath(next ?? callbackUrl);

  return (
    <AuthShell
      title="Entrar"
      subtitle="Aceda à sua área pessoal, formações e conteúdos."
      footer={<>Ainda não tem conta? <Link href="/registar" className="text-glow font-medium">Criar conta</Link></>}
    >
      {registered && (
        <p className="text-sm text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2 mb-4">
          Conta criada com sucesso. Já pode entrar.
        </p>
      )}
      <LoginForm next={dest} />
    </AuthShell>
  );
}
