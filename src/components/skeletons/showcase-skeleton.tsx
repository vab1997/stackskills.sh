export function ShowcaseSkeleton() {
  return (
    <section className="w-full py-16" aria-hidden="true">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid animate-pulse grid-cols-1 gap-2 rounded-xl border border-neutral-800 md:grid-cols-3 md:gap-0 md:rounded-none md:border-none">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`relative flex flex-col px-8 py-6 ${
                index !== 2 ? "border-neutral-800 md:border-r" : ""
              }`}
            >
              <div className="mb-8 flex h-48 items-center justify-center">
                <div className="h-full w-full rounded-lg bg-neutral-800/60" />
              </div>

              <div className="mb-3 h-3 w-32 rounded bg-neutral-800/60" />

              <div className="flex flex-col gap-2">
                <div className="h-3 w-full rounded bg-neutral-800/40" />
                <div className="h-3 w-3/4 rounded bg-neutral-800/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
