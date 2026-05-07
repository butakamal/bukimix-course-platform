export default function MyPageLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border">
            <div className="aspect-video animate-pulse bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-2 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
