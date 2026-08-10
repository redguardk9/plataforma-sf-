import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, isLive } from "@/lib/constants";

export default async function ContaHome({ searchParams }: { searchParams: Promise<{ bemvindo?: string }> }) {
  const { bemvindo } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const [enrollments, payments] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId }, include: { course: true }, orderBy: { createdAt: "desc" } }),
    prisma.payment.findMany({ where: { userId }, include: { course: true, ebook: true }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const liveUpcoming = enrollments
    .filter((e) => isLive(e.course.type) && e.course.startAt && e.course.startAt > new Date())
    .sort((a, b) => (a.course.startAt!.getTime() - b.course.startAt!.getTime()));

  return (
    <div className="p-6 lg:p-10 max-w-[900px]">
      {bemvindo && (
        <div className="card p-4 mb-6 border-brand/30 flex items-center gap-3">
          <span className="text-glow">✓</span>
          <p className="text-sm">Pedido registado. O pagamento será concluído assim que o Multibanco/MB Way estiver ativo.</p>
        </div>
      )}

      <p className="font-mono text-[11px] uppercase tracking-widest text-faint">A minha área</p>
      <h1 className="text-3xl font-semibold mt-1">Olá, {session!.user.name?.split(" ")[0]}.</h1>
      <p className="text-muted mt-2">Continue de onde ficou e acompanhe as suas inscrições.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
        <Kpi label="Formações" value={enrollments.length} />
        <Kpi label="Sessões em direto" value={liveUpcoming.length} accent="live" />
        <Kpi label="Compras" value={payments.length} />
      </div>

      {/* Continuar */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Continuar a aprender</h2>
      {enrollments.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-muted">Ainda não tem formações. Explore o catálogo e comece hoje.</p>
          <Link href="/formacoes" className="btn btn-primary mt-4">Ver formações</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {enrollments.map((e) => (
            <div key={e.id} className="card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg shrink-0" style={{ background: `linear-gradient(150deg, ${e.course.coverColor}, #0A1526)` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/formacoes/${e.course.slug}`} className="font-semibold truncate hover:text-glow">{e.course.title}</Link>
                  <span className={`pill ${isLive(e.course.type) ? "pill-live" : "pill-brand"}`}>{isLive(e.course.type) ? "Em direto" : "Gravada"}</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded mt-2 overflow-hidden max-w-[280px]">
                  <div className="h-full bg-brand rounded" style={{ width: `${e.progress}%` }} />
                </div>
                <p className="text-[11px] text-faint mt-1 font-mono">{e.progress}% concluído</p>
              </div>
              <Link
                href={e.status === "ACTIVE" ? `/aprender/${e.course.slug}` : `/formacoes/${e.course.slug}`}
                className="btn btn-primary text-sm hidden sm:inline-flex"
              >
                {e.status === "ACTIVE" ? "Continuar" : "Pendente"}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Próximas sessões */}
      {liveUpcoming.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-10 mb-4">Próximas sessões em direto</h2>
          <div className="flex flex-col gap-3">
            {liveUpcoming.map((e) => (
              <div key={e.id} className="card p-4 flex items-center gap-4 border-live/20">
                <div className="w-12 h-12 rounded-lg bg-live-soft grid place-items-center text-live font-semibold shrink-0">
                  {new Intl.DateTimeFormat("pt-PT", { day: "2-digit" }).format(e.course.startAt!)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{e.course.title}</p>
                  <p className="text-sm text-muted">{formatDate(e.course.startAt!, { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className="pill pill-live">Inscrito</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Compras recentes */}
      <h2 className="text-lg font-semibold mt-10 mb-4">Compras recentes</h2>
      {payments.length === 0 ? (
        <p className="text-muted text-sm">Ainda não há compras.</p>
      ) : (
        <div className="card divide-y divide-border">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{p.course?.title ?? p.ebook?.title ?? "Compra"}</p>
                <p className="text-[11px] text-faint font-mono">{formatDate(p.createdAt)} · {p.method.toUpperCase()}</p>
              </div>
              <span className="font-mono text-sm">{formatPrice(p.amountCents)}</span>
              <PaymentPill status={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent?: "live" }) {
  return (
    <div className="card p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${accent === "live" ? "text-live" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function PaymentPill({ status }: { status: string }) {
  const map: Record<string, string> = { PAID: "pill-success", PENDING: "pill-live", FAILED: "pill-live", REFUNDED: "pill-brand" };
  const label: Record<string, string> = { PAID: "Pago", PENDING: "Pendente", FAILED: "Falhou", REFUNDED: "Reembolsado" };
  return <span className={`pill ${map[status] ?? "pill-brand"}`}>{label[status] ?? status}</span>;
}
