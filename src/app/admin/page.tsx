import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, isLive } from "@/lib/constants";

export default async function AdminHome() {
  const [paidAgg, pendingAgg, users, enrollments, courses, recentPayments, recentEnroll] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amountCents: true }, where: { status: "PAID" } }),
    prisma.payment.aggregate({ _sum: { amountCents: true }, _count: true, where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.course.count(),
    prisma.payment.findMany({ include: { user: true, course: true, ebook: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.enrollment.findMany({ include: { user: true, course: true }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <div className="p-6 lg:p-10">
      <p className="font-mono text-[11px] uppercase tracking-widest text-faint">Painel de administração</p>
      <h1 className="text-3xl font-semibold mt-1">Visão geral</h1>
      <p className="text-muted mt-2">Tudo o que acontece na plataforma, num só lugar.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Kpi label="Receita confirmada" value={formatPrice(paidAgg._sum.amountCents ?? 0)} accent />
        <Kpi label="Por confirmar" value={formatPrice(pendingAgg._sum.amountCents ?? 0)} sub={`${pendingAgg._count} pagamentos`} live />
        <Kpi label="Utilizadores" value={String(users)} />
        <Kpi label="Inscrições" value={String(enrollments)} sub={`${courses} formações`} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-8">
        {/* Pagamentos recentes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Pagamentos recentes</h2>
            <Link href="/admin/pagamentos" className="font-mono text-[11px] text-glow uppercase tracking-wider">Ver todos</Link>
          </div>
          <div className="divide-y divide-border">
            {recentPayments.length === 0 && <p className="px-5 py-6 text-muted text-sm">Sem pagamentos ainda.</p>}
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.course?.title ?? p.ebook?.title ?? "Compra"}</p>
                  <p className="text-[11px] text-faint font-mono">{p.user.name} · {formatDate(p.createdAt)}</p>
                </div>
                <span className="font-mono text-sm tabular-nums">{formatPrice(p.amountCents)}</span>
                <StatusPill status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Inscrições recentes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Inscrições recentes</h2>
          </div>
          <div className="divide-y divide-border">
            {recentEnroll.length === 0 && <p className="px-5 py-6 text-muted text-sm">Sem inscrições ainda.</p>}
            {recentEnroll.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-semibold text-white bg-gradient-to-br from-brand to-brand-700 shrink-0">
                  {e.user.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.user.name}</p>
                  <p className="text-[11px] text-faint truncate">{e.course.title}</p>
                </div>
                <span className={`pill ${isLive(e.course.type) ? "pill-live" : "pill-brand"}`}>{isLive(e.course.type) ? "Direto" : "Gravada"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent, live }: { label: string; value: string; sub?: string; accent?: boolean; live?: boolean }) {
  return (
    <div className="card p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">{label}</p>
      <p className={`text-2xl font-semibold mt-1.5 ${accent ? "text-glow" : live ? "text-live" : "text-ink"}`}>{value}</p>
      {sub && <p className="text-[11px] text-faint mt-1">{sub}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { PAID: "pill-success", PENDING: "pill-live", FAILED: "pill-live", REFUNDED: "pill-brand" };
  const label: Record<string, string> = { PAID: "Pago", PENDING: "Pendente", FAILED: "Falhou", REFUNDED: "Reemb." };
  return <span className={`pill ${map[status] ?? "pill-brand"}`}>{label[status] ?? status}</span>;
}
