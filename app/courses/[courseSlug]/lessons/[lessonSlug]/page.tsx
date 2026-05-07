import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cacheLife, cacheTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import LessonVideoSection from '@/components/lesson-video-section'
import MarkAsCompletedButton from '@/components/mark-as-completed-button'
import LessonList from '@/components/lesson-list'
import ReactMarkdown from 'react-markdown'
import type { Course, Lesson } from '@/lib/types'

// ─── Cached static data (shared across all users) ────────────────────────────

function cacheClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

async function getLessonData(courseSlug: string, lessonSlug: string) {
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

  const lesson = (lessons ?? []).find((l) => l.slug === lessonSlug)
  if (!lesson) return null

  return {
    course: course as Course,
    lessons: (lessons ?? []) as Lesson[],
    lesson: lesson as Lesson,
  }
}

// ─── Per-user streaming sections ─────────────────────────────────────────────

async function CompletedButtonSection({
  lessonId,
  courseSlug,
}: {
  lessonId: string
  courseSlug: string
}) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub ?? null

  const isCompleted = userId
    ? await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle()
        .then(({ data }) => !!data)
    : false

  return (
    <MarkAsCompletedButton
      lessonId={lessonId}
      courseSlug={courseSlug}
      isCompleted={isCompleted}
    />
  )
}

async function SidebarProgressSection({
  lessons,
  courseSlug,
  currentLessonSlug,
}: {
  lessons: Lesson[]
  courseSlug: string
  currentLessonSlug: string
}) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub ?? null

  const completedIds = userId
    ? await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .in('lesson_id', lessons.map((l) => l.id))
        .then(({ data }) => new Set((data ?? []).map((r) => r.lesson_id)))
    : new Set<string>()

  return (
    <LessonList
      lessons={lessons}
      courseSlug={courseSlug}
      completedIds={completedIds}
      isLoggedIn={!!userId}
      currentLessonSlug={currentLessonSlug}
    />
  )
}

// ─── Route exports ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const supabase = cacheClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, lessons(slug)')
    .eq('is_published', true)
    .eq('lessons.is_published', true)

  return (courses ?? []).flatMap((c) =>
    ((c.lessons ?? []) as { slug: string }[]).map((l) => ({
      courseSlug: c.slug,
      lessonSlug: l.slug,
    }))
  )
}

export async function generateMetadata(
  props: PageProps<'/courses/[courseSlug]/lessons/[lessonSlug]'>
) {
  const { courseSlug, lessonSlug } = await props.params
  const data = await getLessonData(courseSlug, lessonSlug)
  if (!data) return {}
  return { title: `${data.lesson.title} | ${data.course.title}` }
}

export default async function LessonPage(
  props: PageProps<'/courses/[courseSlug]/lessons/[lessonSlug]'>
) {
  const { courseSlug, lessonSlug } = await props.params

  // Static cached data — no per-user info, streams immediately
  const data = await getLessonData(courseSlug, lessonSlug)
  if (!data) notFound()

  const { course, lessons, lesson } = data

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {/*
           * isCompleted=false: the facade thumbnail renders immediately.
           * markAsCompleted uses upsert+ignoreDuplicates so re-calling is safe.
           */}
          <LessonVideoSection
            videoId={lesson.youtube_video_id}
            lessonId={lesson.id}
            courseSlug={courseSlug}
            isCompleted={false}
          />

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold leading-snug">{lesson.title}</h1>

            {/* Streams in after progress query completes */}
            <Suspense
              fallback={
                <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
              }
            >
              <CompletedButtonSection
                lessonId={lesson.id}
                courseSlug={courseSlug}
              />
            </Suspense>
          </div>

          {lesson.description && (
            <article className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{lesson.description}</ReactMarkdown>
            </article>
          )}

          <nav className="flex items-center justify-between border-t border-border pt-4">
            {prevLesson ? (
              <Link
                href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ← {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson && (
              <Link
                href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {nextLesson.title} →
              </Link>
            )}
          </nav>
        </div>

        <aside>
          <h2 className="mb-3 text-sm font-semibold">{course.title}</h2>

          {/* Sidebar lesson list streams in with completion status */}
          <Suspense
            fallback={
              <ol className="divide-y divide-border rounded-xl border border-border">
                {lessons.map((l) => (
                  <li key={l.id} className="h-12 animate-pulse bg-muted/40 first:rounded-t-xl last:rounded-b-xl" />
                ))}
              </ol>
            }
          >
            <SidebarProgressSection
              lessons={lessons}
              courseSlug={courseSlug}
              currentLessonSlug={lessonSlug}
            />
          </Suspense>
        </aside>
      </div>
    </main>
  )
}
