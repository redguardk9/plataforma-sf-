import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactCTA } from "@/components/ContactCTA";
import { SERVICES, FAQ } from "@/lib/site";

export const metadata: Metadata = { title: "Serviços" };

export default function ServicosPage() {
  return (
    <>
      <section className="mx-auto max-w-[1180px] px-6 pt-16 lg:pt-20 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        <div>
          <span className="eyebrow">Serviços</span>
          <h1 className="mt-6 text-[clamp(30px,5vw,52px)] max-w-[16ch]">
            Acompanhamento clínico, com profundidade e ética.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-[46ch]">
            Três modalidades, para momentos diferentes do seu percurso. Escolha o que precisa e agende diretamente.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-border shadow-xl">
          <Image src="/mood-forest.jpg" alt="" width={1600} height={900} className="w-full h-[280px] lg:h-[340px] object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/servicos/${s.slug}`} className="card card-hover p-7 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold">{s.title}</h2>
              </div>
              <p className="text-[13px] text-glow font-mono mt-2">{s.tagline}</p>
              <p className="text-sm text-muted mt-4 flex-1">{s.short}</p>
              <div className="flex items-center justify-between border-t border-border pt-4 mt-5">
                <span className="text-lg font-semibold">{s.price}</span>
                <span className="font-mono text-[11px] text-faint uppercase tracking-wider">{s.duration}</span>
              </div>
              <span className="font-mono text-[11px] text-glow uppercase tracking-wider mt-4">Ver detalhes →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[820px] px-6 py-14">
        <span className="eyebrow">Perguntas frequentes</span>
        <h2 className="mt-3.5 text-[clamp(24px,3.4vw,34px)] font-semibold mb-8">Antes de marcar</h2>
        <div className="flex flex-col gap-2.5">
          {FAQ.map(([q, a], i) => (
            <details key={i} className="card overflow-hidden group" open={i === 0}>
              <summary className="px-5 py-4 cursor-pointer flex items-center gap-4 list-none [&::-webkit-details-marker]:hidden font-semibold">
                <span className="flex-1">{q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted transition-transform group-open:rotate-45"><path d="M12 5v14M5 12h14" /></svg>
              </summary>
              <p className="px-5 pb-5 text-muted text-[15px]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-14">
        <ContactCTA />
      </section>
    </>
  );
}
