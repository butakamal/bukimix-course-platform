import Link from 'next/link'
import type { Lesson } from '@/lib/types'

function formatDuration(seconds: number | null) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

type Props = {
  lessons: Lesson[]
  courseSlug: string
  completedIds?: Set<string>
  isLoggedIn: boolean
  currentLessonSlug?: string
}

export default function LessonList({
  lessons,
  courseSlug,
  completedIds,
  isLoggedIn,
  currentLessonSlug,
}: Props) {
  return (
    <ol className="divide-y divide-border rounded-xl border border-border">
      {lessons.map((lesson, i) => {
        const isCompleted = completedIds?.has(lesson.id) ?? false
        const isCurrent = lesson.slug === currentLessonSlug
        const href = isLoggedIn
          ? `/courses/${courseSlug}/lessons/${lesson.slug}`
          : '/login'

        return (
          <li key={lesson.id}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted ${
                isCurrent ? 'bg-muted font-semibold' : ''
              }`}
            >
              <span className="w-6 shrink-0 text-center text-xs text-muted-foreground">
                {isCompleted ? (
                  <span className="text-primary">✓</span>
                ) : (
                  i + 1
                )}
              </span>
              <span className="flex-1 leading-snug">{lesson.title}</span>
              {lesson.duration_seconds && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDuration(lesson.duration_seconds)}
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
