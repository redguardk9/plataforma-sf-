"use client";

import { useActionState } from "react";
import { changePassword, type PwState } from "@/app/conta/perfil/actions";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<PwState, FormData>(changePassword, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="current">Palavra-passe atual</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="next">Nova palavra-passe</label>
          <input id="next" name="next" type="password" required minLength={6} autoComplete="new-password" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirmar</label>
          <input id="confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password" className="input" />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">{state.ok}</p>
      )}

      <div>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "A guardar..." : "Alterar palavra-passe"}
        </button>
      </div>
    </form>
  );
}
