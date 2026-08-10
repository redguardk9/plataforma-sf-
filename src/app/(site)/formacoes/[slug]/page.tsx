import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CoverArt } from "@/components/CoverArt";
import { formatPrice, formatDate, isLive } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  return { title: course?.title ?? "Formação" };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: "asc" } },
      messages: { orderBy: { createdAt: "asc" }, take: 30, include: { user: true } },
    },
  });
  if (!course) notFound();

  const session = await auth();
  const live = isLive(course.type);
  const enrollment = session?.user
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      })
    : null;
  const enrolled = !!enrollment;
  const isAdmin = session?.user?.role === "ADMIN";
  const canChat = isAdmin || enrolled;

  // ---- Ações de servidor ----
  async function enroll() {
    "use server";
    const s = await auth();
    if (!s?.user) redirect(`/login?next=/formacoes/${slug}`);
    const c = await prisma.course.findUnique({ where: { slug } });
    if (!c) return;

    // Já inscrito? Não duplica nada.
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: s.user.id, courseId: c.id } },
    });
    if (!existing) {
      // Verifica lotação nas formações em direto.
      if (isLive(c.type) && c.seatsTotal != null && c.seatsTaken >= c.seatsTotal) {
        redirect(`/formacoes/${slug}?esgotado=1`);
      }
      const ops: Prisma.PrismaPromise<unknown>[] = [
        // Inscrição PENDENTE — só fica ativa quando o pagamento é confirmado.
        prisma.enrollment.create({ data: { userId: s.user.id, courseId: c.id, status: "PENDING" } }),
        prisma.payment.create({
          data: { userId: s.user.id, courseId: c.id, amountCents: c.priceCents, status: "PENDING", method: "mbway" },
        }),
      ];
      if (isLive(c.type) && c.seatsTotal != null) {
        ops.push(prisma.course.update({ where: { id: c.id }, data: { seatsTaken: { increment: 1 } } }));
      }
      await prisma.$transaction(ops);
    }
    redirect("/conta?bemvindo=1");
  }

  async function postMessage(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user) return;
    const body = String(formData.get("body") ?? "").trim();
    const c = await prisma.course.findUnique({ where: { slug } });
    if (!c || !body) return;
    // Só inscritos (ou o formador) podem colocar dúvidas.
    if (s.user.role !== "ADMIN") {
      const enr = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: s.user.id, courseId: c.id } },
      });
      if (!enr) return;
    }
    await prisma.message.create({ data: { courseId: c.id, userId: s.user.id, body } });
    revalidatePath(`/formacoes/${slug}`);
  }

  const seatsLeft = course.seatsTotal ? course.seatsTotal - course.seatsTaken : null;
  const enrollUrl = (course as { enrollUrl?: string | null }).enrollUrl ?? null;
  const enrollLabel = (course as { enrollLabel?: string | null }).enrollLabel ?? null;

  return (
    <>
      {/* ---- Topo ---- */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1180px] px-6 pt-8 pb-12">
          <Link href="/formacoes" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
            Voltar às formações
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1.6fr_0.9fr] items-start">
            <div>
              <span className="eyebrow">{live ? "Formação em direto" : "Formação gravada"}</span>
              <h1 className="mt-3.5 text-[clamp(30px,4.4vw,46px)] font-semibold">{course.title}</h1>
              <p className="mt-4 text-lg text-muted max-w-[56ch]">{course.description}</p>

              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-7">
                <Meta value={course.durationLabel} label={live ? "Formato" : "Duração"} />
                <Meta value={course.level} label="Nível" />
                {live && course.sessionsLabel && <Meta value={course.sessionsLabel} label="Calendário" />}
                {!live && <Meta value={`${course.modules.length} módulos`} label="Programa" />}
                <Meta value={`${course.rating.toFixed(1).replace(".", ",")} ★`} label={live ? "Grupo reduzido" : `${course.studentsCount} formandos`} />
              </div>
            </div>

            {/* ---- Cartão de compra ---- */}
            <div className="card p-6 lg:sticky lg:top-[92px]">
              <div className="relative rounded-xl overflow-hidden mb-5">
                <CoverArt color={course.coverColor} seed={course.title.length + 3} height={110} />
              </div>
              <div className="text-[40px] font-semibold leading-none">
                {formatPrice(course.priceCents)}
                <span className="font-mono text-xs text-faint ml-1.5">{live ? "/ inscrição" : "/ vitalício"}</span>
              </div>

              {live && course.startAt && (
                <div className="flex items-center gap-3 bg-live-soft rounded-xl p-3.5 my-4">
                  <div className="w-11 h-11 rounded-lg bg-surface border border-border grid place-items-center">
                    <span className="text-lg font-semibold text-live leading-none">
                      {new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "2-digit" }).format(course.startAt)}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-live">Próxima sessão</div>
                    <div className="font-semibold">{formatDate(course.startAt, { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              )}

              {enrollUrl ? (
                <div className="mt-4">
                  <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className={`btn w-full ${live ? "btn-live" : "btn-accent"}`}>
                    {enrollLabel || (live ? "Inscrever na formação" : "Comprar formação")}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M7 17L17 7M17 7H8M17 7v9" /></svg>
                  </a>
                  <p className="text-[11px] text-faint text-center mt-2.5">Inscrição gerida em plataforma externa</p>
                </div>
              ) : enrolled ? (
                <div className="mt-4">
                  <span className={`pill ${enrollment?.status === "ACTIVE" ? "pill-success" : "pill-live"} mb-2 inline-block`}>
                    {enrollment?.status === "ACTIVE" ? "✓ Inscrição confirmada" : "Inscrição pendente de pagamento"}
                  </span>
                  {enrollment?.status === "ACTIVE" ? (
                    <Link href={`/aprender/${course.slug}`} className="btn btn-primary w-full mt-1">Aceder às aulas</Link>
                  ) : (
                    <Link href="/conta" className="btn btn-ghost w-full mt-1">Ir para a minha área</Link>
                  )}
                </div>
              ) : live && seatsLeft !== null && seatsLeft <= 0 ? (
                <button disabled className="btn btn-ghost w-full mt-4 opacity-60 cursor-not-allowed">Esgotado</button>
              ) : (
                <form action={enroll} className="mt-4">
                  <button className={`btn w-full ${live ? "btn-live" : "btn-primary"}`}>
                    {live ? "Inscrever-me na formação" : "Comprar formação"}
                  </button>
                </form>
              )}

              {live && seatsLeft !== null && seatsLeft > 0 && (
                <p className="text-[11px] text-live text-center mt-3.5 font-semibold">● Apenas {seatsLeft} vagas</p>
              )}

              <ul className="flex flex-col gap-2.5 mt-5">
                {(live
                  ? ["Sessões ao vivo com interação direta", "Chat de dúvidas respondido pelo formador", "Materiais e leituras de apoio", "Gravação disponível após cada sessão"]
                  : ["Acesso vitalício a todas as gravações", "Chat de dúvidas respondido pelo formador", "Materiais e leituras de apoio", "Certificado de conclusão"]
                ).map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm text-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-glow shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" opacity=".3" /><path d="M8 12l3 3 5-5" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Programa ---- */}
      <div className="mx-auto max-w-[1180px] px-6 py-14">
        <h2 className="text-2xl font-semibold mb-6">Programa da formação</h2>
        <div className="flex flex-col gap-2.5 max-w-[820px]">
          {course.modules.map((m, i) => (
            <details key={m.id} className="card overflow-hidden group" open={i === 0}>
              <summary className="px-5 py-4 cursor-pointer flex items-center gap-4 list-none [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-xs text-glow w-6">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-semibold">{m.title}</span>
                <span className="font-mono text-[11px] text-faint">{m.section}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted transition-transform group-open:rotate-90"><path d="M9 6l6 6-6 6" /></svg>
              </summary>
              <div className="px-5 pb-4 pl-[60px] text-sm text-muted">{m.description}</div>
            </details>
          ))}
        </div>

        {/* ---- Chat de dúvidas ---- */}
        <div className="card overflow-hidden mt-12 max-w-[820px]">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-soft text-glow grid place-items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 11.5a8.4 8.4 0 0 1-9 8 8.4 8.4 0 0 1-4-1L3 20l1.5-4a8.4 8.4 0 1 1 16.5-4.5z" /></svg>
            </div>
            <div>
              <b className="text-sm">Chat de dúvidas da formação</b>
              <p className="font-mono text-[10.5px] text-faint">Perguntas respondidas por Sérgio Fonseca</p>
            </div>
          </div>

          {!canChat ? (
            <div className="p-8 text-center bg-surface-2/60">
              <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand grid place-items-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </div>
              <p className="text-sm text-muted max-w-[42ch] mx-auto">
                O chat de dúvidas é reservado a quem está inscrito nesta formação.
              </p>
              {!session?.user && (
                <Link href={`/login?next=/formacoes/${course.slug}`} className="btn btn-ghost mt-4">Entrar</Link>
              )}
            </div>
          ) : (
          <>
          <div className="p-5 flex flex-col gap-4 bg-surface-2/50">
            {course.messages.length === 0 && (
              <p className="text-sm text-muted text-center py-4">Ainda não há dúvidas. Seja o primeiro a perguntar.</p>
            )}
            {course.messages.map((msg) => {
              const isFormador = msg.user.role === "ADMIN";
              const mine = session?.user?.id === msg.userId;
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[80%] ${mine ? "self-end flex-row-reverse" : ""}`}>
                  <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold text-white shrink-0 ${isFormador ? "bg-brand" : "bg-live"}`}>
                    {(msg.user.name ?? "?").charAt(0).toUpperCase()}
                  </span>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm border ${mine ? "bg-brand text-white border-transparent" : "bg-surface border-border"}`}>
                    <small className="block font-mono text-[9.5px] opacity-70 mb-1">
                      {msg.user.name}{isFormador ? " · formador" : ""}
                    </small>
                    {msg.body}
                  </div>
                </div>
              );
            })}
          </div>

          <form action={postMessage} className="flex gap-2.5 p-4 border-t border-border">
            <input name="body" required placeholder="Escreva a sua dúvida..." className="input flex-1" />
            <button className="btn btn-primary">Enviar</button>
          </form>
          </>
          )}
        </div>
      </div>
    </>
  );
}

function Meta({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-lg font-semibold">{value}</span>
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-faint">{label}</span>
    </div>
  );
}
