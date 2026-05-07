import type { Metadata } from 'next'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 shrink-0 border-r border-border bg-muted/30">
        <div className="flex h-full flex-col gap-1 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            管理画面
          </p>

          <Link
            href="/admin/courses"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            📚 講座管理
          </Link>

          <div className="mt-auto space-y-1 border-t border-border pt-4">
            <Link
              href="/"
              target="_blank"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              ↗ サイトを見る
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
