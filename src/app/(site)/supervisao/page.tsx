import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@/lib/guards";

export const metadata: Metadata = { title: "Supervisão" };

// Middleware garante que o utilizador está autenticado.
// Aqui validamos o acesso específico à supervisão — na BASE DE DADOS.
export default async function SupervisaoPage() {
  const user = await currentUser();
  const hasAccess = user?.supervisionAccess || user?.role === "ADMIN";

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-soft text-glow grid place-items-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </div>
        <h1 className="text-2xl font-semibold">Área reservada à supervisão</h1>
        <p className="text-muted mt-3">
          Este espaço é exclusivo para supervisionados. Para se candidatar à supervisão clínica,
          contacte diretamente Sérgio Fonseca.
        </p>
        <div className="flex gap-3 justify-center mt-7">
          <a href="mailto:sergiofonseca.psic@gmail.com" className="btn btn-primary">Candidatar-me à supervisão</a>
          <Link href="/conta" className="btn btn-ghost">A minha área</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <span className="eyebrow">Área reservada · Supervisão</span>
      <h1 className="mt-3.5 text-[clamp(28px,4vw,40px)] font-semibold">Supervisão clínica</h1>
      <p className="text-muted mt-2.5 max-w-[54ch]">
        Bem-vindo, {user?.name?.split(" ")[0]}. Aqui encontra as gravações das sessões,
        materiais de caso e o calendário dos próximos encontros.
      </p>

      {/* Próximo encontro */}
      <div className="card p-6 mt-9 flex items-center gap-5 border-brand/30">
        <div className="w-16 h-16 rounded-xl bg-brand-soft grid place-items-center text-center shrink-0">
          <div>
            <div className="text-xl font-semibold text-glow leading-none">01</div>
            <div className="font-mono text-[9px] uppercase text-muted mt-1">AGO</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-glow">Próximo encontro</div>
          <div className="text-lg font-semibold">Grupo de supervisão · 20h00</div>
          <p className="text-sm text-muted">Online · traga um caso para pensarmos em conjunto.</p>
        </div>
        <button className="btn btn-primary hidden sm:inline-flex">Entrar na sala</button>
      </div>

      {/* Conteúdos */}
      <div className="grid gap-5 md:grid-cols-3 mt-6">
        <ResourceCard type="Gravação" title="Sessão de Julho" desc="A transferência no trabalho institucional." icon="play" />
        <ResourceCard type="Material" title="Guião de leitura de caso" desc="Estrutura para apresentar casos ao grupo." icon="doc" />
        <ResourceCard type="Gravação" title="Sessão de Junho" desc="Acting-out e passagem ao ato — revisão." icon="play" />
        <ResourceCard type="Material" title="Bibliografia essencial" desc="Textos de referência da supervisão." icon="doc" />
        <ResourceCard type="Gravação" title="Sessão de Maio" desc="O silêncio como intervenção." icon="play" />
        <ResourceCard type="Material" title="Modelo de notas clínicas" desc="Template para registo de sessões." icon="doc" />
      </div>
    </div>
  );
}

function ResourceCard({ type, title, desc, icon }: { type: string; title: string; desc: string; icon: "play" | "doc" }) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-brand-soft text-glow grid place-items-center">
          {icon === "play" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h5" /></svg>
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{type}</span>
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted mt-1">{desc}</p>
    </div>
  );
}
