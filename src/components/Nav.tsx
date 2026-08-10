"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { CONTACT } from "@/lib/site";

type NavUser = { name?: string | null; role: string; supervisionAccess: boolean } | null;

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/formacoes", label: "Formações" },
  { href: "/blog", label: "Blog" },
];

export function Nav({ user, logout }: { user: NavUser; logout: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1180px] px-6 h-[68px] flex items-center gap-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-0.5 ml-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
                isActive(l.href)
                  ? "text-ink bg-surface-2"
                  : "text-muted hover:text-ink hover:bg-surface"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 ml-3">
          <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent whitespace-nowrap">Marcar</a>
          {user ? (
            <UserArea user={user} logout={logout} />
          ) : (
            <Link href="/login" className="btn btn-ghost">Entrar</Link>
          )}
        </div>

        {/* Mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden ml-auto w-10 h-10 grid place-items-center rounded-lg border border-border text-muted"
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm ${
                isActive(l.href) ? "text-ink bg-surface-2" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn btn-accent w-full mb-2">Marcar consulta</a>
          {user ? (
            <div className="flex flex-col gap-2">
              <Link href="/conta" onClick={() => setOpen(false)} className="btn btn-ghost">A minha área</Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setOpen(false)} className="btn btn-ghost">Administração</Link>
              )}
              <form action={logout}><button className="btn btn-ghost w-full">Sair</button></form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">Entrar</Link>
              <Link href="/registar" onClick={() => setOpen(false)} className="btn btn-primary">Criar conta</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function UserArea({ user, logout }: { user: NonNullable<NavUser>; logout: () => Promise<void> }) {
  const [menu, setMenu] = useState(false);
  const initial = (user.name ?? "?").trim().charAt(0).toUpperCase();
  return (
    <div className="relative">
      <button
        onClick={() => setMenu((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:border-border-strong transition-colors"
      >
        <span className="w-8 h-8 rounded-full grid place-items-center text-sm font-semibold text-white bg-gradient-to-br from-brand to-brand-700">
          {initial}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {menu && (
        <div className="absolute right-0 mt-2 w-56 card p-2 shadow-2xl z-50" onMouseLeave={() => setMenu(false)}>
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-xs text-faint">{user.role === "ADMIN" ? "Administrador" : "Formando"}</p>
          </div>
          <Link href="/conta" className="block px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-surface-2">A minha área</Link>
          {user.supervisionAccess && (
            <Link href="/supervisao" className="block px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-surface-2">Supervisão</Link>
          )}
          {user.role === "ADMIN" && (
            <Link href="/admin" className="block px-3 py-2 rounded-lg text-sm text-glow hover:bg-surface-2">Painel de administração</Link>
          )}
          <form action={logout}>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-surface-2">Sair</button>
          </form>
        </div>
      )}
    </div>
  );
}
