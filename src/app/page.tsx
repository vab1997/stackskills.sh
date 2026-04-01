import { Hero } from "@/components/layout/hero";
import { SkillsDiscoveryFlowSkeleton } from "@/components/skeletons/skills-discovery-flow-skeleton";
import { getSessionUser } from "@/features/auth/server";
import { SkillsDiscoveryFlow } from "@/features/skills/components/skills-discovery-flow";
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
      <SkillsDiscoveryFlow user={session.user} repositories={repos} />
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-30">
      <Hero />
      <Suspense fallback={<SkillsDiscoveryFlowSkeleton />}>
        <WrapperSection />
      </Suspense>
    </main>
  );
}
