export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      <div className="h-8 w-40 animate-pulse rounded bg-muted" />
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
