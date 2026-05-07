import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cacheLife, cacheTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import LessonList from '@/components/lesson-list'
import ProgressBar from '@/components/progress-bar'
import type { Course, Lesson } from '@/lib/types'

function cacheClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

async function getCourseWithLessons(courseSlug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('courses')

  const supabase = cacheClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .eq('is_published', true)
    .single()

  if (!course) return null

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return { course: course as Course, lessons: (lessons ?? []) as Lesson[] }
}

export async function generateStaticParams() {
  const supabase = cacheClient()
  const { data } = await supabase
    .from('courses')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map((c) => ({ courseSlug: c.slug }))
}

export async function generateMetadata(props: PageProps<'/courses/[courseSlug]'>) {
  const { courseSlug } = await props.params
  const result = await getCourseWithLessons(courseSlug)
  if (!result) return {}
  return {
    title: result.course.title,
    description: result.course.description ?? undefined,
  }
}

async function UserProgress({ lessons }: { lessons: Lesson[] }) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) return null

  const { data: progressRows } = await supabase
    .from('progress')
    .select('lesson_id')
    .in(
      'lesson_id',
      lessons.map((l) => l.id)
    )

  const completedIds = new Set((progressRows ?? []).map((r) => r.lesson_id))
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">進捗</h3>
      <ProgressBar completed={completedIds.size} total={lessons.length} />
    </div>
  )
}

export default async function CourseDetailPage(props: PageProps<'/courses/[courseSlug]'>) {
  const { courseSlug } = await props.params
  const result = await getCourseWithLessons(courseSlug)
  if (!result) notFound()

  const { course, lessons } = result

  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const isLoggedIn = !!claimsData?.claims

  const firstLesson = lessons[0]

  return (
    <>
      {/* Dark hero banner */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <nav className="mb-4 flex items-center gap-2 text-xs text-gray-400">
            <Link href="/courses" className="transition-colors hover:text-white">
              講座一覧
            </Link>
            <span>/</span>
            <span className="text-gray-300">{course.title}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{course.title}</h1>
              {course.description && (
                <p className="text-sm leading-relaxed text-gray-300">{course.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-amber-400">4.7</span>
                  <span className="text-amber-400">★★★★★</span>
                  <span className="text-gray-400">(1,234)</span>
                </div>
                <span className="text-gray-400">{lessons.length} レッスン</span>
                <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                  無料
                </span>
              </div>
              <p className="text-xs text-gray-400">講師: Bukimix 講師</p>
            </div>

            {firstLesson && (
              <div className="shrink-0">
                <Link
                  href={
                    isLoggedIn
                      ? `/courses/${courseSlug}/lessons/${firstLesson.slug}`
                      : '/login'
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-700"
                >
                  ▶ 今すぐ始める
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">レッスン一覧</h2>
            <LessonList
              lessons={lessons}
              courseSlug={courseSlug}
              isLoggedIn={isLoggedIn}
            />
          </section>

          <aside className="space-y-6">
            <Suspense fallback={<div className="h-10 animate-pulse rounded bg-muted" />}>
              <UserProgress lessons={lessons} />
            </Suspense>
          </aside>
        </div>
      </main>
    </>
  )
}
