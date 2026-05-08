import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">ページが見つかりません</p>
      <Link href="/admin/courses" className="text-sm text-primary hover:underline">
        講座管理へ戻る
      </Link>
    </div>
  )
}
