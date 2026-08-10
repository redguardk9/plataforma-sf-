import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CoverArt } from "@/components/CoverArt";
import { formatDate } from "@/lib/constants";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <div className="mb-9">
        <span className="eyebrow">Blog</span>
        <h1 className="mt-3.5 text-[clamp(28px,4vw,40px)] font-semibold">Notas de clínica</h1>
        <p className="text-muted mt-2.5 max-w-[54ch]">
          Reflexões sobre o sujeito, o sintoma e os temas com que trabalho — trauma, luto,
          comportamento desviante.
        </p>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group">
            <div className="rounded-xl overflow-hidden mb-4">
              <CoverArt color={p.coverColor} seed={i * 5 + 2} height={180} />
            </div>
            <span className="font-mono text-[10.5px] tracking-widest uppercase text-glow">{p.category}</span>
            <h3 className="text-xl font-semibold mt-2 mb-2 group-hover:text-glow transition-colors">{p.title}</h3>
            <p className="text-sm text-muted">{p.excerpt}</p>
            <div className="font-mono text-[11px] text-faint mt-3 flex gap-3">
              <span>{formatDate(p.publishedAt)}</span>
              <span>{p.readMinutes} min de leitura</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
