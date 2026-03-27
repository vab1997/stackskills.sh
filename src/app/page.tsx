import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { RepoExplorerSkeleton } from "@/components/skeletons/repo-explorer-skeleton";
import { getSessionUser } from "@/features/auth/server";
import { RepoExplorer } from "@/features/skills/components/repo-explorer";
import { getRepositories } from "@/features/skills/services/get-repositories";
import { Suspense } from "react";

async function WrapperSection() {
  const sessionPromise = getSessionUser();
  const reposPromise = sessionPromise.then((session) => {
    if (!session?.user?.id) {
      return null;
    }

    return getRepositories({ userId: session.user.id });
  });

  const [session, repos] = await Promise.all([sessionPromise, reposPromise]);

  return (
    <section className="flex w-full flex-col items-center justify-center text-white">
      <RepoExplorer user={session.user} repositories={repos} />
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-30">
        <Hero />
        <Suspense fallback={<RepoExplorerSkeleton />}>
          <WrapperSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
