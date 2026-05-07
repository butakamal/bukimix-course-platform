export default function CoursesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 h-9 w-32 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-border"
          >
            <div className="aspect-video w-full animate-pulse bg-muted" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
