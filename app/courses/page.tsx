import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cacheLife, cacheTag } from 'next/cache'
import CourseCard from '@/components/course-card'
import type { Course } from '@/lib/types'

export const metadata: Metadata = {
  title: '講座一覧',
  description: '公開中のすべての講座を一覧表示しています。',
}

type CourseWithCount = Course & { lesson_count: number }

async function getCourses(): Promise<CourseWithCount[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('courses')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data } = await supabase
    .from('courses')
    .select('*, lessons(id)')
    .eq('is_published', true)
    .eq('lessons.is_published', true)
    .order('sort_order', { ascending: true })

  return (data ?? []).map((c) => ({
    ...(c as Course),
    lesson_count: Array.isArray(c.lessons) ? c.lessons.length : 0,
  }))
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">講座一覧</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          全 {courses.length} 講座 — すべて無料で受講できます
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          現在公開中の講座はありません。
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </main>
  )
}
