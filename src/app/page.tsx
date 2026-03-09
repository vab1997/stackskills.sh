import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { getSessionUser } from "@/features/auth/server";
import { RepoExplorer } from "@/features/skills/components/repo-explorer";
import { hasRepoScope } from "@/features/skills/services";

export default async function Home() {
  const session = await getSessionUser();
  const hasRepoAccess = session.user
    ? await hasRepoScope(session.user.id)
    : false;

  return (
    <div>
      <Header user={session.user} />
      <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center pb-16">
        <Hero />

        <section className="flex w-full flex-col items-center justify-center text-white">
          {session.user ? <RepoExplorer hasRepoAccess={hasRepoAccess} /> : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
