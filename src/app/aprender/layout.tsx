import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AprenderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        <div className="mx-auto max-w-[1240px] px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/conta" className="btn btn-ghost text-sm">A minha área</Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
