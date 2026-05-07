'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-extrabold text-muted-foreground/30">500</p>
      <h1 className="text-2xl font-bold">エラーが発生しました</h1>
      <p className="text-muted-foreground">
        予期しないエラーが発生しました。しばらく経ってからお試しください。
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        再試行する
      </button>
    </main>
  )
}
