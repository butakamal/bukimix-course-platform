import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cacheLife, cacheTag } from 'next/cache'
import { createCacheClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import LessonVideoSection from '@/components/lesson-video-section-dynamic'
import MarkAsCompletedButton from '@/components/mark-as-completed-button'
import LessonList from '@/components/lesson-list'
import ReactMarkdown from 'react-markdown'
import type { Course, Lesson } from '@/lib/types'

// ─── Cached static data (shared across all users) ────────────────────────────

async function getLessonData(courseSlug: string, lessonSlug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('courses')

  const supabase = createCacheClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('slug', courseSlug)
    .eq('is_published', true)
    .eq('lessons.is_published', true)
    .order('sort_order', { referencedTable: 'lessons', ascending: true })
    .single()

  if (!course) return null

  const lessons = (course.lessons ?? []) as Lesson[]
  const lesson = lessons.find((l) => l.slug === lessonSlug)
  if (!lesson) return null

  return {
    course: course as Course,
    lessons,
    lesson,
  }
}

// ─── Single per-user streaming section (one progress query) ──────────────────

async function UserInteractiveSection({
  lesson,
  lessons,
  course,
  courseSlug,
  prevLesson,
  nextLesson,
}: {
  lesson: Lesson
  lessons: Lesson[]
  course: Course
  courseSlug: string
  prevLesson: Lesson | null
  nextLesson: Lesson | null
}) {
  const { supabase, userId } = await getAuthUser()

  const completedIds = userId
    ? await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .in('lesson_id', lessons.map((l) => l.id))
        .then(({ data }) => new Set((data ?? []).map((r) => r.lesson_id)))
    : new Set<string>()

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold leading-snug">{lesson.title}</h1>
          <MarkAsCompletedButton
            lessonId={lesson.id}
            courseSlug={courseSlug}
            isCompleted={completedIds.has(lesson.id)}
          />
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
        <LessonList
          lessons={lessons}
          courseSlug={courseSlug}
          completedIds={completedIds}
          isLoggedIn={!!userId}
          currentLessonSlug={lesson.slug}
        />
      </aside>
    </div>
  )
}

// ─── Route exports ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const supabase = createCacheClient()
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

  const data = await getLessonData(courseSlug, lessonSlug)
  if (!data) notFound()

  const { course, lessons, lesson } = data

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      {/*
       * Video renders immediately as part of the static shell.
       * isCompleted=false: markAsCompleted uses upsert+ignoreDuplicates so re-calling is safe.
       */}
      <div className="mb-6">
        <LessonVideoSection
          videoId={lesson.youtube_video_id}
          lessonId={lesson.id}
          courseSlug={courseSlug}
          isCompleted={false}
        />
      </div>

      {/* Title, button, description, nav, and sidebar all share one progress query */}
      <Suspense
        fallback={
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-xl font-bold leading-snug">{lesson.title}</h1>
                <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
            <aside>
              <h2 className="mb-3 text-sm font-semibold">{course.title}</h2>
              <ol className="divide-y divide-border rounded-xl border border-border">
                {lessons.map((l) => (
                  <li
                    key={l.id}
                    className="h-12 animate-pulse bg-muted/40 first:rounded-t-xl last:rounded-b-xl"
                  />
                ))}
              </ol>
            </aside>
          </div>
        }
      >
        <UserInteractiveSection
          lesson={lesson}
          lessons={lessons}
          course={course}
          courseSlug={courseSlug}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
        />
      </Suspense>
    </main>
  )
}
