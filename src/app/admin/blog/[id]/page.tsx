import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { updatePost } from "../../actions";

export default async function AdminPostEditor({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="p-5 sm:p-8 max-w-[820px]">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link href="/admin/blog" className="text-muted hover:text-ink">Blog</Link>
        <span className="text-faint">/</span>
        <span className="text-ink font-medium truncate">{post.title}</span>
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h1 className="text-2xl">Editar artigo</h1>
        <div className="flex items-center gap-2">
          <span className={`pill ${post.published ? "pill-success" : "pill-brand"}`}>{post.published ? "Publicado" : "Rascunho"}</span>
          <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm text-brand hover:underline">Ver página →</Link>
        </div>
      </div>

      <form action={updatePost.bind(null, post.id)} className="adm-card p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="adm-label">Título</label>
          <input name="title" required defaultValue={post.title} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Categoria</label>
          <input name="category" defaultValue={post.category} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Minutos de leitura</label>
          <input name="readMinutes" defaultValue={post.readMinutes.toString()} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Resumo</label>
          <input name="excerpt" defaultValue={post.excerpt} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Conteúdo (separe parágrafos com linha em branco)</label>
          <textarea name="content" rows={12} defaultValue={post.content} className="adm-input resize-y" />
        </div>
        <div>
          <label className="adm-label">Cor da capa</label>
          <input name="coverColor" defaultValue={post.coverColor} className="adm-input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted self-end pb-2"><input type="checkbox" name="published" defaultChecked={post.published} className="w-4 h-4" /> Publicado</label>
        <div className="sm:col-span-2">
          <button className="btn btn-primary">Guardar alterações</button>
        </div>
      </form>
    </div>
  );
}
