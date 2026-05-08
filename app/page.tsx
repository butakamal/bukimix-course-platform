import Link from 'next/link'
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { createClient, createCacheClient } from '@/lib/supabase/server'
import CourseCard from '@/components/course-card'
import type { Course } from '@/lib/types'

async function getFeaturedCourses() {
  'use cache'
  cacheLife('hours')
  cacheTag('courses')

  const supabase = createCacheClient()

  const { data } = await supabase
    .from('courses')
    .select('*, lessons(id)')
    .eq('is_published', true)
    .eq('lessons.is_published', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  return (data ?? []).map((c) => ({
    ...(c as Course),
    lesson_count: Array.isArray(c.lessons) ? c.lessons.length : 0,
  }))
}

async function HeroCTA() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  return isLoggedIn ? (
    <Link
      href="/my"
      className="inline-flex items-center rounded-md bg-white px-8 py-3.5 text-base font-bold text-[#1c1d1f] transition-opacity hover:opacity-90"
    >
      マイページへ
    </Link>
  ) : (
    <Link
      href="/courses"
      className="inline-flex items-center rounded-md bg-white px-8 py-3.5 text-base font-bold text-[#1c1d1f] transition-opacity hover:opacity-90"
    >
      無料で始める →
    </Link>
  )
}

export default async function TopPage() {
  const courses = await getFeaturedCourses()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1c1d1f] to-[#2d1b69] py-20 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-300">
              完全無料のプログラミング学習
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              動画で学ぶ、<br />
              <span className="text-purple-300">スキル</span>を磨く
            </h1>
            <p className="text-lg text-gray-300">
              体系的な動画講座で実践的なスキルを学べる無料プラットフォーム。
              Next.js、TypeScript、Reactなど最新技術を習得しましょう。
            </p>
            <Suspense
              fallback={
                <div className="inline-block h-12 w-40 animate-pulse rounded-md bg-white/20" />
              }
            >
              <HeroCTA />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-border bg-muted/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6 px-4 py-3 text-sm text-muted-foreground">
          <span>✓ 全講座無料</span>
          <span>✓ ログイン不要で視聴可能</span>
          <span>✓ 進捗管理機能つき</span>
          <span>✓ スマホ・PC対応</span>
        </div>
      </div>

      {/* Featured courses */}
      {courses.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-4 py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">注目の講座</h2>
              <p className="mt-1 text-sm text-muted-foreground">人気の講座をチェックしよう</p>
            </div>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Bukimix で学ぶ理由</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: '🎬',
                title: '動画でわかりやすく',
                desc: 'テキストだけではわかりにくい概念も、動画で視覚的に理解できます。',
              },
              {
                icon: '🆓',
                title: '完全無料',
                desc: 'すべての講座・レッスンを登録なしで無料でご利用いただけます。',
              },
              {
                icon: '📊',
                title: '進捗を管理',
                desc: 'ログインすると学習進捗を記録。どこまで学んだか一目でわかります。',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 text-center space-y-3"
              >
                <div className="text-4xl">{f.icon}</div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-[#1c1d1f] py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <h2 className="text-2xl font-bold">今すぐ学習を始めよう</h2>
          <p className="text-gray-400">無料・登録不要で全講座にアクセスできます。</p>
          <Link
            href="/courses"
            className="inline-flex items-center rounded-md bg-purple-600 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-purple-700"
          >
            講座一覧を見る
          </Link>
        </div>
      </section>
    </>
  )
}
