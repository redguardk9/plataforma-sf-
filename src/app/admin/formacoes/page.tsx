import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, isLive } from "@/lib/constants";
import { createCourse, toggleCoursePublished, deleteCourse } from "../actions";

export default async function AdminFormacoes() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Formações</h1>
      <p className="text-muted mt-2 mb-8">Crie e gira as formações gravadas e em direto.</p>

      {/* Criar */}
      <details className="card p-6 mb-8">
        <summary className="cursor-pointer font-semibold flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-brand text-white grid place-items-center text-sm">+</span>
          Nova formação
        </summary>
        <form action={createCourse} className="grid sm:grid-cols-2 gap-4 mt-6">
          <Field name="title" label="Título" required className="sm:col-span-2" />
          <Field name="subtitle" label="Subtítulo (cartão)" className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <label className="label">Descrição</label>
            <textarea name="description" rows={3} className="input resize-none" />
          </div>
          <div>
            <label className="label">Tipo</label>
            <select name="type" className="input">
              <option value="RECORDED">Gravada</option>
              <option value="LIVE">Em direto</option>
            </select>
          </div>
          <Field name="price" label="Preço (€)" placeholder="120" />
          <Field name="durationLabel" label="Duração" placeholder="6h20 ou 4 sessões" />
          <Field name="level" label="Nível" placeholder="Intermédio" />
          <Field name="coverColor" label="Cor da capa" placeholder="#1E6FE8" />
          <Field name="enrollUrl" label="Link de inscrição (Automarte / Google Form)" placeholder="https://…" className="sm:col-span-2" />
          <Field name="enrollLabel" label="Texto do botão" placeholder="Comprar no Automarte" className="sm:col-span-2" />
          <div className="sm:col-span-2 border-t border-border pt-4 mt-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint mb-3">Apenas para formações em direto</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Data / hora</label>
                <input name="startAt" type="datetime-local" className="input" />
              </div>
              <Field name="sessionsLabel" label="Calendário" placeholder="4 sessões · quintas" />
              <Field name="seatsTotal" label="Vagas" placeholder="18" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <button className="btn btn-primary">Criar formação</button>
          </div>
        </form>
      </details>

      {/* Lista */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-faint border-b border-border">
                <th className="px-4 py-3">Formação</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-center">Inscritos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/formacoes/${c.slug}`} className="hover:text-glow">{c.title}</Link>
                  </td>
                  <td className="px-4 py-3"><span className={`pill ${isLive(c.type) ? "pill-live" : "pill-brand"}`}>{isLive(c.type) ? "Direto" : "Gravada"}</span></td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{formatPrice(c.priceCents)}</td>
                  <td className="px-4 py-3 text-center font-mono">{c._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <span className={`pill ${c.published ? "pill-success" : "pill-brand"}`}>{c.published ? "Publicada" : "Rascunho"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end items-center">
                      <Link href={`/admin/formacoes/${c.id}`} className="text-xs text-brand font-semibold hover:underline">Editar</Link>
                      <form action={toggleCoursePublished.bind(null, c.id)}>
                        <button className="text-xs text-muted hover:text-ink">{c.published ? "Despublicar" : "Publicar"}</button>
                      </form>
                      <form action={deleteCourse.bind(null, c.id)}>
                        <button className="text-xs text-red-500 hover:text-red-400">Apagar</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, required, placeholder, className = "" }: { name: string; label: string; required?: boolean; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} required={required} placeholder={placeholder} className="input" />
    </div>
  );
}
