"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setShow(true);
    } catch {
      /* localStorage indisponível */
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem("cookie-consent", "1");
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-[60] sm:left-auto sm:right-6 sm:max-w-[400px]">
      <div className="card p-5 shadow-2xl">
        <p className="text-sm text-muted leading-relaxed">
          Este site usa apenas cookies essenciais para o funcionamento da sua conta e sessão. Ao
          continuar, aceita a nossa{" "}
          <Link href="/privacidade" className="text-brand font-semibold">política de privacidade</Link>.
        </p>
        <div className="flex gap-2 mt-4">
          <button onClick={accept} className="btn btn-primary text-sm flex-1">Aceitar</button>
          <Link href="/privacidade" className="btn btn-ghost text-sm">Saber mais</Link>
        </div>
      </div>
    </div>
  );
}
