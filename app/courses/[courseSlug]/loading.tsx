export default function CourseDetailLoading() {
  return (
    <>
      <div className="bg-[#1c1d1f]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-white/20" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="h-8 w-2/3 animate-pulse rounded bg-white/20" />
              <div className="h-4 w-full animate-pulse rounded bg-white/20" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/20" />
            </div>
            <div className="h-11 w-36 animate-pulse rounded-md bg-white/20" />
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="mb-3 h-6 w-28 animate-pulse rounded bg-muted" />
            <ol className="divide-y divide-border rounded-xl border border-border">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </li>
              ))}
            </ol>
          </section>
          <aside>
            <div className="h-10 animate-pulse rounded bg-muted" />
          </aside>
        </div>
      </main>
    </>
  )
}
