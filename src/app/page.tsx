import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { getSessionUser } from "@/features/auth/server";
import { RepoExplorer } from "@/features/skills/components/repo-explorer";
import { hasRepoScope } from "@/features/skills/services";
import { Suspense } from "react";

async function WrapperSection() {
  const session = await getSessionUser();
  const hasRepoAccess = session.user
    ? await hasRepoScope(session.user.id)
    : false;

  return (
    <section className="flex w-full flex-col items-center justify-center text-white">
      {session.user ? <RepoExplorer hasRepoAccess={hasRepoAccess} /> : null}
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center pb-20">
        <Hero />
        <Suspense>
          <WrapperSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
