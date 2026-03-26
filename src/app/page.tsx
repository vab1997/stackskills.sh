import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { RepoExplorerSkeleton } from "@/components/skeletons/repo-explorer-skeleton";
import { getSessionUser } from "@/features/auth/server";
import { RepoExplorer } from "@/features/skills/components/repo-explorer";
import { hasRepoScope } from "@/features/skills/services";
import { Suspense } from "react";

async function WrapperSection() {
  const sessionPromise = getSessionUser();
  const hasRepoAccessPromise = sessionPromise.then((session) =>
    session.user ? hasRepoScope(session.user.id) : false,
  );

  const [session, hasRepoAccess] = await Promise.all([
    sessionPromise,
    hasRepoAccessPromise,
  ]);

  return (
    <section className="flex w-full flex-col items-center justify-center text-white">
      <RepoExplorer hasRepoAccess={hasRepoAccess} user={session.user} />
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
