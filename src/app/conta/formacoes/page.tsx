import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isLive } from "@/lib/constants";

export default async function MinhasFormacoes() {
  const session = await auth();
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session!.user.id },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10 max-w-[900px]">
      <h1 className="text-2xl font-semibold">As minhas formações</h1>
      <p className="text-muted mt-2 mb-8">Todas as formações a que tem acesso.</p>

      {enrollments.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-muted">Ainda não tem formações.</p>
          <Link href="/formacoes" className="btn btn-primary mt-4">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {enrollments.map((e) => (
            <Link key={e.id} href={e.status === "ACTIVE" ? `/aprender/${e.course.slug}` : `/formacoes/${e.course.slug}`} className="card card-hover overflow-hidden">
              <div className="h-24" style={{ background: `linear-gradient(150deg, ${e.course.coverColor}, #0A1526)` }} />
              <div className="p-5">
                <span className={`pill ${isLive(e.course.type) ? "pill-live" : "pill-brand"}`}>{isLive(e.course.type) ? "Em direto" : "Gravada"}</span>
                <h3 className="font-semibold mt-2">{e.course.title}</h3>
                <div className="h-1.5 bg-surface-2 rounded mt-3 overflow-hidden">
                  <div className="h-full bg-brand rounded" style={{ width: `${e.progress}%` }} />
                </div>
                <p className="text-[11px] text-faint mt-1.5 font-mono">{e.progress}% concluído</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
