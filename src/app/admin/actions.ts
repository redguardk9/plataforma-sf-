"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { toEmbedUrl } from "@/lib/video";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, model: "course" | "post"): Promise<string> {
  let slug = base || "item";
  let i = 2;
  // @ts-expect-error índice dinâmico do prisma
  while (await prisma[model].findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ---------- Formações ----------
export async function createCourse(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const type = String(formData.get("type") ?? "RECORDED");
  const priceEuros = parseFloat(String(formData.get("price") ?? "0").replace(",", ".")) || 0;
  const startRaw = String(formData.get("startAt") ?? "");

  await prisma.course.create({
    data: {
      slug: await uniqueSlug(slugify(title), "course"),
      title,
      subtitle: String(formData.get("subtitle") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || String(formData.get("subtitle") ?? ""),
      type,
      level: String(formData.get("level") ?? "Todos os níveis"),
      durationLabel: String(formData.get("durationLabel") ?? ""),
      priceCents: Math.round(priceEuros * 100),
      coverColor: String(formData.get("coverColor") ?? "#1E6FE8"),
      published: true,
      startAt: type === "LIVE" && startRaw ? new Date(startRaw) : null,
      sessionsLabel: type === "LIVE" ? String(formData.get("sessionsLabel") ?? "") : null,
      seatsTotal: type === "LIVE" ? parseInt(String(formData.get("seatsTotal") ?? "0")) || null : null,
      enrollUrl: String(formData.get("enrollUrl") ?? "").trim() || null,
      enrollLabel: String(formData.get("enrollLabel") ?? "").trim() || null,
    },
  });
  revalidatePath("/admin/formacoes");
  revalidatePath("/formacoes");
}

export async function updateCourse(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const type = String(formData.get("type") ?? "RECORDED");
  const priceEuros = parseFloat(String(formData.get("price") ?? "0").replace(",", ".")) || 0;
  const startRaw = String(formData.get("startAt") ?? "");

  await prisma.course.update({
    where: { id },
    data: {
      title,
      subtitle: String(formData.get("subtitle") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      type,
      level: String(formData.get("level") ?? "Todos os níveis"),
      durationLabel: String(formData.get("durationLabel") ?? "").trim(),
      priceCents: Math.round(priceEuros * 100),
      coverColor: String(formData.get("coverColor") ?? "#1E6FE8"),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
      startAt: type === "LIVE" && startRaw ? new Date(startRaw) : null,
      sessionsLabel: type === "LIVE" ? String(formData.get("sessionsLabel") ?? "") || null : null,
      seatsTotal: type === "LIVE" ? parseInt(String(formData.get("seatsTotal") ?? "")) || null : null,
      enrollUrl: String(formData.get("enrollUrl") ?? "").trim() || null,
      enrollLabel: String(formData.get("enrollLabel") ?? "").trim() || null,
    },
  });
  revalidatePath(`/admin/formacoes/${id}`);
  revalidatePath("/admin/formacoes");
  revalidatePath("/formacoes");
}

export async function toggleCoursePublished(id: string) {
  await requireAdmin();
  const c = await prisma.course.findUnique({ where: { id } });
  if (!c) return;
  await prisma.course.update({ where: { id }, data: { published: !c.published } });
  revalidatePath("/admin/formacoes");
  revalidatePath("/formacoes");
}

export async function deleteCourse(id: string) {
  await requireAdmin();
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/formacoes");
  revalidatePath("/formacoes");
}

// ---------- Aulas ----------
export async function addLesson(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const count = await prisma.lesson.count({ where: { courseId } });
  await prisma.lesson.create({
    data: {
      courseId,
      order: count,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      videoUrl: toEmbedUrl(String(formData.get("videoUrl") ?? "").trim()) || null,
      durationLabel: String(formData.get("durationLabel") ?? "").trim(),
      isFree: formData.get("isFree") === "on",
    },
  });
  revalidatePath(`/admin/formacoes/${courseId}`);
}

export async function deleteLesson(id: string, courseId: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/admin/formacoes/${courseId}`);
}

// ---------- Utilizadores ----------
export async function toggleUserAdmin(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) return; // não pode alterar o próprio papel
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return;
  if (u.role === "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) return; // não remover o último administrador
  }
  await prisma.user.update({ where: { id }, data: { role: u.role === "ADMIN" ? "USER" : "ADMIN" } });
  revalidatePath("/admin/utilizadores");
}

export async function toggleSupervision(id: string) {
  await requireAdmin();
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return;
  await prisma.user.update({ where: { id }, data: { supervisionAccess: !u.supervisionAccess } });
  revalidatePath("/admin/utilizadores");
}

// ---------- Pagamentos ----------
export async function markPaymentPaid(id: string) {
  await requireAdmin();
  const payment = await prisma.payment.update({ where: { id }, data: { status: "PAID" } });
  // Confirmar o pagamento ativa a inscrição na formação correspondente.
  if (payment.courseId) {
    await prisma.enrollment.updateMany({
      where: { userId: payment.userId, courseId: payment.courseId },
      data: { status: "ACTIVE" },
    });
  }
  revalidatePath("/admin/pagamentos");
  revalidatePath("/admin");
  revalidatePath("/conta");
}

// ---------- Blog ----------
export async function createPost(formData: FormData) {
  const admin = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await prisma.post.create({
    data: {
      slug: await uniqueSlug(slugify(title), "post"),
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      category: String(formData.get("category") ?? "Clínica"),
      readMinutes: parseInt(String(formData.get("readMinutes") ?? "5")) || 5,
      coverColor: String(formData.get("coverColor") ?? "#1E6FE8"),
      published: true,
      authorId: admin.id,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await prisma.post.update({
    where: { id },
    data: {
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      category: String(formData.get("category") ?? "Clínica"),
      readMinutes: parseInt(String(formData.get("readMinutes") ?? "5")) || 5,
      coverColor: String(formData.get("coverColor") ?? "#1E6FE8"),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostPublished(id: string) {
  await requireAdmin();
  const p = await prisma.post.findUnique({ where: { id } });
  if (!p) return;
  await prisma.post.update({ where: { id }, data: { published: !p.published } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

