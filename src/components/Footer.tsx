import Link from "next/link";
import { LogoMark } from "./Logo";
import { CONTACT } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="mx-auto max-w-[1180px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={34} />
              <div className="leading-none">
                <span className="block text-serif text-[17px] text-ink">Sérgio Fonseca</span>
                <span className="block font-mono text-[9px] tracking-[0.24em] uppercase text-faint mt-1">
                  Psicólogo Especialista
                </span>
              </div>
            </div>
            <p className="text-muted text-sm mt-4 max-w-[34ch]">
              Psicólogo especialista em Psicologia Clínica e da Saúde. Trauma complexo, luto,
              perturbação de personalidade borderline, supervisão e formação — com profundidade e ética.
            </p>
          </div>

          <FootCol title="Serviços" links={[
            ["Consultas", "/servicos/consultas"],
            ["Supervisão Clínica", "/servicos/supervisao-clinica"],
            ["Consultoria", "/servicos/consultoria"],
            ["Sobre", "/sobre"],
          ]} />
          <FootCol title="Explorar" links={[
            ["Formações", "/formacoes"],
            ["Calendário de formações", "/formacoes?tipo=calendario"],
            ["Blog", "/blog"],
          ]} />

          <div>
            <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint mb-4">Contacto</h5>
            <div className="font-mono text-[12.5px] text-muted leading-loose">
              <a href={`tel:${CONTACT.phoneRaw}`} className="block hover:text-ink">{CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="block hover:text-ink break-all">{CONTACT.email}</a>
            </div>
            <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-4 text-sm">Marcar consulta</a>
            <div className="flex gap-3 mt-5">
              <Social href={CONTACT.social.instagram} label="Instagram" />
              <Social href={CONTACT.social.facebook} label="Facebook" />
              <Social href={CONTACT.whatsapp} label="WhatsApp" />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-11 pt-6 flex flex-wrap justify-between gap-3 text-[12px] text-faint">
          <span>© 2026 Sérgio Fonseca · Psicologia</span>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-ink">Privacidade</Link>
            <Link href="/termos" className="hover:text-ink">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint mb-4">{title}</h5>
      <div className="flex flex-col">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="text-muted text-sm py-1.5 hover:text-ink transition-colors">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Social({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted hover:text-ink hover:border-border-strong transition-colors font-mono text-[10px]">
      {label.charAt(0)}
    </a>
  );
}
