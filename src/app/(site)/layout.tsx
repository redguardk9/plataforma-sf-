import { auth, signOut } from "@/auth";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const user = session?.user
    ? {
        name: session.user.name,
        role: session.user.role,
        supervisionAccess: session.user.supervisionAccess,
      }
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <Nav user={user} logout={logout} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
