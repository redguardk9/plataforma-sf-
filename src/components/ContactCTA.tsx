import { CONTACT } from "@/lib/site";

export function ContactCTA({
  title = "Tem alguma dúvida?",
  subtitle = "Se precisar de falar, não hesite em contactar. Respondo sempre que possível.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="card p-10 sm:p-14 text-center relative overflow-hidden">
      <div className="aurora opacity-50" />
      <div className="relative">
        <h2 className="text-[clamp(24px,3.4vw,34px)] font-semibold">{title}</h2>
        <p className="text-muted mt-3 max-w-[46ch] mx-auto">{subtitle}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
            Marcar consulta
          </a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.7-2.7-1.1-4.4-3.8-4.5-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .9 2.1.1.1.1.3 0 .5s-.2.4-.4.6l-.3.3c-.1.2-.3.4-.1.7.2.4.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1s1.7.8 2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.1z"/></svg>
            WhatsApp
          </a>
          <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost btn-lg">Email</a>
        </div>
        <p className="font-mono text-[12px] text-faint mt-6">{CONTACT.phone} · {CONTACT.email}</p>
      </div>
    </div>
  );
}
