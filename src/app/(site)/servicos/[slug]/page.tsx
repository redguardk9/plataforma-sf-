import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, CONTACT } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: SERVICES.find((s) => s.slug === slug)?.title ?? "Serviço" };
}

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const ctaLabel =
    service.cta === "lista" ? "Entrar na lista de espera" : "Agendar esta sessão";

  return (
    <div className="mx-auto max-w-[820px] px-6 py-16">
      <Link href="/servicos" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
        Todos os serviços
      </Link>

      <span className="eyebrow">Serviço</span>
      <h1 className="mt-3.5 text-[clamp(28px,4.4vw,44px)] font-semibold">{service.title}</h1>
      <p className="mt-4 text-lg italic text-glow">&ldquo;{service.tagline}&rdquo;</p>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-4 my-9">
        <MetaBox label="Valor" value={service.price} note={service.priceNote} />
        <MetaBox label="Duração" value={service.duration} />
        <MetaBox label="Formato" value={service.format} />
      </div>

      <div className="flex flex-col gap-5 text-[17px] leading-relaxed">
        {service.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-ink" : "text-muted"}>{p}</p>
        ))}
      </div>

      {service.bullets && (
        <div className="card p-7 mt-9">
          <h2 className="text-lg font-semibold mb-4">{service.bulletsTitle}</h2>
          <ul className="flex flex-col gap-3">
            {service.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-glow shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.quote && (
        <blockquote className="text-[clamp(20px,3vw,28px)] font-semibold text-center my-12 text-ink/90 leading-snug">
          &ldquo;{service.quote}&rdquo;
        </blockquote>
      )}

      {/* CTA */}
      <div className="card p-8 text-center mt-6">
        <h2 className="text-xl font-semibold">Pronto para começar?</h2>
        <p className="text-muted mt-2">Envie mensagem por WhatsApp ou e-mail e receberá as instruções para agendamento.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">{ctaLabel}</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">WhatsApp</a>
        </div>
        <p className="font-mono text-[12px] text-faint mt-5">{CONTACT.phone} · {CONTACT.email}</p>
      </div>
    </div>
  );
}

function MetaBox({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</div>
      <div className="text-lg font-semibold mt-1 leading-tight">{value}</div>
      {note && <div className="text-[11px] text-faint mt-0.5">{note}</div>}
    </div>
  );
}
