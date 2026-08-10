"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";

export type NavItem = { href: string; label: string; icon: keyof typeof ICONS };

const ICONS = {
  home: <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
  book: <path d="M4 5h16v11H4zM4 16l4 4M20 16l-4 4M9 20h6" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5" /><path d="M16 5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-4.5-5-5" /></>,
  chat: <path d="M21 11.5a8.4 8.4 0 0 1-9 8 8.4 8.4 0 0 1-4-1L3 20l1.5-4a8.4 8.4 0 1 1 16.5-4.5z" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" /></>,
  doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h5" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>,
  shield: <><path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z" /></>,
} as const;

export function DashboardShell({
  area,
  items,
  user,
  logout,
  children,
}: {
  area: string;
  items: NavItem[];
  user: { name?: string | null; role: string };
  logout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href.endsWith("/conta") || href.endsWith("/admin")
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-[264px] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface lg:min-h-screen flex flex-col">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={30} />
            <div className="leading-none">
              <span className="block text-sm font-semibold">Sérgio Fonseca</span>
              <span className="block font-mono text-[9px] tracking-[0.18em] uppercase text-faint mt-1">{area}</span>
            </div>
          </Link>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive(it.href) ? "bg-brand-soft text-glow" : "text-muted hover:text-ink hover:bg-surface-2"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                {ICONS[it.icon]}
              </svg>
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border hidden lg:block">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="w-9 h-9 rounded-full grid place-items-center text-sm font-semibold text-white bg-gradient-to-br from-brand to-brand-700">
              {(user.name ?? "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-[11px] text-faint">{user.role === "ADMIN" ? "Administrador" : "Formando"}</p>
            </div>
          </div>
          <form action={logout}>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-ink hover:bg-surface-2 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 12H3M9 6l-6 6 6 6M14 4h6v16h-6" /></svg>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
