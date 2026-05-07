import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'
import MobileNav from './mobile-nav'

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  const displayName = claims?.user_metadata?.full_name as string | undefined
  const avatarUrl = claims?.user_metadata?.avatar_url as string | undefined

  return (
    <header className="bg-[#1c1d1f] text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight text-white">
          Bukimix
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/courses" className="text-sm text-gray-300 transition-colors hover:text-white">
            講座一覧
          </Link>
          {claims && (
            <Link href="/my" className="text-sm text-gray-300 transition-colors hover:text-white">
              マイページ
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <MobileNav isLoggedIn={!!claims} />
          {claims ? (
            <>
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt={displayName ?? 'ユーザー'}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-white/20"
                />
              )}
              {displayName && (
                <span className="hidden text-sm font-medium text-white sm:block">
                  {displayName}
                </span>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded border border-white/60 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#1c1d1f]"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
