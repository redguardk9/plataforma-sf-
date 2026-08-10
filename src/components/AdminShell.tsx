"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "./Logo";

export type AdminNavItem = { href: string; label: string; icon: keyof typeof ICONS };

const ICONS = {
  chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>,
  book: <path d="M4 5h16v11H4zM4 16l4 4M20 16l-4 4M9 20h6" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5" /><path d="M16 5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-4.5-5-5" /></>,
  doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h5" /></>,
} as const;

export function AdminShell({
  items,
  user,
  logout,
  children,
}: {
  items: AdminNavItem[];
  user: { name?: string | null };
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-0.5 px-3">
      {items.map((it) => {
        const active = isActive(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            style={{
              color: active ? "#fff" : "var(--admin-rail-text)",
              background: active ? "rgba(29,78,216,.85)" : "transparent",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              {ICONS[it.icon]}
            </svg>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );

  const railInner = (
    <>
      <div className="px-5 py-4 flex items-center gap-2.5 border-b" style={{ borderColor: "var(--admin-rail-border)" }}>
        <LogoMark size={28} />
        <div className="leading-none">
          <span className="block text-sm font-semibold text-white">Sérgio Fonseca</span>
          <span className="block text-[9px] tracking-[0.18em] uppercase mt-1" style={{ color: "var(--admin-rail-text)" }}>Administração</span>
        </div>
      </div>
      <div className="py-4 flex-1 overflow-y-auto">
        <p className="px-6 mb-2 text-[10px] uppercase tracking-wider font-bold" style={{ color: "#4B5768" }}>Gestão</p>
        {nav}
      </div>
      <div className="p-3 border-t" style={{ borderColor: "var(--admin-rail-border)" }}>
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1" style={{ color: "var(--admin-rail-text)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg>
          Ver site público
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-semibold text-white bg-gradient-to-br from-brand to-brand-700">
            {(user.name ?? "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate">{user.name}</p>
            <p className="text-[11px]" style={{ color: "var(--admin-rail-text)" }}>Administrador</p>
          </div>
          <form action={logout}>
            <button title="Sair" className="text-slate-400 hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 12H3M9 6l-6 6 6 6M14 4h6v16h-6" /></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="admin min-h-screen lg:flex">
      {/* Rail desktop */}
      <aside className="hidden lg:flex flex-col w-[248px] shrink-0 sticky top-0 h-screen" style={{ background: "var(--admin-rail)" }}>
        {railInner}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-[248px] z-50 flex flex-col" style={{ background: "var(--admin-rail)" }}>
            {railInner}
          </aside>
        </>
      )}

      {/* Área de trabalho */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 bg-surface border-b border-border">
          <button onClick={() => setOpen(true)} className="lg:hidden w-9 h-9 grid place-items-center rounded-lg border border-border text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <span className="text-sm font-semibold text-muted">Painel de administração</span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden sm:inline-flex text-sm text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-border">Ver site</Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
