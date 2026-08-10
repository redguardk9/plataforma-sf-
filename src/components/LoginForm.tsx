"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/login/actions";

export function LoginForm({ next }: { next?: string }) {
  const [error, action, pending] = useActionState(authenticate, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? "/conta"} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="o.seu@email.pt" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Palavra-passe</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className="input" />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full mt-1 disabled:opacity-60">
        {pending ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
