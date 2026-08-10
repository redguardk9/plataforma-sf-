import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export default async function Perfil() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  async function updateProfile(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user) return;
    const name = String(formData.get("name") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    if (name) await prisma.user.update({ where: { id: s.user.id }, data: { name, bio } });
    revalidatePath("/conta/perfil");
  }

  return (
    <div className="p-6 lg:p-10 max-w-[600px]">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      <p className="text-muted mt-2 mb-8">Os seus dados pessoais.</p>

      <form action={updateProfile} className="card p-6 flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="name">Nome</label>
          <input id="name" name="name" defaultValue={user?.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" defaultValue={user?.email} disabled className="input opacity-60" />
        </div>
        <div>
          <label className="label" htmlFor="bio">Sobre si (opcional)</label>
          <textarea id="bio" name="bio" rows={3} defaultValue={user?.bio ?? ""} className="input resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary">Guardar alterações</button>
          {user?.supervisionAccess && <span className="pill pill-brand">Acesso à supervisão ativo</span>}
        </div>
      </form>

      <h2 className="text-lg font-bold mt-10 mb-4">Segurança</h2>
      <div className="card p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
