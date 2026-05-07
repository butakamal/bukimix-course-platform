import Link from 'next/link'

export default function LessonNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">レッスンが見つかりません</h1>
      <p className="text-muted-foreground">指定されたレッスンは存在しないか、非公開です。</p>
      <Link href="/courses" className="text-sm text-primary hover:underline">
        講座一覧へ戻る
      </Link>
    </main>
  )
}
