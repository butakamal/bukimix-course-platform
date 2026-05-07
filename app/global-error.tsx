'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="ja">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        <p className="text-6xl font-extrabold opacity-20">500</p>
        <h1 className="text-2xl font-bold">重大なエラーが発生しました</h1>
        <p className="text-gray-500">
          アプリケーションで予期しないエラーが発生しました。
        </p>
        <button
          onClick={reset}
          className="mt-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          再試行する
        </button>
      </body>
    </html>
  )
}
