function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/5 ${className}`} />;
}

function StepperSkeleton() {
  return (
    <div className="flex w-full items-center justify-between">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`flex items-center ${index < 2 ? "flex-1" : "flex-none"}`}
        >
          <div className="flex shrink-0 items-center gap-3">
            <SkeletonBox className="size-8 rounded-full" />
            <div className="hidden sm:block">
              <SkeletonBox className="h-3.5 w-20" />
              <SkeletonBox className="mt-1.5 h-2.5 w-28" />
            </div>
          </div>
          {index < 2 && (
            <div className="mx-4 h-px w-full min-w-16 bg-white/10" />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionSkeleton({
  hasTabBar,
  hasPlaceholder,
}: {
  hasTabBar?: boolean;
  hasPlaceholder?: boolean;
}) {
  return (
    <section className="border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center gap-3">
        <SkeletonBox className="size-9 rounded-lg" />
        <div>
          <SkeletonBox className="h-3.5 w-24" />
          <SkeletonBox className="mt-1.5 h-2.5 w-48" />
        </div>
      </div>

      {hasTabBar && (
        <div className="bg-muted/50 flex h-10 w-full gap-1 rounded-lg p-1">
          <SkeletonBox className="h-full flex-1 rounded-md" />
          <SkeletonBox className="h-full flex-1 rounded-md" />
        </div>
      )}

      {hasPlaceholder && (
        <div className="flex flex-col items-center justify-center py-12">
          <SkeletonBox className="mb-3 size-8 rounded-md" />
          <SkeletonBox className="h-3 w-48" />
        </div>
      )}
    </section>
  );
}

export function SkillsDiscoveryFlowSkeleton() {
  return (
    <section className="flex w-full flex-col items-center justify-center text-white">
      <div className="my-8 flex w-full flex-1 flex-col gap-8">
        <div className="mb-10">
          <StepperSkeleton />
        </div>
        <SectionSkeleton hasTabBar />
        <SectionSkeleton />
        <SectionSkeleton hasPlaceholder />
      </div>
    </section>
  );
}
