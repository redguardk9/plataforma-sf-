import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/constants";
import { createPost, togglePostPublished } from "../actions";

export default async function AdminBlog() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="text-muted mt-2 mb-8">Escreva e publique notas de clínica.</p>

      <details className="card p-6 mb-8">
        <summary className="cursor-pointer font-semibold flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-brand text-white grid place-items-center text-sm">+</span>
          Novo artigo
        </summary>
        <form action={createPost} className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="sm:col-span-2">
            <label className="label">Título</label>
            <input name="title" required className="input" />
          </div>
          <div>
            <label className="label">Categoria</label>
            <input name="category" placeholder="Clínica" className="input" />
          </div>
          <div>
            <label className="label">Minutos de leitura</label>
            <input name="readMinutes" placeholder="5" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Resumo</label>
            <input name="excerpt" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Conteúdo (separe parágrafos com linha em branco)</label>
            <textarea name="content" rows={6} className="input resize-none" />
          </div>
          <div>
            <button className="btn btn-primary">Publicar artigo</button>
          </div>
        </form>
      </details>

      <div className="card divide-y divide-border">
        {posts.length === 0 && <p className="px-5 py-6 text-muted text-sm">Ainda não há artigos.</p>}
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/blog/${p.slug}`} className="font-semibold hover:text-glow truncate">{p.title}</Link>
                <span className={`pill ${p.published ? "pill-success" : "pill-brand"}`}>{p.published ? "Publicado" : "Rascunho"}</span>
              </div>
              <p className="text-[11px] text-faint font-mono mt-0.5">{p.category} · {formatDate(p.publishedAt)}</p>
            </div>
            <Link href={`/admin/blog/${p.id}`} className="text-xs text-brand font-semibold hover:underline">Editar</Link>
            <form action={togglePostPublished.bind(null, p.id)}>
              <button className="text-xs text-muted hover:text-ink">{p.published ? "Despublicar" : "Publicar"}</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
