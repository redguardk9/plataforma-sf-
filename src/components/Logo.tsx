import Link from "next/link";
import Image from "next/image";

// Proporção real do símbolo recortado (477x621).
const RATIO = 477 / 621;

/** Símbolo real do logótipo (cabeça / cérebro / lâmpada), fundo transparente. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Sérgio Fonseca"
      width={Math.round(size * RATIO)}
      height={size}
      priority
      className="object-contain"
    />
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <LogoMark size={34} />
      <span className="leading-none">
        <span className="block text-serif font-medium text-[18px] tracking-tight text-ink">Sérgio Fonseca</span>
        <span className="block font-mono text-[9px] tracking-[0.24em] uppercase text-faint mt-1">
          Psicólogo Especialista
        </span>
      </span>
    </Link>
  );
}
