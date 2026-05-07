import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProgressBar from '@/components/progress-bar'
import type { Course } from '@/lib/types'

export const metadata: Metadata = {
  title: 'マイページ',
  robots: { index: false },
}

export default async function MyPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) redirect('/login')

  const userId = claimsData.claims.sub
  const displayName = claimsData.claims.user_metadata?.full_name as string | undefined
  const avatarUrl = claimsData.claims.user_metadata?.avatar_url as string | undefined

  // Fetch all progress for this user
  const { data: progressRows } = await supabase
    .from('progress')
    .select('lesson_id, lessons(course_id)')
    .eq('user_id', userId)

  const courseIds = [
    ...new Set(
      (progressRows ?? [])
        .map((r) => (r.lessons as unknown as { course_id: string } | null)?.course_id)
        .filter(Boolean) as string[]
    ),
  ]

  if (courseIds.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <UserHeader displayName={displayName} avatarUrl={avatarUrl} />
        <p className="mt-16 text-center text-muted-foreground">
          まだ学習中の講座がありません。{' '}
          <Link href="/courses" className="text-primary hover:underline">
            講座一覧を見る
          </Link>
        </p>
      </main>
    )
  }

  // Fetch courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*, lessons(id)')
    .in('id', courseIds)
    .eq('is_published', true)
    .eq('lessons.is_published', true)
    .order('sort_order', { ascending: true })

  const completedLessonIds = new Set(
    (progressRows ?? []).map((r) => r.lesson_id)
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <UserHeader displayName={displayName} avatarUrl={avatarUrl} />

      <h2 className="mb-6 mt-10 text-xl font-semibold">学習中の講座</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => {
          const allLessons = (c.lessons as { id: string }[]) ?? []
          const completed = allLessons.filter((l) => completedLessonIds.has(l.id)).length
          const isDone = allLessons.length > 0 && completed === allLessons.length

          return (
            <Link
              key={c.id}
              href={`/courses/${(c as Course).slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-video w-full bg-muted">
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                {isDone && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    完了
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="font-semibold leading-snug group-hover:text-primary">
                  {(c as Course).title}
                </p>
                <ProgressBar completed={completed} total={allLessons.length} />
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

function UserHeader({
  displayName,
  avatarUrl,
}: {
  displayName?: string
  avatarUrl?: string
}) {
  return (
    <div className="flex items-center gap-4">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName ?? 'ユーザー'}
          width={64}
          height={64}
          className="rounded-full"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
          {displayName?.[0] ?? '?'}
        </div>
      )}
      <div>
        <p className="text-lg font-bold">{displayName ?? 'ユーザー'}</p>
      </div>
    </div>
  )
}
