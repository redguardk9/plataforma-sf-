import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CoverArt } from "@/components/CoverArt";
import { formatDate } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  return { title: post?.title ?? "Artigo" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: true } });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[720px] px-6 py-16">
      <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
        Voltar ao blog
      </Link>

      <span className="font-mono text-[11px] tracking-widest uppercase text-glow">{post.category}</span>
      <h1 className="text-[clamp(30px,5vw,44px)] font-semibold mt-3 mb-4">{post.title}</h1>
      <div className="font-mono text-[12px] text-faint flex gap-3 mb-8">
        <span>{post.author?.name ?? "Sérgio Fonseca"}</span>
        <span>·</span>
        <span>{formatDate(post.publishedAt)}</span>
        <span>·</span>
        <span>{post.readMinutes} min</span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-10">
        <CoverArt color={post.coverColor} seed={post.title.length + 4} height={240} />
      </div>

      <div className="text-[17px] leading-[1.75] text-muted flex flex-col gap-5">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className={i === 0 ? "text-ink text-[19px]" : ""}>{para}</p>
        ))}
      </div>
    </article>
  );
}
