import Link from "next/link";
import { LogoMark } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="aurora" />
      <div className="relative z-10 w-full max-w-[420px]">
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <LogoMark size={38} />
          <span className="leading-none">
            <span className="block font-semibold text-ink">Sérgio Fonseca</span>
            <span className="block font-mono text-[9px] tracking-[0.24em] uppercase text-faint mt-1">Psicólogo Especialista</span>
          </span>
        </Link>
        <div className="card p-8">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted text-sm mt-1.5 mb-7">{subtitle}</p>
          {children}
        </div>
        <p className="text-center text-sm text-muted mt-6">{footer}</p>
      </div>
    </div>
  );
}
