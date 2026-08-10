import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { toEmbedUrl } from "@/lib/video";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  return { title: course ? `Aulas · ${course.title}` : "Aulas" };
}

export default async function AprenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aula?: string }>;
}) {
  const { slug } = await params;
  const { aula } = await searchParams;

  const session = await auth();
  if (!session?.user) redirect(`/login?next=/aprender/${slug}`);

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  const isAdmin = session.user.role === "ADMIN";
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  const hasAccess = isAdmin || enrollment?.status === "ACTIVE";

  // ---- Sem acesso: ecrã trancado ----
  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-soft text-brand grid place-items-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </div>
        <h1 className="text-2xl">Conteúdo trancado</h1>
        <p className="text-muted mt-3">
          {enrollment?.status === "PENDING"
            ? "A sua inscrição está pendente de pagamento. Assim que for confirmado, as aulas ficam disponíveis."
            : "Precisa de estar inscrito nesta formação para aceder às aulas."}
        </p>
        <Link href={`/formacoes/${course.slug}`} className="btn btn-primary mt-6">Ver a formação</Link>
      </div>
    );
  }

  const progresses = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: course.lessons.map((l) => l.id) } },
  });
  const doneSet = new Set(progresses.filter((p) => p.completed).map((p) => p.lessonId));

  const current =
    course.lessons.find((l) => l.id === aula) ??
    course.lessons.find((l) => !doneSet.has(l.id)) ??
    course.lessons[0];

  const doneCount = doneSet.size;
  const total = course.lessons.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  // ---- Ação: marcar/desmarcar aula ----
  async function toggleLesson(lessonId: string, completed: boolean) {
    "use server";
    const s = await auth();
    if (!s?.user) return;
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return;
    const enr = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: s.user.id, courseId: lesson.courseId } },
    });
    if (s.user.role !== "ADMIN" && enr?.status !== "ACTIVE") return;

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: s.user.id, lessonId } },
      update: { completed },
      create: { userId: s.user.id, lessonId, completed },
    });

    // Recalcular progresso da inscrição
    const all = await prisma.lesson.findMany({ where: { courseId: lesson.courseId }, select: { id: true } });
    const done = await prisma.lessonProgress.count({
      where: { userId: s.user.id, completed: true, lessonId: { in: all.map((l) => l.id) } },
    });
    const p = all.length ? Math.round((done / all.length) * 100) : 0;
    if (enr) await prisma.enrollment.update({ where: { id: enr.id }, data: { progress: p } });
    revalidatePath(`/aprender/${slug}`);
    revalidatePath("/conta");
  }

  const currentDone = current ? doneSet.has(current.id) : false;

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-8 grid gap-8 lg:grid-cols-[1fr_340px] items-start">
      {/* ---- Player ---- */}
      <div>
        <Link href={`/formacoes/${course.slug}`} className="text-sm text-muted hover:text-ink">← {course.title}</Link>
        {current ? (
          <>
            <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-black aspect-video">
              {current.videoUrl ? (
                <iframe
                  src={toEmbedUrl(current.videoUrl)}
                  title={current.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/60 text-sm">Vídeo em breve</div>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 mt-5 flex-wrap">
              <div>
                <h1 className="text-2xl">{current.title}</h1>
                {current.description && <p className="text-muted mt-2 max-w-[60ch]">{current.description}</p>}
              </div>
              <form action={toggleLesson.bind(null, current.id, !currentDone)}>
                <button className={`btn ${currentDone ? "btn-ghost" : "btn-primary"}`}>
                  {currentDone ? "✓ Concluída" : "Marcar como concluída"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <p className="text-muted mt-6">Esta formação ainda não tem aulas publicadas.</p>
        )}
      </div>

      {/* ---- Lista de aulas ---- */}
      <aside className="card p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold">Aulas</h2>
          <span className="text-sm text-muted">{doneCount}/{total}</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded overflow-hidden mb-4">
          <div className="h-full bg-brand rounded" style={{ width: `${pct}%` }} />
        </div>
        <ol className="flex flex-col gap-1">
          {course.lessons.map((l, i) => {
            const done = doneSet.has(l.id);
            const active = current?.id === l.id;
            return (
              <li key={l.id}>
                <Link
                  href={`/aprender/${course.slug}?aula=${l.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-brand-soft" : "hover:bg-surface-2"}`}
                >
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold shrink-0 ${done ? "bg-brand text-white" : "border border-border-strong text-muted"}`}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm truncate ${active ? "font-semibold text-ink" : "text-muted"}`}>{l.title}</span>
                    {l.durationLabel && <span className="block text-[11px] text-faint">{l.durationLabel}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
