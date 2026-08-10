import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CourseCard, type CourseCardData } from "@/components/CourseCard";
import { formatPrice } from "@/lib/constants";

export const metadata: Metadata = { title: "Formações" };

const TABS = [
  { key: "todas", label: "Todas", dot: "" },
  { key: "gravada", label: "Gravadas", dot: "var(--color-brand)" },
  { key: "direto", label: "Em direto", dot: "var(--color-live)" },
  { key: "calendario", label: "Calendário", dot: "" },
];

const TZ = "Europe/Lisbon";
const MONTH_FMT = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, month: "long", year: "numeric" });
const DAY_FMT = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, day: "2-digit" });
const WEEKDAY_FMT = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, weekday: "short" });
const TIME_FMT = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });

export default async function FormacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo = "todas" } = await searchParams;

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
        <div>
          <span className="eyebrow">Formações</span>
          <h1 className="mt-4 text-[clamp(30px,4.4vw,46px)]">Aprofundar a prática clínica</h1>
          <p className="text-muted mt-3 max-w-[56ch] leading-relaxed">
            Formações gravadas para ver ao seu ritmo e formações em direto com data marcada e vagas
            limitadas. Consulte o calendário e inscreva-se.
          </p>
        </div>
        <div className="flex gap-1.5 p-1.5 rounded-xl bg-surface border border-border">
          {TABS.map((t) => {
            const active = tipo === t.key;
            return (
              <Link
                key={t.key}
                href={t.key === "todas" ? "/formacoes" : `/formacoes?tipo=${t.key}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.dot }} />}
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      {tipo === "calendario" ? <Calendario /> : <Grelha tipo={tipo} />}
    </div>
  );
}

async function Grelha({ tipo }: { tipo: string }) {
  const where =
    tipo === "gravada"
      ? { published: true, type: "RECORDED" }
      : tipo === "direto"
      ? { published: true, type: "LIVE" }
      : { published: true };

  const courses = await prisma.course.findMany({
    where,
    orderBy: [{ type: "asc" }, { createdAt: "asc" }],
  });

  if (courses.length === 0) {
    return <p className="text-muted">Ainda não há formações nesta categoria.</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c, i) => (
        <CourseCard key={c.id} course={{ ...(c as CourseCardData), _index: i }} />
      ))}
    </div>
  );
}

async function Calendario() {
  const courses = await prisma.course.findMany({
    where: { published: true, type: "LIVE", startAt: { not: null } },
    orderBy: { startAt: "asc" },
  });

  if (courses.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-muted">Sem formações em direto agendadas de momento.</p>
        <Link href="/formacoes?tipo=gravada" className="btn btn-ghost mt-5">Ver formações gravadas</Link>
      </div>
    );
  }

  // Agrupar por mês/ano.
  const groups = new Map<string, typeof courses>();
  for (const c of courses) {
    const key = MONTH_FMT.format(c.startAt!);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  return (
    <div className="flex flex-col gap-10">
      {[...groups.entries()].map(([month, list]) => (
        <div key={month}>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-serif text-[22px] capitalize">{month}</h2>
            <div className="flex-1 rule-gold" />
            <span className="badge badge-live">{list.length} {list.length === 1 ? "sessão" : "sessões"}</span>
          </div>
          <div className="flex flex-col gap-3">
            {list.map((c) => {
              const enrollUrl = (c as { enrollUrl?: string | null }).enrollUrl ?? null;
              const enrollLabel = (c as { enrollLabel?: string | null }).enrollLabel ?? null;
              const seatsLeft = c.seatsTotal ? c.seatsTotal - c.seatsTaken : null;
              return (
                <div key={c.id} className="card card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Data */}
                  <div className="flex items-center gap-4 sm:w-[150px] shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-live-soft border border-border grid place-items-center text-center shrink-0">
                      <div>
                        <div className="text-serif text-[24px] leading-none text-live">{DAY_FMT.format(c.startAt!)}</div>
                        <div className="text-[10px] uppercase tracking-wider text-live/80 mt-0.5">{WEEKDAY_FMT.format(c.startAt!).replace(".", "")}</div>
                      </div>
                    </div>
                    <div className="sm:hidden">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-xs text-muted">{TIME_FMT.format(c.startAt!)}</div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 hidden sm:block">
                    <Link href={`/formacoes/${c.slug}`} className="font-semibold text-lg hover:text-brand transition-colors">{c.title}</Link>
                    <p className="text-sm text-muted mt-1 line-clamp-1">{c.subtitle}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[12px] text-faint">
                      <span>◷ {TIME_FMT.format(c.startAt!)}</span>
                      {c.sessionsLabel && <span>◉ {c.sessionsLabel}</span>}
                      {seatsLeft !== null && seatsLeft > 0 && <span className="text-live font-semibold">● {seatsLeft} vagas</span>}
                    </div>
                  </div>

                  {/* Preço + CTA */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="text-serif text-lg">{formatPrice(c.priceCents)}</span>
                    {enrollUrl ? (
                      <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                        {enrollLabel || "Inscrever"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17L17 7M17 7H8M17 7v9" /></svg>
                      </a>
                    ) : (
                      <Link href={`/formacoes/${c.slug}`} className="btn btn-live">Inscrever</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
