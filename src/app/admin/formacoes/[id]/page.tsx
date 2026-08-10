import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { isLive } from "@/lib/constants";
import { updateCourse, addLesson, deleteLesson } from "../../actions";

function toLocalInput(d: Date | null): string {
  if (!d) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default async function AdminCourseEditor({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } }, _count: { select: { enrollments: true } } },
  });
  if (!course) notFound();

  const live = isLive(course.type);

  return (
    <div className="p-5 sm:p-8 max-w-[900px]">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/admin/formacoes" className="text-muted hover:text-ink">Formações</Link>
        <span className="text-faint">/</span>
        <span className="text-ink font-medium truncate">{course.title}</span>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h1 className="text-2xl">Editar formação</h1>
        <div className="flex items-center gap-2">
          <span className={`pill ${course.published ? "pill-success" : "pill-brand"}`}>{course.published ? "Publicada" : "Rascunho"}</span>
          <Link href={`/formacoes/${course.slug}`} target="_blank" className="text-sm text-brand hover:underline">Ver página →</Link>
        </div>
      </div>

      {/* Editor de campos */}
      <form action={updateCourse.bind(null, course.id)} className="adm-card p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="adm-label">Título</label>
          <input name="title" required defaultValue={course.title} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Subtítulo (cartão)</label>
          <input name="subtitle" defaultValue={course.subtitle} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Descrição</label>
          <textarea name="description" rows={3} defaultValue={course.description} className="adm-input resize-none" />
        </div>
        <div>
          <label className="adm-label">Tipo</label>
          <select name="type" defaultValue={course.type} className="adm-input">
            <option value="RECORDED">Gravada</option>
            <option value="LIVE">Em direto</option>
          </select>
        </div>
        <div>
          <label className="adm-label">Preço (€)</label>
          <input name="price" defaultValue={(course.priceCents / 100).toString()} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Duração</label>
          <input name="durationLabel" defaultValue={course.durationLabel} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Nível</label>
          <input name="level" defaultValue={course.level} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Cor da capa</label>
          <input name="coverColor" defaultValue={course.coverColor} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Link de inscrição (Automarte / Google Form)</label>
          <input name="enrollUrl" defaultValue={course.enrollUrl ?? ""} placeholder="https://…" className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Texto do botão</label>
          <input name="enrollLabel" defaultValue={course.enrollLabel ?? ""} placeholder="Comprar no Automarte" className="adm-input" />
        </div>
        <div className="flex items-end gap-5 pb-1">
          <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="published" defaultChecked={course.published} className="w-4 h-4" /> Publicada</label>
          <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="featured" defaultChecked={course.featured} className="w-4 h-4" /> Destaque</label>
        </div>

        <div className="sm:col-span-2 border-t border-border pt-4 mt-1">
          <p className="adm-label mb-3">Apenas para formações em direto</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="adm-label">Data / hora</label>
              <input name="startAt" type="datetime-local" defaultValue={toLocalInput(course.startAt)} className="adm-input" />
            </div>
            <div>
              <label className="adm-label">Calendário</label>
              <input name="sessionsLabel" defaultValue={course.sessionsLabel ?? ""} className="adm-input" />
            </div>
            <div>
              <label className="adm-label">Vagas totais</label>
              <input name="seatsTotal" defaultValue={course.seatsTotal?.toString() ?? ""} className="adm-input" />
            </div>
          </div>
          {live && <p className="text-[12px] text-faint mt-2">{course.seatsTaken} inscritos · {course._count.enrollments} inscrições no total</p>}
        </div>

        <div className="sm:col-span-2">
          <button className="btn btn-primary">Guardar alterações</button>
        </div>
      </form>

      {/* Aulas */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-xl">Aulas <span className="text-muted text-base font-normal">({course.lessons.length})</span></h2>
      </div>

      <form action={addLesson.bind(null, course.id)} className="adm-card p-5 grid sm:grid-cols-2 gap-3 mb-4">
        <div className="sm:col-span-2">
          <label className="adm-label">Título da aula</label>
          <input name="title" required className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Link do vídeo (YouTube/Vimeo)</label>
          <input name="videoUrl" placeholder="https://youtu.be/..." className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Duração</label>
          <input name="durationLabel" placeholder="12:30" className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Descrição (opcional)</label>
          <input name="description" className="adm-input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted sm:col-span-2"><input type="checkbox" name="isFree" className="w-4 h-4" /> Aula de amostra</label>
        <div className="sm:col-span-2"><button className="btn btn-primary text-sm">Adicionar aula</button></div>
      </form>

      <div className="adm-card divide-y divide-border">
        {course.lessons.length === 0 && <p className="px-5 py-6 text-muted text-sm">Ainda não há aulas.</p>}
        {course.lessons.map((l, i) => (
          <div key={l.id} className="flex items-center gap-4 px-5 py-3">
            <span className="w-7 h-7 rounded-full bg-brand-soft text-brand grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{l.title}</p>
              <p className="text-[11px] text-faint">{l.durationLabel || "—"}{l.isFree ? " · amostra" : ""}{l.videoUrl ? "" : " · sem vídeo"}</p>
            </div>
            <form action={deleteLesson.bind(null, l.id, course.id)}>
              <button className="text-xs text-red-500 hover:text-red-400">Apagar</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
