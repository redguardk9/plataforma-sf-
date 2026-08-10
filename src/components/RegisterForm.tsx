"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/registar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setPending(false);
    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível criar a conta.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="name">Nome</label>
        <input id="name" name="name" required autoComplete="name" placeholder="O seu nome" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="o.seu@email.pt" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Palavra-passe</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="Mínimo 6 caracteres" className="input" />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full mt-1 disabled:opacity-60">
        {pending ? "A criar conta..." : "Criar conta"}
      </button>
    </form>
  );
}
