import Link from "next/link";
import type { Metadata } from "next";
import { currentUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { formatDateShort, formatDateTime } from "@/lib/constants";

export const metadata: Metadata = { title: "Supervisão" };

const TYPE_LABEL: Record<string, string> = { RECORDING: "Gravação", MATERIAL: "Material" };

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

  const [settings, resources] = await Promise.all([
    prisma.supervisionSettings.findFirst(),
    prisma.supervisionResource.findMany({ orderBy: { order: "asc" } }),
  ]);
  const upcoming = settings?.nextSessionAt && settings.nextSessionAt.getTime() > Date.now() ? settings.nextSessionAt : null;

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <span className="eyebrow">Área reservada · Supervisão</span>
      <h1 className="mt-3.5 text-[clamp(28px,4vw,40px)] font-semibold">Supervisão clínica</h1>
      <p className="text-muted mt-2.5 max-w-[54ch]">
        Bem-vindo, {user?.name?.split(" ")[0]}. Aqui encontra as gravações das sessões,
        materiais de caso e o calendário dos próximos encontros.
      </p>

      {/* Próximo encontro */}
      {upcoming && (
        <div className="card p-6 mt-9 flex items-center gap-5 border-brand/30 flex-wrap">
          <div className="w-16 h-16 rounded-xl bg-brand-soft grid place-items-center text-center shrink-0">
            <div className="text-sm font-semibold text-glow leading-none">{formatDateShort(upcoming)}</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-mono text-[10px] uppercase tracking-wider text-glow">Próximo encontro</div>
            <div className="text-lg font-semibold">{settings?.nextSessionLabel}</div>
            <p className="text-sm text-muted">{formatDateTime(upcoming)}</p>
          </div>
          {settings?.meetingUrl && (
            <a href={settings.meetingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Entrar na sala</a>
          )}
        </div>
      )}

      {/* Conteúdos */}
      {resources.length === 0 ? (
        <p className="text-muted mt-9">Ainda não há gravações nem materiais publicados aqui.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-3 mt-9">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              type={TYPE_LABEL[r.type] ?? r.type}
              title={r.title}
              desc={r.description}
              url={r.url}
              icon={r.type === "RECORDING" ? "play" : "doc"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ type, title, desc, icon, url }: { type: string; title: string; desc: string; icon: "play" | "doc"; url?: string | null }) {
  const content = (
    <>
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
      {desc && <p className="text-sm text-muted mt-1">{desc}</p>}
    </>
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="card card-hover p-5 block">
        {content}
      </a>
    );
  }
  return <div className="card p-5">{content}</div>;
}
