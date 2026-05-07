import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-extrabold text-muted-foreground/30">404</p>
      <h1 className="text-2xl font-bold">ページが見つかりません</h1>
      <p className="text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        トップページへ
      </Link>
    </main>
  )
}
