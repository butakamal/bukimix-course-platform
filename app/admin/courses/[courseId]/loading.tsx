export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="max-w-2xl space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}
